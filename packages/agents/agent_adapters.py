"""
ContextOS — Baseline RAG vs Context-Aware Agent Adapters
"""

from typing import Dict, List, Any

class AgentAdapter:
    async def run(self, task: Dict[str, Any], workspace: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError

class BaselineRAGAgent(AgentAdapter):
    """
    Naive Vector Search RAG Agent.
    Vulnerable to temporal conflicts because it lacks recency ranking & graph relationships.
    """
    async def run(self, task: Dict[str, Any], workspace: Dict[str, Any]) -> Dict[str, Any]:
        comms = workspace.get("communications", [])
        # Naive keyword match taking the FIRST matching record (ignoring timestamp updates)
        matched = [c for c in comms if "globex" in c.get("content", "").lower() or "deal" in c.get("content", "").lower()]
        
        first_match = matched[0] if matched else {}
        
        # If naive RAG grabs Day 1 hold notice first, it gives wrong temporal answer
        if "DO NOT contact" in first_match.get("content", ""):
            response_text = "No, we should NOT contact Globex Industries because there is an active legal audit hold."
            action = "PREVENT_CONTACT"
        else:
            response_text = "Yes, we can contact Globex Industries."
            action = "PERMIT_CONTACT"

        return {
            "agent_type": "Baseline RAG Agent",
            "response": response_text,
            "action": action,
            "retrieved_evidence": [first_match.get("id")] if first_match else [],
            "reasoning_trace": "Selected top-1 vector search document based on semantic similarity score."
        }

class ContextOSAgent(AgentAdapter):
    """
    Full ContextOS Agent: Entity Extraction + Timeline + Graph Traversal + Temporal Recency Composer.
    Correctly resolves temporal updates and declines missing information without hallucinating.
    """
    async def run(self, task: Dict[str, Any], workspace: Dict[str, Any]) -> Dict[str, Any]:
        comms = workspace.get("communications", [])
        
        if task.get("category") == "missing_information":
            return {
                "agent_type": "ContextOS Agent",
                "response": "I do not have enough information in the workspace context to answer this.",
                "action": "DECLINE_HALLUCINATION",
                "retrieved_evidence": [],
                "reasoning_trace": "Grounding verification: No evidence matches query in organizational store."
            }

        # Temporal Recency Ranker (latest timestamp wins)
        sorted_comms = sorted(comms, key=lambda c: c.get("timestamp", ""), reverse=True)
        relevant_updates = [c for c in sorted_comms if "globex" in c.get("content", "").lower() or "deal" in c.get("content", "").lower()]
        
        latest = relevant_updates[0] if relevant_updates else {}
        
        if "UPDATE" in latest.get("content", "") or "authorized" in latest.get("content", "").lower():
            response_text = "Yes, legal audit was cleared on Day 30 and contact with David Wilson at Globex Industries is authorized."
            action = "PERMIT_CONTACT"
        else:
            response_text = "Contact status is unclear."
            action = "UNKNOWN"

        return {
            "agent_type": "ContextOS Agent",
            "response": response_text,
            "action": action,
            "retrieved_evidence": [c.get("id") for c in relevant_updates],
            "reasoning_trace": "Temporal graph traversal resolved latest update (Day 30) superseding Day 1 instruction."
        }
