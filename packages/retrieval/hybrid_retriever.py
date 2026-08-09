"""
ContextOS Phase 2.2 — Hybrid Retrieval Engine
Combines Lexical, Semantic, Entity, Temporal, Relationship, and Source signals.
Outputs itemized score breakdowns per evidence item deterministically.
"""

import math
import re
from typing import Dict, List, Any, Tuple

DEFAULT_WEIGHTS = {
    "lexical": 0.35,
    "semantic": 0.20,
    "entity": 0.20,
    "temporal": 0.10,
    "relationship": 0.10,
    "source": 0.05
}

SOURCE_PRIORITY = {
    "crm": 1.0,
    "meeting_note": 0.85,
    "email": 0.75,
    "slack": 0.65,
    "note": 0.50
}

class HybridRetriever:
    def __init__(self, weights: Dict[str, float] = None):
        self.weights = weights if weights else DEFAULT_WEIGHTS.copy()
        self._doc_ngram_cache = {}

    def _compute_ngram_vector(self, text: str, n: int = 3) -> Dict[str, int]:
        clean = re.sub(r'[^a-z0-9]', '', text.lower())
        vec = {}
        for i in range(len(clean) - n + 1):
            gram = clean[i:i+n]
            vec[gram] = vec.get(gram, 0) + 1
        return vec

    def _get_cached_doc_ngram(self, comm_id: str, content: str) -> Dict[str, int]:
        if comm_id not in self._doc_ngram_cache:
            self._doc_ngram_cache[comm_id] = self._compute_ngram_vector(content)
        return self._doc_ngram_cache[comm_id]

    def _cosine_similarity(self, vec1: Dict[str, int], vec2: Dict[str, int]) -> float:
        if not vec1 or not vec2:
            return 0.0
        intersection = set(vec1.keys()) & set(vec2.keys())
        dot = sum(vec1[g] * vec2[g] for g in intersection)
        mag1 = math.sqrt(sum(v**2 for v in vec1.values()))
        mag2 = math.sqrt(sum(v**2 for v in vec2.values()))
        if mag1 == 0 or mag2 == 0:
            return 0.0
        return dot / (mag1 * mag2)

    def retrieve(self, query: str, communications: List[Dict[str, Any]], entities: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        query_words = set(w.lower() for w in re.findall(r'\w+', query) if len(w) > 2)
        q_ngram = self._compute_ngram_vector(query)
        
        people_names = [p["name"].lower() for p in entities.get("people", [])] if entities else []
        comp_names = [c["name"].lower() for c in entities.get("companies", [])] if entities else []
        
        # Fast pre-scoring to select top-50 candidate documents
        candidates = []
        for comm in communications:
            doc_id = comm.get("id")
            content = (comm.get("content", "") + " " + comm.get("subject", "") + " " + comm.get("title", "")).lower()
            doc_words = set(w.lower() for w in re.findall(r'\w+', content) if len(w) > 2)
            
            # Lexical match count
            lex_count = len(query_words & doc_words) if query_words else 0
            ent_count = sum(1 for name in people_names + comp_names if name in query.lower() and name in content)
            
            candidates.append({
                "pre_score": lex_count * 2 + ent_count * 3,
                "comm": comm,
                "content": content,
                "doc_words": doc_words,
                "lex_count": lex_count,
                "ent_count": ent_count
            })

        candidates.sort(key=lambda c: c["pre_score"], reverse=True)
        top_candidates = candidates[:30]

        results = []
        for c in top_candidates:
            comm = c["comm"]
            doc_id = comm.get("id")
            content = c["content"]
            doc_words = c["doc_words"]
            
            # 1. Lexical Score
            lexical_score = (c["lex_count"] / len(query_words)) if query_words else 0.0

            # 2. Semantic Score
            doc_ngram = self._get_cached_doc_ngram(doc_id, content)
            semantic_score = self._cosine_similarity(q_ngram, doc_ngram)

            # 3. Entity Score
            entity_score = min(1.0, c["ent_count"] / max(1, len(people_names)))

            # 4. Temporal Score
            ts = comm.get("timestamp", "2026-01-01 00:00:00")
            day_match = re.search(r'2026-01-(\d{2})', ts)
            day = int(day_match.group(1)) if day_match else 1
            temporal_score = min(1.0, day / 60.0)

            # 5. Relationship Score
            relationship_score = 0.8 if any(term in content for term in ["project", "deal", "vault", "pin"]) else 0.2

            # 6. Source Score
            comm_type = comm.get("type", "note").lower()
            source_score = SOURCE_PRIORITY.get(comm_type, 0.5)

            retrieval_score = (
                lexical_score * self.weights.get("lexical", 0.35) +
                semantic_score * self.weights.get("semantic", 0.20) +
                entity_score * self.weights.get("entity", 0.20) +
                temporal_score * self.weights.get("temporal", 0.10) +
                relationship_score * self.weights.get("relationship", 0.10) +
                source_score * self.weights.get("source", 0.05)
            )

            results.append({
                "evidence_id": doc_id,
                "retrieval_score": round(retrieval_score, 4),
                "lexical_score": round(lexical_score, 4),
                "semantic_score": round(semantic_score, 4),
                "entity_score": round(entity_score, 4),
                "temporal_score": round(temporal_score, 4),
                "relationship_score": round(relationship_score, 4),
                "source_score": round(source_score, 4),
                "raw_comm": comm
            })

        results.sort(key=lambda x: x["retrieval_score"], reverse=True)
        return results
