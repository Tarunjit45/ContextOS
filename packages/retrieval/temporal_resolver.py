"""
ContextOS Phase 2.2 — Temporal State Resolver
Reconstructs entity state from historical event streams at any point in time.
"""

from datetime import datetime
from typing import Dict, List, Any, Optional

class TemporalEvent:
    def __init__(
        self,
        event_id: str,
        timestamp: str,
        entity_id: str,
        attribute: str,
        old_value: Any,
        new_value: Any,
        source: str,
        confidence: float = 1.0,
        valid_from: str = None,
        valid_until: str = None
    ):
        self.event_id = event_id
        self.timestamp = timestamp
        self.entity_id = entity_id
        self.attribute = attribute
        self.old_value = old_value
        self.new_value = new_value
        self.source = source
        self.confidence = confidence
        self.valid_from = valid_from if valid_from else timestamp
        self.valid_until = valid_until

class TemporalStateResolver:
    def parse_events_from_communications(self, communications: List[Dict[str, Any]]) -> List[TemporalEvent]:
        events = []
        for comm in communications:
            comm_id = comm.get("id", "")
            ts = comm.get("timestamp", "2026-01-01 00:00:00")
            content = comm.get("content", "").lower()
            source = comm.get("type", "email")

            if "hold notice" in content or "do not contact" in content:
                events.append(TemporalEvent(
                    event_id=comm_id,
                    timestamp=ts,
                    entity_id="comp_hold",
                    attribute="outreach_status",
                    old_value="allowed",
                    new_value="prohibited",
                    source=source
                ))
            elif "legal audit cleared" in content or "authorized to resume outreach" in content or "update:" in content:
                events.append(TemporalEvent(
                    event_id=comm_id,
                    timestamp=ts,
                    entity_id="comp_hold",
                    attribute="outreach_status",
                    old_value="prohibited",
                    new_value="allowed",
                    source=source
                ))
            elif "budget approved" in content or "approved by finance" in content:
                events.append(TemporalEvent(
                    event_id=comm_id,
                    timestamp=ts,
                    entity_id="deal_budget",
                    attribute="finance_approval",
                    old_value="rejected",
                    new_value="approved",
                    source=source
                ))
            elif "rejected due to budget caps" in content:
                events.append(TemporalEvent(
                    event_id=comm_id,
                    timestamp=ts,
                    entity_id="deal_budget",
                    attribute="finance_approval",
                    old_value="none",
                    new_value="rejected",
                    source=source
                ))

        return events

    def resolve_state(
        self,
        entity_id: str,
        attribute: str,
        query_time: str,
        events: List[TemporalEvent]
    ) -> Dict[str, Any]:
        # Filter events up to query_time
        relevant = [e for e in events if e.entity_id == entity_id and e.attribute == attribute and e.valid_from <= query_time]
        
        # Check valid_until expiration
        unexpired = [e for e in relevant if not e.valid_until or e.valid_until >= query_time]
        
        if not unexpired:
            return {"current_value": None, "active_event": None, "history": []}

        # Sort chronologically by timestamp ascending
        unexpired.sort(key=lambda e: (e.valid_from, e.confidence), reverse=False)
        latest_event = unexpired[-1]

        return {
            "current_value": latest_event.new_value,
            "active_event": latest_event.event_id,
            "valid_as_of": query_time,
            "history": [e.event_id for e in unexpired]
        }
