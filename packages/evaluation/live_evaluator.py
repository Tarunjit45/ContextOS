"""
ContextOS Phase 3 — Live LLM Evaluator Engine
Deterministic ground-truth assertion over LLM natural language or JSON outputs.
Distinguishes MODEL_ERROR / EXECUTION_ERROR from INCORRECT_ANSWER.
"""

import re
import json
from typing import Dict, List, Any

class LiveEvaluationEngine:
    def evaluate_live_trace(self, scenario: Dict[str, Any], agent_output: Dict[str, Any]) -> Dict[str, Any]:
        category = scenario.get("category")
        expected_answer = scenario.get("expected_answer", "").lower()
        agent_response = agent_output.get("response", "").lower()
        status = agent_output.get("status", "SUCCESS")
        error_msg = agent_output.get("error_message")

        if status != "SUCCESS":
            return {
                "scenario_id": scenario.get("scenario_id"),
                "category": category,
                "agent_name": agent_output.get("agent_type"),
                "execution_status": "ERROR",
                "error_type": "MODEL_ERROR",
                "error_message": error_msg,
                "is_action_correct": False,
                "evaluation_method": "deterministic",
                "failure_class": "MODEL_ERROR",
                "failure_explanation": f"LLM execution error: {error_msg}"
            }

        is_action_correct = False
        is_hallucinating = False
        decision = None

        # Parse JSON structured response if present
        try:
            parsed_json = json.loads(agent_response)
            if isinstance(parsed_json, dict):
                answer_text = str(parsed_json.get("answer", "")).lower()
                decision = str(parsed_json.get("decision", "")).lower()
                agent_response = answer_text + " " + decision
        except Exception:
            pass

        if category == "missing_information":
            if "unavailable" in agent_response or "not have enough information" in agent_response or "decline" in agent_response:
                is_action_correct = True
                is_hallucinating = False
            else:
                is_action_correct = False
                is_hallucinating = True

        elif category == "entity_disambiguation":
            if "john.smith@acme.com" in agent_response or ("vp" in agent_response and "executive sales" in agent_response):
                is_action_correct = True
            else:
                is_action_correct = False

        elif category in ["temporal_conflict", "contradiction_conflict"]:
            if "authorized" in agent_response or "allowed" in agent_response or "cleared" in agent_response or "yes" in agent_response:
                is_action_correct = True
            else:
                is_action_correct = False

        elif category == "memory_decay":
            pin_match = re.search(r'\d{4}-[a-z]{2}', expected_answer)
            if pin_match and pin_match.group(0) in agent_response:
                is_action_correct = True
            elif "9842" in agent_response or "security bypass" in agent_response:
                is_action_correct = True
            else:
                is_action_correct = False

        elif category == "multi_hop_relationship":
            if "arr" in agent_response or "contract" in agent_response or "300" in agent_response or "finalized" in agent_response:
                is_action_correct = True
            else:
                is_action_correct = False

        failure_class = None
        failure_explanation = None

        if not is_action_correct:
            if category == "missing_information":
                failure_class = "HALLUCINATION"
                failure_explanation = "LLM hallucinated response for unannounced missing context query."
            elif category == "entity_disambiguation":
                failure_class = "ENTITY_RESOLUTION_FAILURE"
                failure_explanation = "LLM failed to disambiguate VP Sales from Sales Associate."
            elif category in ["temporal_conflict", "contradiction_conflict"]:
                failure_class = "TEMPORAL_FAILURE"
                failure_explanation = "LLM failed to reason valid temporal state as of query time."
            elif category == "memory_decay":
                failure_class = "MEMORY_FAILURE"
                failure_explanation = "LLM failed to extract early vault PIN code from context."
            else:
                failure_class = "CONTEXT_COMPOSITION_FAILURE"
                failure_explanation = "LLM failed to reach correct conclusion from context."

        return {
            "scenario_id": scenario.get("scenario_id"),
            "category": category,
            "agent_name": agent_output.get("agent_type"),
            "execution_status": "SUCCESS",
            "is_action_correct": is_action_correct,
            "is_hallucinating": is_hallucinating,
            "evaluation_method": "deterministic",
            "failure_class": failure_class,
            "failure_explanation": failure_explanation
        }
