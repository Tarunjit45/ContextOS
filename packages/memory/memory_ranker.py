"""
ContextOS Phase 2.2 — Memory Ranker & Relevance Engine
Evaluates memory items balancing Task Relevance, Importance, Recency, and Temporal Validity.
RECENCY DOES NOT AUTOMATICALLY OVERRIDE RELEVANCE.
"""

from typing import Dict, List, Any

class MemoryScore:
    def __init__(
        self,
        evidence_id: str,
        relevance: float,
        temporal_validity: float,
        importance: float,
        entity_match: float,
        relationship_match: float,
        source_reliability: float,
        recency: float,
        final_score: float
    ):
        self.evidence_id = evidence_id
        self.relevance = relevance
        self.temporal_validity = temporal_validity
        self.importance = importance
        self.entity_match = entity_match
        self.relationship_match = relationship_match
        self.source_reliability = source_reliability
        self.recency = recency
        self.final_score = final_score

    def to_dict(self) -> Dict[str, Any]:
        return {
            "evidence_id": self.evidence_id,
            "relevance": round(self.relevance, 4),
            "temporal_validity": round(self.temporal_validity, 4),
            "importance": round(self.importance, 4),
            "entity_match": round(self.entity_match, 4),
            "relationship_match": round(self.relationship_match, 4),
            "source_reliability": round(self.source_reliability, 4),
            "recency": round(self.recency, 4),
            "final_score": round(self.final_score, 4)
        }

class MemoryRanker:
    def rank_memories(self, query: str, retrieved_items: List[Dict[str, Any]]) -> List[MemoryScore]:
        ranked = []
        
        for item in retrieved_items:
            comm = item.get("raw_comm", {})
            evidence_id = item.get("evidence_id")
            content = comm.get("content", "").lower()
            
            # Task Relevance from retriever lexical & semantic scores
            relevance = max(item.get("lexical_score", 0.0), item.get("semantic_score", 0.0))
            
            # Information Importance (Credentials, PINs, Legal hold/clearances carry 1.0 importance)
            if any(term in content for term in ["pin", "security bypass code", "vault", "legal audit", "authorized", "hold notice"]):
                importance = 1.0
            else:
                importance = 0.4

            temporal_validity = item.get("temporal_score", 0.5)
            entity_match = item.get("entity_score", 0.0)
            relationship_match = item.get("relationship_score", 0.5)
            source_reliability = item.get("source_score", 0.5)
            recency = item.get("temporal_score", 0.5)

            # Weighting Formula where Relevance & Importance dominate Recency
            final_score = (
                relevance * 0.40 +
                importance * 0.25 +
                entity_match * 0.15 +
                temporal_validity * 0.10 +
                source_reliability * 0.05 +
                recency * 0.05
            )

            score_obj = MemoryScore(
                evidence_id=evidence_id,
                relevance=relevance,
                temporal_validity=temporal_validity,
                importance=importance,
                entity_match=entity_match,
                relationship_match=relationship_match,
                source_reliability=source_reliability,
                recency=recency,
                final_score=final_score
            )
            ranked.append(score_obj)

        ranked.sort(key=lambda s: s.final_score, reverse=True)
        return ranked
