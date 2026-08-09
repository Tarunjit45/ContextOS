# 🔬 ContextOS Phase 3.1 — Low-Resource Real LLM Evaluation Report

**Execution Timestamp:** `2026-08-10T00:08:45.639903`  
**Experiment Mode:** `REAL_LLM_LOCAL_LOW_RESOURCE`  
**Dataset v1 Hash Status:** `VERIFIED ✓ (SHA256: 2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa)`  
**Provider:** `openrouter` | **Model:** `openrouter/free` | **Temperature:** `0.0`  
**Hardware:** 12 CPU Cores | 5.85 GB RAM Total (0.31 GB Available) | GPU: None (CPU Only)  

> [!IMPORTANT]
> **Statistical Disclaimer:** `n=10` is a smoke test and is NOT statistically sufficient to establish general performance superiority.

## 1. Three-Way Metric & Token Telemetry Comparison

| Metric | Live Baseline RAG | Live ContextOS (Full) | Live ContextOS (Compact) | Delta (Full vs Baseline) |
|---|---|---|---|---|
| **Overall Accuracy** | 50.0% | 50.0% | 90.0% | +0.0% |
| **Hallucination Rate** | 10.0% | 0.0% | 0.0% | -10.0% |
| **P50 Latency** | 4960.82 ms | 4633.7 ms | 6701.65 ms | -327.12 ms |
| **Total Input Tokens** | 2441 | 65424 | 4204 | +62983 |
| **Total Cost** | $0.0000 | $0.0000 | $0.0000 | N/A |

## 2. Experimental Validity Assessment

- **Identical Prompting:** All agents received equivalent system instructions.
- **Identical Hardware & Generation Settings:** All models ran at `temperature=0.0`, `max_tokens=512` on the exact same CPU environment.
- **Zero Ground-Truth Leakage:** No agent received category metadata or expected answers.
- **Isolating Variable:** Isolate ContextOS full context composition vs compact context composition vs naive BM25 context.
