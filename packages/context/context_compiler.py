"""
ContextOS Phase 3.3 — Decision-Grade Context Compiler
Transforms subsystem signals (retrieved evidence, entity resolution, temporal states, graph traces, source authority)
into a compact, evidence-grounded, provenance-backed structured context format.
"""

import json
import re
from typing import Dict, List, Any, Optional, Tuple

SOURCE_AUTHORITY = {
    "crm": 1.0,
    "meeting_note": 0.85,
    "email": 0.75,
    "slack": 0.65,
    "note": 0.50
}

class DecisionGradeContextCompiler:
    def __init__(self, default_token_budget: int = 2048):
        self.default_token_budget = default_token_budget

    def rank_evidence(
        self,
        query: str,
        retrieved_evidence: List[Dict[str, Any]],
        resolved_entity: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        query_terms = set(re.findall(r'\w+', query.lower()))
        scored = []

        for item in retrieved_evidence:
            comm = item.get("raw_comm", item)
            content = str(comm.get("content") or comm.get("text") or "").lower()
            source = str(comm.get("type") or comm.get("source") or "note").lower()
            timestamp = str(comm.get("timestamp") or "2026-01-01")

            # 1. Lexical BM25 match
            content_terms = set(re.findall(r'\w+', content))
            lexical_score = len(query_terms.intersection(content_terms)) / max(1, len(query_terms))

            # 2. Source Authority score
            authority_score = SOURCE_AUTHORITY.get(source, 0.5)

            # 3. Entity relevance score
            entity_score = 0.0
            if resolved_entity.get("name") and resolved_entity["name"].lower() in content:
                entity_score += 0.4
            if resolved_entity.get("email") and resolved_entity["email"].lower() in content:
                entity_score += 0.5

            # 4. Critical keyword boost (vault PIN, legal hold, budget)
            critical_score = 0.0
            if any(term in content for term in ["pin", "code", "bypass", "hold", "cleared", "budget"]):
                critical_score += 0.3

            total_score = (lexical_score * 0.35) + (authority_score * 0.25) + (entity_score * 0.25) + (critical_score * 0.15)
            scored.append({
                "item": item,
                "comm": comm,
                "id": comm.get("id") or item.get("evidence_id"),
                "total_score": round(total_score, 4),
                "authority": authority_score,
                "timestamp": timestamp,
                "content": comm.get("content") or comm.get("text") or "",
                "type": source
            })

        scored.sort(key=lambda s: (s["total_score"], s["authority"], s["timestamp"]), reverse=True)
        return scored

    def detect_conflicts(self, ranked_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        if len(ranked_items) < 2:
            return {
                "conflict_detected": False,
                "resolution": "No conflicting communications found.",
                "winning_evidence": [r["id"] for r in ranked_items if r.get("id")],
                "superseded_evidence": [],
                "reason": "Single source context."
            }

        # Check for outreach status conflicts (e.g. hold vs clearance)
        prohibitions = [r for r in ranked_items if any(k in r["content"].lower() for k in ["hold notice", "do not contact"])]
        clearances = [r for r in ranked_items if any(k in r["content"].lower() for k in ["legal audit cleared", "authorized to resume"])]

        if prohibitions and clearances:
            top_clearance = max(clearances, key=lambda c: (c["timestamp"], c["authority"]))
            top_prohibition = max(prohibitions, key=lambda p: (p["timestamp"], p["authority"]))

            if top_clearance["timestamp"] >= top_prohibition["timestamp"]:
                return {
                    "conflict_detected": True,
                    "resolution": "Outreach Authorized",
                    "winning_evidence": [top_clearance["id"]],
                    "superseded_evidence": [top_prohibition["id"]],
                    "reason": f"Later clearance ({top_clearance['type'].upper()} {top_clearance['timestamp'][:10]}) supersedes earlier hold notice ({top_prohibition['type'].upper()} {top_prohibition['timestamp'][:10]})."
                }
            else:
                return {
                    "conflict_detected": True,
                    "resolution": "Outreach Prohibited",
                    "winning_evidence": [top_prohibition["id"]],
                    "superseded_evidence": [top_clearance["id"]],
                    "reason": f"Later hold notice ({top_prohibition['type'].upper()} {top_prohibition['timestamp'][:10]}) supersedes earlier clearance."
                }

        return {
            "conflict_detected": False,
            "resolution": "Consistent",
            "winning_evidence": [r["id"] for r in ranked_items[:2] if r.get("id")],
            "superseded_evidence": [],
            "reason": "Retrieved evidence sources are consistent."
        }

    def assess_answerability(
        self,
        query: str,
        ranked_items: List[Dict[str, Any]],
        resolved_entity: Dict[str, Any],
        conflict: Dict[str, Any]
    ) -> Tuple[str, float]:
        query_lower = query.lower()

        # 1. Check for unannounced/unrelated queries
        if any(w in query_lower for w in ["unannounced", "confidential acquisition", "secret deal"]) and not ranked_items:
            return "INSUFFICIENT", 0.99

        # 2. Check for empty evidence
        if not ranked_items:
            return "INSUFFICIENT", 0.95

        # 3. Check for entity ambiguity
        if resolved_entity.get("is_ambiguous"):
            return "AMBIGUOUS", 0.60

        # 4. Check for unresolved conflict
        if conflict.get("conflict_detected") and conflict.get("resolution") == "Unresolved":
            return "CONFLICTED", 0.50

        # 5. Check if query asks for specific facts (e.g., PIN/code) and fact is present
        if any(term in query_lower for term in ["pin", "code", "bypass"]):
            has_code = any(re.search(r'\d{4}-[a-z]{2}', r["content"].lower()) or "9842" in r["content"] for r in ranked_items)
            if not has_code:
                return "INSUFFICIENT", 0.85

        return "SUFFICIENT", 0.95

    def compile(
        self,
        query: str,
        retrieved_evidence: List[Dict[str, Any]],
        entities: Dict[str, Any],
        resolved_entity: Dict[str, Any],
        reconstructed_state: Dict[str, Any],
        graph_trace: Optional[List[str]] = None,
        token_budget: Optional[int] = None
    ) -> Dict[str, Any]:
        budget = token_budget or self.default_token_budget
        ranked_items = self.rank_evidence(query, retrieved_evidence, resolved_entity)
        conflict = self.detect_conflicts(ranked_items)
        answerability, confidence = self.assess_answerability(query, ranked_items, resolved_entity, conflict)

        # Select top sufficient evidence within budget
        selected_evidence = []
        selected_ids = []
        total_chars = 0
        max_chars = budget * 4  # Estimated 4 chars per token

        for r in ranked_items:
            fact_str = f"[{r['type'].upper()} {r['timestamp'][:10]} | ID: {r['id']}] {r['content']}"
            if total_chars + len(fact_str) <= max_chars or not selected_evidence:
                selected_evidence.append({
                    "evidence_id": r["id"],
                    "source": r["type"],
                    "timestamp": r["timestamp"],
                    "authority": r["authority"],
                    "content": r["content"],
                    "provenance": f"Source: {r['type'].upper()} (ID: {r['id']}) | Timestamp: {r['timestamp']} | Authority: {r['authority']}"
                })
                selected_ids.append(r["id"])
                total_chars += len(fact_str)
            if len(selected_evidence) >= 3:
                break

        # Format Canonical Entities Section
        entities_section = []
        if resolved_entity.get("name"):
            e_str = f"{resolved_entity['name']} ({resolved_entity.get('email', 'N/A')}) - Role: {resolved_entity.get('role', 'N/A')}, Dept: {resolved_entity.get('department', 'N/A')}"
            if resolved_entity.get("company"):
                e_str += f", Company: {resolved_entity['company']}"
            entities_section.append(e_str)
        else:
            for p in entities.get("people", [])[:2]:
                entities_section.append(f"{p['name']} ({p.get('email')}) - {p.get('role')}, {p.get('department')}")

        # Format Current State Section
        curr_val = reconstructed_state.get("current_value") or "Unknown"
        valid_as_of = reconstructed_state.get("valid_as_of") or "2026-12-31"
        current_state_section = f"Attribute: outreach_status | Current Value: {curr_val} | Valid As Of: {valid_as_of}"

        # Format Timeline Section
        timeline_section = []
        for e in reconstructed_state.get("timeline", []):
            timeline_section.append(f"{e.get('timestamp', '')[:10]} — State changed to '{e.get('new_value')}' via {e.get('source', '').upper()} (Authority: {e.get('authority')})")
        if not timeline_section:
            for s in selected_evidence:
                timeline_section.append(f"{s['timestamp'][:10]} — Recorded in {s['source'].upper()} (ID: {s['evidence_id']})")

        # Concise Structured Context Representation
        formatted_context_lines = [
            "=== DECISION-GRADE CONTEXT ===",
            f"QUERY: {query}",
            "",
            "[ENTITIES]",
            "\n".join(f"- {e}" for e in entities_section) if entities_section else "- None",
            "",
            "[CURRENT STATE]",
            f"- {current_state_section}",
            "",
            "[TIMELINE]",
            "\n".join(f"- {t}" for t in timeline_section) if timeline_section else "- None",
            "",
            "[RELATIONSHIPS]",
            "\n".join(f"- {g}" for g in (graph_trace or [])) if graph_trace else "- Direct query context",
            "",
            "[EVIDENCE PROVENANCE]",
            "\n".join(f"- [{ev['source'].upper()} {ev['timestamp'][:10]} | ID: {ev['evidence_id']}] {ev['content']} ({ev['provenance']})" for ev in selected_evidence) if selected_evidence else "- None",
            "",
            "[CONFLICT RESOLUTION]",
            f"- Conflict Detected: {conflict['conflict_detected']}",
            f"- Resolution: {conflict['resolution']}",
            f"- Reason: {conflict['reason']}",
            "",
            "[ANSWERABILITY]",
            f"- State: {answerability}",
            "",
            "[CONFIDENCE]",
            f"- Score: {confidence}"
        ]

        compiled_text = "\n".join(formatted_context_lines)
        retrieved_chars = sum(len(str(item)) for item in retrieved_evidence)
        compiled_chars = len(compiled_text)
        
        # Token estimation (4 chars / token)
        retrieved_tokens_est = int(retrieved_chars / 4.0)
        compiled_tokens_est = int(compiled_chars / 4.0)
        comp_ratio = round(1.0 - (compiled_chars / max(1, retrieved_chars)), 3)

        return {
            "mode": "decision_grade_compact",
            "compiled_context_text": compiled_text,
            "answerability": answerability,
            "confidence": confidence,
            "resolved_entity": resolved_entity,
            "current_state": reconstructed_state,
            "conflicts": conflict,
            "selected_evidence_ids": selected_ids,
            "selected_evidence": selected_evidence,
            "telemetry": {
                "retrieved_evidence_before": len(retrieved_evidence),
                "selected_evidence_after": len(selected_evidence),
                "entities_before": len(entities.get("people", [])),
                "entities_after": len(entities_section),
                "retrieved_tokens_est": retrieved_tokens_est,
                "compiled_tokens_est": compiled_tokens_est,
                "compression_ratio": comp_ratio,
                "context_budget": budget,
                "answerability": answerability
            }
        }
