"""
ContextOS Phase 2.1 — Deterministic Evaluator Engine
Evaluates agent output against ground truth evidence and answer facts.
Calculates multi-dimensional benchmark metrics without relying on agent-declared category fields.
"""

import numpy as np
import re
from typing import Dict, List, Any

class EvaluationEngine:
    def evaluate_single(self, scenario: Dict[str, Any], agent_output: Dict[str, Any]) -> Dict[str, Any]:
        category = scenario.get("category")
        expected_answer = scenario.get("expected_answer", "").lower()
        agent_response = agent_output.get("response", "").lower()
        expected_evidence = set(scenario.get("expected_evidence_ids", []))
        actual_evidence = set(agent_output.get("retrieved_evidence", []))

        # Grounding Score (Jaccard similarity of evidence IDs)
        if expected_evidence:
            intersection = len(expected_evidence.intersection(actual_evidence))
            union = len(expected_evidence.union(actual_evidence))
            grounding_score = intersection / union if union > 0 else 0.0
        else:
            grounding_score = 1.0 if len(actual_evidence) == 0 else 0.0

        # Action / Answer Correctness Assertions
        is_action_correct = False
        is_hallucinating = False

        if category == "missing_information":
            if "not have enough information" in agent_response or "decline" in agent_response:
                is_action_correct = True
                is_hallucinating = False
            else:
                is_action_correct = False
                is_hallucinating = True

        elif category == "entity_disambiguation":
            # Must explicitly distinguish john.smith@acme.com VP from john.jr@acme.com Associate
            if "john.smith@acme.com" in agent_response and ("john.jr@acme.com" in agent_response or "associate" in agent_response):
                is_action_correct = True
            else:
                is_action_correct = False

        elif category == "temporal_conflict" or category == "contradiction_conflict":
            if "authorized" in agent_response or "approved" in agent_response or "cleared" in agent_response:
                is_action_correct = True
            elif "do not contact" in agent_response or "hold" in agent_response or "rejected" in agent_response:
                is_action_correct = False
            else:
                is_action_correct = False

        elif category == "memory_decay":
            # Check for security bypass code match
            pin_match = re.search(r'\d{4}-[a-z]{2}', expected_answer)
            if pin_match and pin_match.group(0) in agent_response:
                is_action_correct = True
            else:
                is_action_correct = False

        elif category == "multi_hop_relationship":
            if "300k" in agent_response or "250k" in agent_response or "finalized" in agent_response:
                is_action_correct = True
            else:
                is_action_correct = False

        # Classify Failure Taxonomy
        failure_class = None
        failure_explanation = None

        if not is_action_correct:
            if category == "temporal_conflict" or category == "contradiction_conflict":
                failure_class = "TEMPORAL RETRIEVAL FAILURE"
                failure_explanation = "Agent relied on outdated Day 1 hold notice instead of Day 30 legal clearance update."
            elif category == "entity_disambiguation":
                failure_class = "ENTITY RESOLUTION FAILURE"
                failure_explanation = "Agent failed to explicitly distinguish John Smith VP Sales from John Smith Jr. Sales Associate."
            elif category == "multi_hop_relationship":
                failure_class = "CONTEXT COMPOSITION FAILURE"
                failure_explanation = "Agent failed to traverse Person -> Project -> Meeting note to extract finalized terms."
            elif category == "memory_decay":
                failure_class = "MEMORY DECAY FAILURE"
                failure_explanation = "Agent failed to retain early Day 1 vault security bypass code across the 60-day timeline."
            elif category == "missing_information":
                failure_class = "HALLUCINATION FAILURE"
                failure_explanation = "Agent hallucinated answer facts for unannounced missing context query."
            else:
                failure_class = "RETRIEVAL RANKING FAILURE"
                failure_explanation = "Top-K vector/keyword search failed to retrieve ground truth evidence."

        latency_dict = agent_output.get("latency", {})
        total_ms = latency_dict.get("total_ms", 5.0)

        return {
            "scenario_id": scenario.get("scenario_id"),
            "category": category,
            "agent_name": agent_output.get("agent_type"),
            "query": scenario.get("query"),
            "retrieved_evidence": list(actual_evidence),
            "agent_response": agent_output.get("response"),
            "expected_response": scenario.get("expected_answer"),
            "status": "PASSED" if is_action_correct else "FAILED",
            "is_action_correct": is_action_correct,
            "grounding_score": grounding_score,
            "is_hallucinating": is_hallucinating,
            "failure_class": failure_class,
            "failure_explanation": failure_explanation,
            "latency": latency_dict,
            "latency_ms": total_ms,
            "token_count": agent_output.get("token_count", 0),
            "generation_mode": agent_output.get("generation_mode", "deterministic")
        }

    def aggregate_benchmark_results(self, run_id: str, agent_name: str, traces: List[Dict[str, Any]]) -> Dict[str, Any]:
        total = len(traces)
        if total == 0:
            return {}

        correct_count = sum(1 for t in traces if t["is_action_correct"])
        overall_accuracy = (correct_count / total) * 100.0

        # Memory Retention (memory_decay category accuracy)
        mem_traces = [t for t in traces if t["category"] == "memory_decay"]
        mem_retention = (sum(1 for t in mem_traces if t["is_action_correct"]) / len(mem_traces) * 100.0) if mem_traces else 0.0

        # Temporal Reasoning (temporal_conflict & contradiction_conflict accuracy)
        temp_traces = [t for t in traces if t["category"] in ["temporal_conflict", "contradiction_conflict"]]
        temporal_reasoning = (sum(1 for t in temp_traces if t["is_action_correct"]) / len(temp_traces) * 100.0) if temp_traces else 0.0

        # Entity Disambiguation (entity_disambiguation accuracy)
        ent_traces = [t for t in traces if t["category"] == "entity_disambiguation"]
        entity_disambiguation = (sum(1 for t in ent_traces if t["is_action_correct"]) / len(ent_traces) * 100.0) if ent_traces else 0.0

        # Evidence Grounding (average grounding score)
        evidence_grounding = (sum(t["grounding_score"] for t in traces) / total) * 100.0

        # Hallucination Rate (% of hallucinating traces)
        hallucination_rate = (sum(1 for t in traces if t["is_hallucinating"]) / total) * 100.0

        # Latency P50 and P95
        latencies = [t["latency_ms"] for t in traces]
        p50_latency = float(np.percentile(latencies, 50))
        p95_latency = float(np.percentile(latencies, 95))

        return {
            "run_id": run_id,
            "timestamp": traces[0].get("timestamp") if traces and "timestamp" in traces[0] else None,
            "agent_name": agent_name,
            "scenario_count": total,
            "overall_accuracy": round(overall_accuracy, 1),
            "memory_retention": round(mem_retention, 1),
            "temporal_reasoning": round(temporal_reasoning, 1),
            "entity_disambiguation": round(entity_disambiguation, 1),
            "evidence_grounding": round(evidence_grounding, 1),
            "hallucination_rate": round(hallucination_rate, 1),
            "p50_latency_ms": round(p50_latency, 2),
            "p95_latency_ms": round(p95_latency, 2),
            "generation_mode": traces[0].get("generation_mode", "deterministic")
        }
