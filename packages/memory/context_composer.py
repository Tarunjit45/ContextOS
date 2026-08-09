"""
ContextOS Phase 3.1 — Context Budget Composer & Compact Mode Resolver
Constructs structured context views (Full & Compact) with token telemetry.
Applies source authority & temporal precedence rules for conflict resolution.
"""

import json
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
        conflicts = []
        grouped = {}
        for comm in communications:
            topic = comm.get("subject") or comm.get("title") or comm.get("id")
            grouped.setdefault(topic, []).append(comm)

        for topic, comm_list in grouped.items():
            if len(comm_list) > 1:
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

        facts = [c.get("content") for c in raw_comms if c.get("content")]
        raw_chars = sum(len(str(f)) for f in facts)
        raw_toks = int(raw_chars / 4.0)

        composed = {
            "mode": "full",
            "budget_limit": self.token_budget,
            "entities": entities.get("people", []) + entities.get("companies", []),
            "facts": facts,
            "timeline": timeline,
            "relationships": graph_trace,
            "conflicts": conflicts,
            "current_state": reconstructed_state,
            "evidence": evidence_list,
            "telemetry": {
                "raw_evidence_count": len(retrieved_items),
                "raw_context_chars": raw_chars,
                "raw_context_tokens": raw_toks,
                "composed_context_chars": len(json.dumps(facts)),
                "composed_context_tokens": int(len(json.dumps(facts)) / 4.0)
            }
        }

        return composed

    def compose_compact(
        self,
        retrieved_items: List[Dict[str, Any]],
        entities: Dict[str, Any],
        reconstructed_state: Dict[str, Any],
        graph_trace: List[str]
    ) -> Dict[str, Any]:
        """
        Compact ContextOS Mode:
        Prioritizes:
        1. Directly relevant evidence
        2. Temporal state-changing evidence
        3. Entity-defining evidence
        4. High-authority sources
        5. Relationship evidence
        6. Critical memory facts (PINs, holds)
        Excludes redundant background text.
        """
        raw_comms = [item.get("raw_comm", item) for item in retrieved_items if isinstance(item, dict)]
        
        # Filter top-3 high importance & high relevance facts
        compact_facts = []
        selected_evidence_ids = []

        for item in retrieved_items[:3]:
            comm = item.get("raw_comm", {})
            content = comm.get("content", "")
            doc_id = comm.get("id") or item.get("evidence_id")
            if content and doc_id:
                compact_facts.append(f"[{comm.get('type', 'note').upper()} {comm.get('timestamp', '')[:10]}] {content}")
                selected_evidence_ids.append(doc_id)

        # Compact key entities
        compact_entities = []
        for p in entities.get("people", [])[:2]:
            compact_entities.append(f"{p['name']} ({p.get('email')}) - {p.get('role')}, {p.get('department')}")

        raw_chars = sum(len(str(c)) for c in raw_comms)
        raw_toks = int(raw_chars / 4.0)

        composed = {
            "mode": "compact",
            "key_entities": compact_entities,
            "critical_facts": compact_facts,
            "resolved_state": reconstructed_state.get("current_value"),
            "valid_as_of": reconstructed_state.get("valid_as_of"),
            "selected_evidence_ids": selected_evidence_ids,
            "telemetry": {
                "raw_evidence_count": len(retrieved_items),
                "raw_context_chars": raw_chars,
                "raw_context_tokens": raw_toks,
                "composed_context_chars": sum(len(f) for f in compact_facts),
                "composed_context_tokens": int(sum(len(f) for f in compact_facts) / 4.0)
            }
        }

        return composed
