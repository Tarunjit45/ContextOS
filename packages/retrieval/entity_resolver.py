"""
ContextOS Phase 3.3 — Enhanced Entity Resolver Component
Scoring-based entity resolution with suffix matching, role/department attributes,
and explicit ambiguity detection for decision-grade context compilation.
"""

import re
from typing import Dict, List, Any, Optional

class EntityResolver:
    def score_person(self, query_lower: str, p: Dict[str, Any], evidence_context: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        name = p.get("name", "").lower()
        email = p.get("email", "").lower()
        role = p.get("role", "").lower()
        dept = p.get("department", "").lower()
        company = p.get("company", "").lower()
        aliases = [a.lower() for a in p.get("aliases", [])]

        scores = {
            "exact_name": 0.0,
            "email": 0.0,
            "role": 0.0,
            "department": 0.0,
            "company": 0.0,
            "suffix": 0.0,
            "alias": 0.0,
            "relationship": 0.0
        }
        matched = []
        conflicting = []

        # 1. Email match
        if email and email in query_lower:
            scores["email"] = 1.0
            matched.append("email")

        # 2. Exact Name / Partial Name match
        name_words = name.split()
        if name in query_lower:
            scores["exact_name"] = 1.0
            matched.append("exact_name")
        elif len(name_words) > 1 and name_words[0] in query_lower and name_words[-1] in query_lower:
            scores["exact_name"] = 0.8
            matched.append("full_name_parts")

        # 3. Suffix Disambiguation (Jr. vs Sr. vs None)
        query_has_jr = bool(re.search(r'\b(jr|junior)\b', query_lower))
        person_has_jr = "jr" in name or "junior" in name or p.get("suffix") == "Jr."
        if query_has_jr and person_has_jr:
            scores["suffix"] = 1.0
            matched.append("suffix_jr_match")
        elif query_has_jr and not person_has_jr:
            scores["suffix"] = -0.5
            conflicting.append("suffix_mismatch_query_requested_jr")
        elif not query_has_jr and person_has_jr:
            scores["suffix"] = -0.2
            conflicting.append("suffix_mismatch_person_is_jr")

        # 4. Role & Department match
        if role and role in query_lower:
            scores["role"] = 1.0
            matched.append("role_match")
        elif "vp" in query_lower and ("vp" in role or "vice president" in role):
            scores["role"] = 0.9
            matched.append("role_vp")
        elif "associate" in query_lower and "associate" in role:
            scores["role"] = 0.9
            matched.append("role_associate")
        elif "executive" in query_lower and ("executive" in role or "executive" in dept):
            scores["role"] = 0.6
            matched.append("role_executive")

        if dept and dept in query_lower:
            scores["department"] = 1.0
            matched.append("department_match")
        elif "sales" in query_lower and "sales" in dept:
            scores["department"] = 0.8
            matched.append("department_sales")

        if company and company in query_lower:
            scores["company"] = 1.0
            matched.append("company_match")

        for alias in aliases:
            if alias in query_lower:
                scores["alias"] = 1.0
                matched.append("alias_match")
                break

        # Evidence-assisted context boost
        if evidence_context:
            for ev in evidence_context:
                ev_str = str(ev).lower()
                if email and email in ev_str:
                    scores["relationship"] += 0.3
                if role and role in ev_str:
                    scores["relationship"] += 0.2

        weights = {
            "email": 0.35,
            "exact_name": 0.25,
            "role": 0.20,
            "department": 0.10,
            "suffix": 0.10,
            "company": 0.05,
            "alias": 0.10,
            "relationship": 0.05
        }

        raw_score = sum(scores[k] * weights.get(k, 0.0) for k in scores)
        confidence = max(0.0, min(1.0, raw_score))

        return {
            "entity_id": p.get("id"),
            "person": p,
            "confidence": round(confidence, 2),
            "scores": scores,
            "matched_attributes": matched,
            "conflicting_attributes": conflicting
        }

    def resolve_person(self, query: str, people: List[Dict[str, Any]], evidence_context: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        query_lower = query.lower()
        evaluated = [self.score_person(query_lower, p, evidence_context) for p in people]
        candidates = [c for c in evaluated if c["confidence"] > 0.1]

        candidates.sort(key=lambda c: c["confidence"], reverse=True)

        if not candidates:
            return {
                "canonical_entity_id": None,
                "name": None,
                "email": None,
                "role": None,
                "department": None,
                "company": None,
                "confidence": 0.0,
                "is_ambiguous": False,
                "alternatives": []
            }

        top = candidates[0]
        alternatives = candidates[1:]

        # Ambiguity detection rule:
        # If top two candidates have close scores (delta < 0.15) and query lacks distinguishing email/role/suffix signal
        is_ambiguous = False
        if len(candidates) > 1:
            second = candidates[1]
            delta = top["confidence"] - second["confidence"]
            if delta < 0.15 and "email" not in top["matched_attributes"] and "suffix_jr_match" not in top["matched_attributes"]:
                is_ambiguous = True

        return {
            "entity_id": top["entity_id"],
            "canonical_entity_id": top["entity_id"],
            "name": top["person"].get("name"),
            "canonical_name": top["person"].get("name"),
            "email": top["person"].get("email"),
            "role": top["person"].get("role"),
            "department": top["person"].get("department"),
            "company": top["person"].get("company"),
            "confidence": top["confidence"],
            "is_ambiguous": is_ambiguous,
            "matched_attributes": top["matched_attributes"],
            "conflicting_attributes": top["conflicting_attributes"],
            "candidates_count": len(candidates),
            "alternatives": [
                {
                    "entity_id": alt["entity_id"],
                    "name": alt["person"].get("name"),
                    "role": alt["person"].get("role"),
                    "department": alt["person"].get("department"),
                    "confidence": alt["confidence"]
                }
                for alt in alternatives
            ]
        }
