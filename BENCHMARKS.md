# 📊 ContextOS Benchmark Specification & Methodology

This document outlines the benchmark methodology, dataset hash verification, evaluation metrics, and comparative experimental results for ContextOS.

---

## 1. Frozen Benchmark Dataset v1

- **Dataset File:** `benchmarks/datasets/v1/dataset.json`
- **Dataset Hash:** `2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa` (`VERIFIED ✓`)
- **Random Seed:** `42`
- **Total Parameterized Scenarios:** `1,000`

### Benchmark Categories (1,000 Scenarios):
1. **`temporal_conflict` (200 cases):** Verifies prioritization of recent updates over outdated Day 1 instructions.
2. **`entity_disambiguation` (200 cases):** Evaluates resolution of individuals with similar names (`John Smith` VP Sales vs `John Smith Jr.` Sales Associate).
3. **`multi_hop_relationship` (200 cases):** Requires multi-hop graph path connections (`Person -> Project -> Meeting -> Decision`).
4. **`memory_decay` (150 cases):** Tests retention of crucial early facts (Day 1) queried late (Day 60).
5. **`contradiction_conflict` (150 cases):** Resolves conflicting statements across Slack, Email, and CRM.
6. **`missing_information` (100 cases):** Verifies that agents decline unannounced context queries without hallucinating.

---

## 2. Experimental Configurations Under Test

All three agent configurations execute under identical generation parameters:
- `temperature = 0.0`
- `max_tokens = 512`
- Identical System Prompt: *"You are an assistant answering questions using the provided evidence. Do not invent information. If the evidence is insufficient, say that the information is unavailable."*

1. **Live Baseline RAG:** Naive BM25 retrieval $\rightarrow$ Top-3 raw documents $\rightarrow$ System Prompt $\rightarrow$ LLM.
2. **Live ContextOS Full:** Multi-signal hybrid retrieval $\rightarrow$ Memory ranker $\rightarrow$ Temporal state $\rightarrow$ Entity resolver $\rightarrow$ Graph traversal $\rightarrow$ Full raw JSON context composition $\rightarrow$ System Prompt $\rightarrow$ LLM.
3. **Live ContextOS Compact:** Multi-signal hybrid retrieval $\rightarrow$ Memory ranker $\rightarrow$ Temporal state $\rightarrow$ Entity resolver $\rightarrow$ Graph traversal $\rightarrow$ Decision-Grade Context Compiler $\rightarrow$ Compact structured context $\rightarrow$ System Prompt $\rightarrow$ LLM.

---

## 3. Results Comparison

### A. Deterministic Subsystem Evaluation (1,000 Scenarios | Seed 42):

| Metric | Baseline RAG Agent | ContextOS Agent | Delta |
|---|---:|---:|---:|
| **Overall Accuracy** | **69.1%** | **99.0%** | **+29.9%** |
| **Memory Retention** | 94.0% | 93.3% | -0.7% |
| **Temporal State Accuracy** | 100.0% | 100.0% | 0.0% |
| **Entity Disambiguation** | **0.0%** | **100.0%** | **+100.0%** |
| **Evidence Grounding** | 85.0% | 100.0% | +15.0% |
| **Hallucination Rate** | 10.0% | 0.0% | -10.0% |
| **P50 Latency** | **1.52 ms** | **14.96 ms** | +13.44 ms |

---

### B. Real LLM Evaluation (10 Stratified Scenarios | Seed 42 | OpenRouter API):

> **Primary Result:** ContextOS Compact achieved **90.0% accuracy vs 50.0% for Baseline RAG**, while reducing input tokens by **93.6%** compared to ContextOS Full.

| Metric | Live Baseline RAG | Live ContextOS Full | Live ContextOS Compact | Delta (Compact vs Base) |
|---|---:|---:|---:|---:|
| **Overall Accuracy** | **50.0%** (5/10) | **50.0%** (5/10) | **90.0%** (9/10) | **+40.0%** |
| **Model Errors (`MODEL_ERROR`)** | **0** | **0** | **0** | 0 |
| **Execution Errors (`EXECUTION_ERROR`)** | **0** | **0** | **0** | 0 |
| **Incorrect Answers (`INCORRECT_ANSWER`)** | **5** | **5** | **1** | **-4** |
| **Hallucination Rate** | **10.0%** | **0.0%** | **0.0%** | **-10.0%** |
| **P50 Total Latency** | **4,330.26 ms** | **3,804.49 ms** | **5,965.17 ms** | +1,634.91 ms |
| **P95 Total Latency** | **16,221.01 ms** | **13,403.61 ms** | **15,468.19 ms** | -752.82 ms |
| **Total Input Tokens** | **2,441** | **65,424** | **4,204** | +1,763 |
| **Total Output Tokens** | **2,315** | **2,215** | **1,685** | -630 |
| **Token Savings vs Full Mode** | N/A | Base | **-93.6% Token Reduction** | 93.6% savings |
| **Total Cost** | **$0.0000** | **$0.0000** | **$0.0000** | $0.0000 |

---

## 4. Category Breakdown (Real LLM n=10 Experiment)

| Benchmark Category | Sample Count | Live Baseline RAG | Live ContextOS Full | Live ContextOS Compact |
|---|---|---|---|---|
| **`temporal_conflict`** | 2 | 50% (1/2) | 0% (0/2) | **100% (2/2)** |
| **`memory_decay`** | 2 | 100% (2/2) | 50% (1/2) | **100% (2/2)** |
| **`entity_disambiguation`** | 2 | 0% (0/2) | 0% (0/2) | **50% (1/2)** |
| **`multi_hop_relationship`** | 2 | 100% (2/2) | 100% (2/2) | **100% (2/2)** |
| **`contradiction_conflict`** | 1 | 0% (0/1) | 100% (1/1) | **100% (1/1)** |
| **`missing_information`** | 1 | 0% (0/1) | 100% (1/1) | **100% (1/1)** |

---

## 5. Statistical & Experimental Limitations

1. **Sample Size Limit ($n=10$):** `n=10` is a low-resource validation experiment and is **NOT** statistically sufficient to claim general performance superiority across arbitrary enterprise datasets.
2. **Model Routing:** Real LLM evaluations were conducted via OpenRouter free endpoint (`openrouter/free` -> `nvidia/nemotron-3-ultra-550b-a55b:free`). Evaluation on commercial closed models (`gpt-4o`, `claude-3-5-sonnet`) is planned for Phase 4.
3. **Synthetic Dataset Boundary:** Scenarios are parameterically generated (seed 42) rather than extracted from live production enterprise data.
