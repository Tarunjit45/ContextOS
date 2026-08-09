"""
ContextOS Phase 3.3 — Live LLM Agent Adapters
Supports LiveBaselineRAGAgent (Control), LiveContextOSAgent (Full Mode), and LiveContextOSCompactAgent (Decision-Grade Context Compiler).
"""

import time
import json
import hashlib
import re
from typing import Dict, List, Any, Tuple

from packages.agents.agent_adapters import assert_no_ground_truth_leakage
from packages.retrieval.hybrid_retriever import HybridRetriever
from packages.memory.memory_ranker import MemoryRanker
from packages.retrieval.temporal_resolver import TemporalStateResolver
from packages.retrieval.entity_resolver import EntityResolver
from packages.graph.context_graph import ContextGraphEngine
from packages.memory.context_composer import ContextComposer
from packages.context.context_compiler import DecisionGradeContextCompiler
from packages.llm.provider import LLMProvider

SYSTEM_PROMPT_TEMPLATE = (
    "You are an assistant answering questions using the provided evidence.\n"
    "Do not invent information.\n"
    "If the evidence is insufficient, say that the information is unavailable."
)

def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

class LiveBaselineRAGAgent:
    """Control Group: Naive BM25 Retrieval -> Top-3 Evidence -> LLM."""
    def __init__(self, provider: LLMProvider):
        self.provider = provider

    async def run(self, task: Dict[str, Any], workspace: Dict[str, Any]) -> Dict[str, Any]:
        assert_no_ground_truth_leakage(task)
        t0 = time.time()
        query = task.get("query", "")
        query_terms = [w.lower() for w in re.findall(r'\w+', query) if len(w) > 2]
        
        comms = workspace.get("communications", [])

        t_ret = time.time()
        scored = []
        for c in comms:
            content = (c.get("content", "") + " " + c.get("subject", "") + " " + c.get("title", "")).lower()
            score = sum(1 for term in query_terms if term in content)
            if score > 0:
                scored.append((score, c))
        scored.sort(key=lambda x: x[0], reverse=True)
        retrieval_ms = (time.time() - t_ret) * 1000.0

        top_3 = [item[1] for item in scored[:3]]
        context_str = "\n---\n".join(f"Document ID: {c['id']}\nType: {c.get('type')}\nContent: {c.get('content')}" for c in top_3)
        if not context_str:
            context_str = "No relevant communications found in workspace."

        user_prompt = f"CONTEXT:\n{context_str}\n\nQUESTION:\n{query}"

        sys_hash = compute_sha256(SYSTEM_PROMPT_TEMPLATE)
        user_hash = compute_sha256(user_prompt)
        ctx_hash = compute_sha256(context_str)

        t_gen = time.time()
        llm_res = self.provider.generate(SYSTEM_PROMPT_TEMPLATE, user_prompt)
        generation_ms = (time.time() - t_gen) * 1000.0
        total_ms = (time.time() - t0) * 1000.0

        retrieved_ids = [c["id"] for c in top_3]
        raw_chars = sum(len(str(c)) for c in comms)

        return {
            "agent_type": "Live Baseline RAG",
            "context_mode": "baseline",
            "response": llm_res.get("text", ""),
            "decision": None,
            "confidence": 0.0,
            "retrieved_evidence": retrieved_ids,
            "selected_evidence_ids": retrieved_ids[:1],
            "rejected_evidence_ids": retrieved_ids[1:],
            "system_prompt": SYSTEM_PROMPT_TEMPLATE,
            "user_prompt": user_prompt,
            "context": context_str,
            "system_prompt_hash": sys_hash,
            "user_prompt_hash": user_hash,
            "context_hash": ctx_hash,
            "provider": llm_res.get("provider", self.provider.__class__.__name__),
            "model": llm_res.get("model", getattr(self.provider, "model", "unknown")),
            "input_tokens": llm_res.get("input_tokens", 0),
            "output_tokens": llm_res.get("output_tokens", 0),
            "cost_usd": llm_res.get("cost_usd"),
            "status": llm_res.get("status", "SUCCESS"),
            "error_message": llm_res.get("error_message"),
            "telemetry": {
                "raw_evidence_count": len(top_3),
                "raw_context_chars": raw_chars,
                "raw_context_tokens": int(raw_chars / 4.0),
                "composed_context_chars": len(context_str),
                "composed_context_tokens": int(len(context_str) / 4.0)
            },
            "latency": {
                "retrieval_ms": round(retrieval_ms, 2),
                "context_composition_ms": 0.0,
                "generation_ms": round(generation_ms, 2),
                "total_ms": round(total_ms, 2)
            }
        }

class LiveContextOSAgent:
    """Full Mode: Hybrid Retrieval -> Memory -> Temporal -> Entity -> Graph -> Full Composition -> LLM."""
    def __init__(self, provider: LLMProvider):
        self.provider = provider
        self.retriever = HybridRetriever()
        self.memory_ranker = MemoryRanker()
        self.temporal_resolver = TemporalStateResolver()
        self.entity_resolver = EntityResolver()
        self.graph_engine = ContextGraphEngine(max_depth=3)
        self.context_composer = ContextComposer(token_budget=8000)

    async def run(self, task: Dict[str, Any], workspace: Dict[str, Any]) -> Dict[str, Any]:
        assert_no_ground_truth_leakage(task)
        t0 = time.time()
        query = task.get("query", "")
        entities = workspace.get("entities", {})
        comms = workspace.get("communications", [])

        t_start_ret = time.time()
        retrieved_items = self.retriever.retrieve(query, comms, entities)
        retrieval_ms = (time.time() - t_start_ret) * 1000.0

        t_start_comp = time.time()
        entity_res = self.entity_resolver.resolve_person(query, entities.get("people", []), retrieved_items)
        temporal_events = self.temporal_resolver.parse_events_from_communications(comms)
        query_date_match = re.search(r'2026-\d{2}-\d{2}', query)
        query_time = (query_date_match.group(0) + " 23:59:59") if query_date_match else "2026-12-31 23:59:59"
        
        reconstructed_state = self.temporal_resolver.resolve_state("comp_hold", "outreach_status", query_time, temporal_events)
        self.graph_engine.build_from_workspace(workspace)
        start_node = entity_res.get("canonical_entity_id") or "p_1"
        graph_res = self.graph_engine.traverse_bounded_relationship(start_node=start_node)
        ranked_memory_scores = self.memory_ranker.rank_memories(query, retrieved_items)

        composed_context = self.context_composer.compose(
            retrieved_items=retrieved_items,
            entities=entities,
            reconstructed_state=reconstructed_state,
            graph_trace=graph_res.get("trace", [])
        )
        context_composition_ms = (time.time() - t_start_comp) * 1000.0

        context_str = json.dumps(composed_context, indent=2)
        user_prompt = f"CONTEXT:\n{context_str}\n\nQUESTION:\n{query}"

        sys_hash = compute_sha256(SYSTEM_PROMPT_TEMPLATE)
        user_hash = compute_sha256(user_prompt)
        ctx_hash = compute_sha256(context_str)

        t_gen = time.time()
        llm_res = self.provider.generate(SYSTEM_PROMPT_TEMPLATE, user_prompt)
        generation_ms = (time.time() - t_gen) * 1000.0
        total_ms = (time.time() - t0) * 1000.0

        top_ids = [item.get("evidence_id") or item.get("id") for item in retrieved_items[:3]]

        return {
            "agent_type": "Live ContextOS Full",
            "context_mode": "full",
            "response": llm_res.get("text", ""),
            "decision": None,
            "confidence": 0.0,
            "retrieved_evidence": top_ids,
            "selected_evidence_ids": top_ids[:1],
            "rejected_evidence_ids": top_ids[1:],
            "system_prompt": SYSTEM_PROMPT_TEMPLATE,
            "user_prompt": user_prompt,
            "context": context_str,
            "system_prompt_hash": sys_hash,
            "user_prompt_hash": user_hash,
            "context_hash": ctx_hash,
            "provider": llm_res.get("provider", self.provider.__class__.__name__),
            "model": llm_res.get("model", getattr(self.provider, "model", "unknown")),
            "input_tokens": llm_res.get("input_tokens", 0),
            "output_tokens": llm_res.get("output_tokens", 0),
            "cost_usd": llm_res.get("cost_usd"),
            "status": llm_res.get("status", "SUCCESS"),
            "error_message": llm_res.get("error_message"),
            "telemetry": composed_context.get("telemetry", {}),
            "latency": {
                "retrieval_ms": round(retrieval_ms, 2),
                "context_composition_ms": round(context_composition_ms, 2),
                "generation_ms": round(generation_ms, 2),
                "total_ms": round(total_ms, 2)
            }
        }

class LiveContextOSCompactAgent:
    """Decision-Grade Context Compiler Agent."""
    def __init__(self, provider: LLMProvider, token_budget: int = 2048):
        self.provider = provider
        self.retriever = HybridRetriever()
        self.memory_ranker = MemoryRanker()
        self.temporal_resolver = TemporalStateResolver()
        self.entity_resolver = EntityResolver()
        self.graph_engine = ContextGraphEngine(max_depth=3)
        self.context_compiler = DecisionGradeContextCompiler(default_token_budget=token_budget)

    async def run(self, task: Dict[str, Any], workspace: Dict[str, Any]) -> Dict[str, Any]:
        assert_no_ground_truth_leakage(task)
        t0 = time.time()
        query = task.get("query", "")
        entities = workspace.get("entities", {})
        comms = workspace.get("communications", [])

        t_start_ret = time.time()
        retrieved_items = self.retriever.retrieve(query, comms, entities)
        retrieval_ms = (time.time() - t_start_ret) * 1000.0

        t_start_comp = time.time()
        entity_res = self.entity_resolver.resolve_person(query, entities.get("people", []), retrieved_items)
        temporal_events = self.temporal_resolver.parse_events_from_communications(comms)
        query_date_match = re.search(r'2026-\d{2}-\d{2}', query)
        query_time = (query_date_match.group(0) + " 23:59:59") if query_date_match else "2026-12-31 23:59:59"
        
        reconstructed_state = self.temporal_resolver.resolve_state("comp_hold", "outreach_status", query_time, temporal_events)
        self.graph_engine.build_from_workspace(workspace)
        start_node = entity_res.get("canonical_entity_id") or "p_1"
        graph_res = self.graph_engine.traverse_bounded_relationship(start_node=start_node)

        compiled_res = self.context_compiler.compile(
            query=query,
            retrieved_evidence=retrieved_items,
            entities=entities,
            resolved_entity=entity_res,
            reconstructed_state=reconstructed_state,
            graph_trace=graph_res.get("trace", []),
            token_budget=self.context_compiler.default_token_budget
        )
        context_composition_ms = (time.time() - t_start_comp) * 1000.0

        context_str = compiled_res["compiled_context_text"]
        user_prompt = f"CONTEXT:\n{context_str}\n\nQUESTION:\n{query}"

        sys_hash = compute_sha256(SYSTEM_PROMPT_TEMPLATE)
        user_hash = compute_sha256(user_prompt)
        ctx_hash = compute_sha256(context_str)

        t_gen = time.time()
        llm_res = self.provider.generate(SYSTEM_PROMPT_TEMPLATE, user_prompt)
        generation_ms = (time.time() - t_gen) * 1000.0
        total_ms = (time.time() - t0) * 1000.0

        selected_ids = compiled_res.get("selected_evidence_ids", [])

        return {
            "agent_type": "Live ContextOS Compact",
            "context_mode": "compact",
            "response": llm_res.get("text", ""),
            "decision": None,
            "confidence": compiled_res.get("confidence", 0.0),
            "answerability": compiled_res.get("answerability", "SUFFICIENT"),
            "retrieved_evidence": selected_ids,
            "selected_evidence_ids": selected_ids,
            "rejected_evidence_ids": [],
            "system_prompt": SYSTEM_PROMPT_TEMPLATE,
            "user_prompt": user_prompt,
            "context": context_str,
            "system_prompt_hash": sys_hash,
            "user_prompt_hash": user_hash,
            "context_hash": ctx_hash,
            "provider": llm_res.get("provider", self.provider.__class__.__name__),
            "model": llm_res.get("model", getattr(self.provider, "model", "unknown")),
            "input_tokens": llm_res.get("input_tokens", 0),
            "output_tokens": llm_res.get("output_tokens", 0),
            "cost_usd": llm_res.get("cost_usd"),
            "status": llm_res.get("status", "SUCCESS"),
            "error_message": llm_res.get("error_message"),
            "telemetry": compiled_res.get("telemetry", {}),
            "latency": {
                "retrieval_ms": round(retrieval_ms, 2),
                "context_composition_ms": round(context_composition_ms, 2),
                "generation_ms": round(generation_ms, 2),
                "total_ms": round(total_ms, 2)
            }
        }
