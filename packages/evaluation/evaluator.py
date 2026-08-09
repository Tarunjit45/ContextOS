"""
ContextOS Phase 2.2 — Evaluator Engine & Component-Level Metrics
Computes overall accuracy + component-level metrics (Retrieval Recall/Precision, Memory Recall,
Entity Resolution Accuracy, Temporal State Accuracy, Relationship Path Accuracy, Context Composition Accuracy).
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
        selected_evidence = set(agent_output.get("selected_evidence_ids", []))

        # 1. Retrieval Precision & Recall
        if expected_evidence:
            retrieval_recall = len(expected_evidence.intersection(actual_evidence)) / len(expected_evidence)
            retrieval_precision = len(expected_evidence.intersection(actual_evidence)) / len(actual_evidence) if actual_evidence else 0.0
            grounding_score = len(expected_evidence.intersection(actual_evidence)) / len(expected_evidence.union(actual_evidence)) if expected_evidence.union(actual_evidence) else 0.0
        else:
            retrieval_recall = 1.0 if not actual_evidence else 0.0
            retrieval_precision = 1.0 if not actual_evidence else 0.0
            grounding_score = 1.0 if not actual_evidence else 0.0

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
            if "john.smith@acme.com" in agent_response and ("john.jr@acme.com" in agent_response or "associate" in agent_response):
                is_action_correct = True
            else:
                is_action_correct = False

        elif category == "temporal_conflict" or category == "contradiction_conflict":
            if "authorized" in agent_response or "approved" in agent_response or "cleared" in agent_response:
                is_action_correct = True
            else:
                is_action_correct = False

        elif category == "memory_decay":
            pin_match = re.search(r'\d{4}-[a-z]{2}', expected_answer)
            if pin_match and pin_match.group(0) in agent_response:
                is_action_correct = True
            else:
                is_action_correct = False

        elif category == "multi_hop_relationship":
            if "arr" in agent_response or "contract" in agent_response or "finalized" in agent_response or "300" in agent_response:
                is_action_correct = True
            else:
                is_action_correct = False

        # Earliest Failure Stage Classification
        failure_class = None
        failure_explanation = None

        if not is_action_correct:
            if retrieval_recall < 1.0 and category != "missing_information":
                failure_class = "RETRIEVAL_FAILURE"
                failure_explanation = "Ground truth evidence was not retrieved by the hybrid retrieval engine."
            elif category == "entity_disambiguation":
                failure_class = "ENTITY_RESOLUTION_FAILURE"
                failure_explanation = "Entity resolver failed to explicitly disambiguate VP Sales from Sales Associate."
            elif category == "temporal_conflict" or category == "contradiction_conflict":
                failure_class = "TEMPORAL_FAILURE"
                failure_explanation = "Temporal resolver failed to reconstruct valid outreach state at query timestamp."
            elif category == "multi_hop_relationship":
                failure_class = "RELATIONSHIP_FAILURE"
                failure_explanation = "Graph expansion failed to traverse Person -> Project -> Meeting relationship path."
            elif category == "memory_decay":
                failure_class = "MEMORY_FAILURE"
                failure_explanation = "Memory ranker failed to retain early Vault PIN note over recent communications."
            elif category == "missing_information":
                failure_class = "HALLUCINATION"
                failure_explanation = "Agent hallucinated response for unannounced missing context query."
            else:
                failure_class = "CONTEXT_COMPOSITION_FAILURE"
                failure_explanation = "Evidence was retrieved but miscombined during context composition."

        latency_dict = agent_output.get("latency", {})
        total_ms = latency_dict.get("total_ms", 5.0)

        return {
            "scenario_id": scenario.get("scenario_id"),
            "category": category,
            "agent_name": agent_output.get("agent_type"),
            "query": scenario.get("query"),
            "retrieved_evidence": list(actual_evidence),
            "selected_evidence_ids": list(selected_evidence),
            "agent_response": agent_output.get("response"),
            "expected_response": scenario.get("expected_answer"),
            "status": "PASSED" if is_action_correct else "FAILED",
            "is_action_correct": is_action_correct,
            "retrieval_recall": retrieval_recall,
            "retrieval_precision": retrieval_precision,
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

        # Component Metrics
        ret_recall = (sum(t.get("retrieval_recall", 0.0) for t in traces) / total) * 100.0
        ret_precision = (sum(t.get("retrieval_precision", 0.0) for t in traces) / total) * 100.0

        mem_traces = [t for t in traces if t["category"] == "memory_decay"]
        mem_recall = (sum(1 for t in mem_traces if t["is_action_correct"]) / len(mem_traces) * 100.0) if mem_traces else 0.0

        temp_traces = [t for t in traces if t["category"] in ["temporal_conflict", "contradiction_conflict"]]
        temporal_acc = (sum(1 for t in temp_traces if t["is_action_correct"]) / len(temp_traces) * 100.0) if temp_traces else 0.0

        ent_traces = [t for t in traces if t["category"] == "entity_disambiguation"]
        entity_acc = (sum(1 for t in ent_traces if t["is_action_correct"]) / len(ent_traces) * 100.0) if ent_traces else 0.0

        rel_traces = [t for t in traces if t["category"] == "multi_hop_relationship"]
        relationship_acc = (sum(1 for t in rel_traces if t["is_action_correct"]) / len(rel_traces) * 100.0) if rel_traces else 0.0

        comp_traces = [t for t in traces if t["status"] == "PASSED"]
        composition_acc = (len(comp_traces) / total) * 100.0

        evidence_grounding = (sum(t["grounding_score"] for t in traces) / total) * 100.0
        hallucination_rate = (sum(1 for t in traces if t["is_hallucinating"]) / total) * 100.0

        latencies = [t["latency_ms"] for t in traces]
        p50_latency = float(np.percentile(latencies, 50))
        p95_latency = float(np.percentile(latencies, 95))

        return {
            "run_id": run_id,
            "timestamp": traces[0].get("timestamp") if traces and "timestamp" in traces[0] else None,
            "agent_name": agent_name,
            "scenario_count": total,
            "overall_accuracy": round(overall_accuracy, 1),
            "retrieval_recall": round(ret_recall, 1),
            "retrieval_precision": round(ret_precision, 1),
            "memory_recall": round(mem_recall, 1),
            "entity_resolution_accuracy": round(entity_acc, 1),
            "temporal_state_accuracy": round(temporal_acc, 1),
            "relationship_path_accuracy": round(relationship_acc, 1),
            "context_composition_accuracy": round(composition_acc, 1),
            "evidence_grounding": round(evidence_grounding, 1),
            "hallucination_rate": round(hallucination_rate, 1),
            "p50_latency_ms": round(p50_latency, 2),
            "p95_latency_ms": round(p95_latency, 2),
            "generation_mode": traces[0].get("generation_mode", "deterministic")
        }
