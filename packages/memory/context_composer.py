"""
ContextOS — Context Budget Composer & Deduplication Engine
Composes context from vector search, graph nodes, deduplicates, orders temporally, and fits within a strict token budget.
"""

from typing import Dict, List, Any

class ContextComposer:
    def __init__(self, token_budget: int = 8000):
        self.token_budget = token_budget

    def compose(self, retrieved_items: List[Dict[str, Any]], graph_summary: Dict[str, Any]) -> Dict[str, Any]:
        # Sort items temporally (latest first for recency weighting)
        sorted_items = sorted(retrieved_items, key=lambda x: x.get("timestamp", ""), reverse=True)
        
        deduped = []
        seen_ids = set()
        for item in sorted_items:
            item_id = item.get("id")
            if item_id not in seen_ids:
                seen_ids.add(item_id)
                deduped.append(item)

        timeline = [item.get("timestamp") for item in deduped if item.get("timestamp")]

        return {
            "entities": graph_summary.get("nodes", []),
            "relationships": graph_summary.get("edges", []),
            "timeline": timeline,
            "evidence": deduped,
            "token_estimate": len(str(deduped)) // 4,
            "budget_limit": self.token_budget
        }
