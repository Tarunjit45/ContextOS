"""
ContextOS Phase 2 — Deterministic Evaluator Engine
Computes multi-dimensional scores across:
- Overall Accuracy (%)
- Memory Retention (%)
- Temporal Reasoning (%)
- Entity Disambiguation (%)
- Evidence Grounding (%)
- Hallucination Rate (%)
- P50 and P95 Latencies (ms)
"""

import numpy as np
from typing import Dict, List, Any

class EvaluationEngine:
    def evaluate_single(self, scenario: Dict[str, Any], agent_output: Dict[str, Any]) -> Dict[str, Any]:
        category = scenario.get("category")
        expected_action = scenario.get("expected_action")
        actual_action = agent_output.get("action")
        expected_evidence = set(scenario.get("expected_evidence_ids", []))
        actual_evidence = set(agent_output.get("retrieved_evidence", []))

        is_action_correct = (expected_action == actual_action)
        
        # Evidence Grounding score (Jaccard similarity of retrieved evidence)
        if expected_evidence:
            intersection = len(expected_evidence.intersection(actual_evidence))
            union = len(expected_evidence.union(actual_evidence))
            grounding_score = intersection / union if union > 0 else 0.0
        else:
            grounding_score = 1.0 if len(actual_evidence) == 0 else 0.5

        # Hallucination check
        is_hallucinating = False
        if category == "missing_information" and actual_action != "DECLINE_HALLUCINATION":
            is_hallucinating = True

        # Failure classification
        failure_class = None
        failure_explanation = None
        if not is_action_correct:
            if category == "temporal_conflict" or category == "contradiction_conflict":
                failure_class = "TEMPORAL RETRIEVAL FAILURE"
                failure_explanation = "The agent retrieved outdated Day 1 instructions instead of Day 30 updates."
            elif category == "entity_disambiguation":
                failure_class = "ENTITY RESOLUTION FAILURE"
                failure_explanation = "The agent failed to disambiguate John Smith VP of Sales from John Smith Jr."
            elif category == "multi_hop_relationship":
                failure_class = "CONTEXT COMPOSITION FAILURE"
                failure_explanation = "Retrieved CRM and meeting records but failed to connect them into the correct decision."
            elif category == "memory_decay":
                failure_class = "MEMORY DECAY FAILURE"
                failure_explanation = "The agent failed to retain the Day 1 security PIN across the 60-day timeline."
            elif category == "missing_information":
                failure_class = "HALLUCINATION FAILURE"
                failure_explanation = "The agent hallucinated facts for an unannounced missing context query."
            else:
                failure_class = "RETRIEVAL RANKING FAILURE"
                failure_explanation = "Top-K vector search failed to retrieve ground truth evidence."

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
            "latency_ms": agent_output.get("latency_ms", 15.0),
            "token_count": agent_output.get("token_count", 100)
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
            "p50_latency_ms": round(p50_latency, 1),
            "p95_latency_ms": round(p95_latency, 1)
        }
