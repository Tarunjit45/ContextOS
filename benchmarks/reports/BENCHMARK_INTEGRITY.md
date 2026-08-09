# 🛡️ ContextOS Phase 2.1 — Benchmark Integrity Report

**Generated:** `2026-08-09T22:50:49.504827`  
**Random Seed:** `42`  
**Generation Mode:** `deterministic agent simulation` (No live LLM calls claimed)  

## 1. Dataset Verification & Validation Status

- **Validation Status:** `PASSED`
- **Dataset Size:** `1000` Scenarios
- **Unique Query Count:** `1000`
- **Duplicate Rate:** `0.0%` (Target: < 1.0%)
- **Ground-Truth Leakage Test:** `PASSED` (0 forbidden fields delivered to agents)
- **Missing Evidence Errors:** `0`

## 2. Agent Input Schema & Information Budget

Agents receive strictly:
```json
{
  "task_id": "scen_1",
  "query": "Is outreach to Globex Industries currently authorized?"
}
```
All ground truth fields (`task_category`, `expected_answer`, `expected_action`, `ground_truth`) are stripped prior to agent invocation.

## 3. Reconstructed Benchmark Results

| Agent Name | Scenarios | Accuracy | Memory | Temporal | Entity | Grounding | Hallucination | P50 Latency |
|---|---|---|---|---|---|---|---|---|
| Baseline RAG Agent | 1000 | 69.1% | 94.0% | 100.0% | 0.0% | 22.1% | 10.0% | 3.54 ms |
| ContextOS Agent | 1000 | 37.6% | 0.7% | 100.0% | 0.0% | 2.7% | 7.5% | 4.46 ms |

## 4. Known Methodological Limitations

1. **Deterministic Agent Simulation:** This benchmark tests retrieval ranking, entity disambiguation, and temporal recency sorting logic in Python. It does not evaluate non-deterministic LLM sampling variance.
2. **Local Memory Latency:** Execution latencies reflect local Python string operations and in-memory graph traversals rather than network API latency.
