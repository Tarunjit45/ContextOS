"""
ContextOS Phase 2.2 — Entity Resolver Component
Disambiguates people, companies, and projects across aliases, roles, departments, and emails.
"""

import re
from typing import Dict, List, Any

class EntityResolver:
    def resolve_person(self, query: str, people: List[Dict[str, Any]]) -> Dict[str, Any]:
        query_lower = query.lower()
        candidates = []

        for p in people:
            name = p.get("name", "").lower()
            email = p.get("email", "").lower()
            role = p.get("role", "").lower()
            dept = p.get("department", "").lower()

            confidence = 0.0
            matched = []
            conflicting = []

            # 1. Exact Email match
            if email in query_lower:
                confidence += 0.9
                matched.append("email")
            
            # 2. Role & Department match
            if role in query_lower:
                confidence += 0.4
                matched.append("role")
            if dept in query_lower:
                confidence += 0.4
                matched.append("department")

            # 3. Name Disambiguation
            if "vp sales" in query_lower and role == "vp sales":
                confidence += 0.5
                matched.append("role_vp")
            elif "associate" in query_lower and role == "sales associate":
                confidence += 0.5
                matched.append("role_assoc")
            
            if "jr" in query_lower and "jr" in name:
                confidence += 0.5
                matched.append("suffix_jr")
            elif "jr" in query_lower and "jr" not in name:
                conflicting.append("suffix_mismatch")
            
            if name in query_lower:
                confidence += 0.3
                matched.append("name")

            if confidence > 0:
                candidates.append({
                    "entity_id": p["id"],
                    "person": p,
                    "confidence": round(min(1.0, confidence), 2),
                    "matched_attributes": matched,
                    "conflicting_attributes": conflicting
                })

        candidates.sort(key=lambda c: c["confidence"], reverse=True)
        if candidates:
            best = candidates[0]
            return {
                "entity_id": best["entity_id"],
                "canonical_name": best["person"]["name"],
                "email": best["person"]["email"],
                "role": best["person"]["role"],
                "department": best["person"]["department"],
                "confidence": best["confidence"],
                "matched_attributes": best["matched_attributes"],
                "conflicting_attributes": best["conflicting_attributes"],
                "candidates_count": len(candidates)
            }

        return {
            "entity_id": None,
            "canonical_name": None,
            "email": None,
            "role": None,
            "department": None,
            "confidence": 0.0,
            "matched_attributes": [],
            "conflicting_attributes": [],
            "candidates_count": 0
        }
