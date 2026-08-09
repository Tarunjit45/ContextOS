"""
ContextOS Phase 2.2 — Context Budget Composer & Conflict Resolver
Constructs structured context views: entities, facts, timeline, relationships, conflicts, current_state, evidence.
Applies source authority & temporal precedence rules for conflict resolution.
"""

from typing import Dict, List, Any

SOURCE_AUTHORITY = {
    "crm": 1.0,
    "meeting_note": 0.85,
    "email": 0.75,
    "slack": 0.65,
    "note": 0.50
}

class ContextComposer:
    def __init__(self, token_budget: int = 8000):
        self.token_budget = token_budget

    def resolve_conflicts(self, communications: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Conflict precedence:
        1. Higher Source Authority (CRM > Meeting Note > Email > Slack > Note)
        2. If source authority equal, latest timestamp wins
        """
        conflicts = []
        # Group by project/topic
        grouped = {}
        for comm in communications:
            topic = comm.get("subject") or comm.get("title") or comm.get("id")
            grouped.setdefault(topic, []).append(comm)

        for topic, comm_list in grouped.items():
            if len(comm_list) > 1:
                # Sort by (Source Authority DESC, Timestamp DESC)
                sorted_by_authority = sorted(
                    comm_list,
                    key=lambda c: (SOURCE_AUTHORITY.get(c.get("type", "note"), 0.5), c.get("timestamp", "")),
                    reverse=True
                )
                winner = sorted_by_authority[0]
                losers = sorted_by_authority[1:]
                conflicts.append({
                    "topic": topic,
                    "winning_evidence_id": winner.get("id"),
                    "winning_source": winner.get("type"),
                    "overridden_evidence_ids": [c.get("id") for c in losers],
                    "resolution_reason": f"Precedence rule selected {winner.get('type')} (Authority: {SOURCE_AUTHORITY.get(winner.get('type'), 0.5)}) with timestamp {winner.get('timestamp')}"
                })

        return conflicts

    def compose(
        self,
        retrieved_items: List[Dict[str, Any]],
        entities: Dict[str, Any],
        reconstructed_state: Dict[str, Any],
        graph_trace: List[str]
    ) -> Dict[str, Any]:
        raw_comms = [item.get("raw_comm", item) for item in retrieved_items if isinstance(item, dict)]
        conflicts = self.resolve_conflicts(raw_comms)
        timeline = [c.get("timestamp") for c in raw_comms if c.get("timestamp")]
        timeline.sort()

        evidence_list = []
        for item in retrieved_items:
            if isinstance(item, dict) and "evidence_id" in item:
                evidence_list.append(item.get("evidence_id"))
            elif isinstance(item, dict) and "id" in item:
                evidence_list.append(item.get("id"))

        composed = {
            "entities": entities.get("people", []) + entities.get("companies", []),
            "facts": [c.get("content") for c in raw_comms if c.get("content")],
            "timeline": timeline,
            "relationships": graph_trace,
            "conflicts": conflicts,
            "current_state": reconstructed_state,
            "evidence": evidence_list,
            "token_estimate": sum(len(str(c).split()) for c in raw_comms) * 4,
            "budget_limit": self.token_budget
        }

        return composed
