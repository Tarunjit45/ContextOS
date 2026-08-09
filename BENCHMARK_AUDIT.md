# 🔬 ContextOS Phase 2 — Benchmark Methodology Audit Report (`BENCHMARK_AUDIT.md`)

> **Date:** August 9, 2026  
> **Target System:** ContextOS Phase 2 Benchmark Suite (`packages/evaluation/benchmark_runner.py`)  
> **Audited Repository:** `Tarunjit45/ContextOS`

---

## 📌 Executive Summary

A comprehensive, unsparing technical audit of the Phase 2 Benchmark Engine revealed **critical methodological bugs**, **synthetic scenario repetition**, and **adapter shortcut artifacts**.

While the benchmark structure (1,000 scenarios, 6 failure classes, SQLite DB, report exports) is technically operational, the current benchmark numbers (**85.0% ContextOS Agent vs 55.0% Baseline RAG Agent**) are influenced by **adapter rule shortcuts** rather than dynamic, generalized agent reasoning over LLM context.

---

## 🔍 Investigation Findings (10 Required Questions)

### 1. Why Baseline RAG P50 latency is reported as 0.0ms
* **Finding:** In `packages/agents/agent_adapters.py`, `BaselineRAGAgent` computes `latency_ms = (time.time() - start_time) * 1000`. Because the agent performs purely in-memory Python string scanning over 4 communications array elements, execution completes in sub-milliseconds (`< 0.0001s`). `round(latency_ms, 2)` outputs `0.0` or `0.02`, resulting in a P50 latency of **0.0ms**.
* **Methodological Issue:** `ContextOSAgent` hardcodes `+ 12.0` at line 126 (`latency_ms = (time.time() - start_time) * 1000 + 12.0`), artificially inflating ContextOS latency to 12ms while Baseline RAG reads 0ms.

### 2. Exactly how memory retention is calculated
* **Finding:** `memory_retention` is calculated in `packages/evaluation/evaluator.py` as:
  $$\text{Memory Retention (\%)} = \left(\frac{\text{Passed Scenarios in \texttt{memory\_decay}}}{\text{Total Scenarios in \texttt{memory\_decay}}}\right) \times 100$$
* **Current Score:** Baseline RAG = **0.0%**, ContextOS Agent = **100.0%** (over 150 `memory_decay` scenarios).

### 3. Why entity disambiguation is 100% for both agents
* **Finding:** In `packages/agents/agent_adapters.py`, both `BaselineRAGAgent` (line 51) and `ContextOSAgent` (line 103) hardcode `action = "IDENTIFY_SENIOR_EXEC"`.
* **Methodological Bug:** The evaluator checks `is_action_correct = (expected_action == actual_action)`. Because both agents assign `action = "IDENTIFY_SENIOR_EXEC"`, both receive 100% accuracy, even though `BaselineRAGAgent`'s text response (`"John Smith is the VP of Sales."`) fails to disambiguate `John Smith Jr.`.

### 4. Exactly how temporal reasoning is calculated
* **Finding:** Calculated in `evaluator.py` as the accuracy percentage across combined `temporal_conflict` (200 cases) and `contradiction_conflict` (150 cases) categories (350 scenarios total).
* **Current Score:** Baseline RAG = **42.9%**, ContextOS Agent = **57.1%**.

### 5. Whether ground-truth information leaks into either agent's context
* **Finding: YES (CRITICAL BUG).**
* **Evidence:** In `packages/agents/agent_adapters.py`, both agents use explicit `if task_category == "..."` conditional branching. `task_category` is passed directly inside `task`, leaking scenario intent to the agent adapters before any retrieval or reasoning occurs.

### 6. Whether both agents receive equivalent information budgets
* **Finding:** Both agents receive the exact same `workspace` object in `run(task, workspace)`. However, `BaselineRAGAgent` selects `top_matches[:3]` based on word occurrence counts, while `ContextOSAgent` uses a timestamp-sorted array filter.

### 7. Whether scenario generation creates genuinely ambiguous cases
* **Finding: NO (SYNTHETIC REPETITION BUG).**
* **Evidence:** In `packages/scenarios/generator.py`, `generate_benchmark_dataset(1000)` generates **6 static scenario templates repeated hundreds of times** (e.g. 200 exact duplicates of `"Should we contact Globex Industries regarding Enterprise Deal #104 today?"`), rather than 1,000 unique synthetic cases with varying names, dates, subjects, and temporal deltas.

### 8. Whether each metric corresponds correctly to its intended scenario class
* **Finding:** Structural mapping is correct:
  - `overall_accuracy` → All 1,000 scenarios
  - `memory_retention` → `memory_decay` (150 cases)
  - `temporal_reasoning` → `temporal_conflict` + `contradiction_conflict` (350 cases)
  - `entity_disambiguation` → `entity_disambiguation` (200 cases)
  - `evidence_grounding` → Jaccard index over retrieved evidence IDs
  - `hallucination_rate` → % of missing info queries where action != `DECLINE_HALLUCINATION`

### 9. Whether LLM calls are real, mocked, deterministic, or simulated
* **Finding:** All agent executions are **deterministic simulated Python rule branches**, not live LLM API calls. `CustomAgent` supports HTTP POST calls if an `endpoint_url` is provided, but defaults to a static fallback.

### 10. Whether the 85% vs 55% accuracy difference is reproducible
* **Finding:** The 85.0% vs 55.0% result is **100% deterministic and reproducible** because both agents execute hardcoded `if task_category == ...` rule branches:
  - Baseline RAG passes `entity_disambiguation` (200), `multi_hop_relationship` (200), `contradiction_conflict` (150) = 550/1000 (**55.0%**).
  - ContextOS Agent passes `entity_disambiguation` (200), `multi_hop_relationship` (200), `memory_decay` (150), `missing_information` (100), `temporal_conflict` (200) = 850/1000 (**85.0%**).

---

## 📋 Audit of 20 Randomly Selected Scenarios

| # | Scenario ID & Category | Query | Expected Action | Baseline Action & Status | ContextOS Action & Status |
|---|---|---|---|---|---|
| 1 | `scen_64` (`memory_decay`) | Vault 4 PIN query | `RETRIEVE_DECAYED_MEMORY` | `FAIL_MEMORY_RECALL` (FAILED) | `RETRIEVE_DECAYED_MEMORY` (PASSED) |
| 2 | `scen_11` (`temporal_conflict`) | Contact Globex query | `PERMIT_CONTACT` | `PREVENT_CONTACT` (FAILED) | `PERMIT_CONTACT` (PASSED) |
| 3 | `scen_75` (`contradiction_conflict`) | Legal audit cleared query | `RESOLVE_CONTRADICTION` | `RESOLVE_CONTRADICTION` (PASSED) | `PERMIT_CONTACT` (FAILED) |
| 4 | `scen_51` (`multi_hop_relationship`) | Owner meeting decision query | `EXTRACT_DECISION` | `EXTRACT_DECISION` (PASSED*) | `EXTRACT_DECISION` (PASSED) |
| 5 | `scen_91` (`missing_information`) | Q4 discount rate query | `DECLINE_HALLUCINATION` | `HALLUCINATE_DISCOUNT` (FAILED) | `DECLINE_HALLUCINATION` (PASSED) |
| 6 | `scen_21` (`entity_disambiguation`) | VP Sales John Smith query | `IDENTIFY_SENIOR_EXEC` | `IDENTIFY_SENIOR_EXEC` (PASSED*) | `IDENTIFY_SENIOR_EXEC` (PASSED) |
| 7 | `scen_10` (`temporal_conflict`) | Contact Globex query | `PERMIT_CONTACT` | `PREVENT_CONTACT` (FAILED) | `PERMIT_CONTACT` (PASSED) |
| 8 | `scen_71` (`memory_decay`) | Vault 4 PIN query | `RETRIEVE_DECAYED_MEMORY` | `FAIL_MEMORY_RECALL` (FAILED) | `RETRIEVE_DECAYED_MEMORY` (PASSED) |
| 9 | `scen_95` (`missing_information`) | Q4 discount rate query | `DECLINE_HALLUCINATION` | `HALLUCINATE_DISCOUNT` (FAILED) | `DECLINE_HALLUCINATION` (PASSED) |
| 10 | `scen_42` (`multi_hop_relationship`) | Owner meeting decision query | `EXTRACT_DECISION` | `EXTRACT_DECISION` (PASSED*) | `EXTRACT_DECISION` (PASSED) |
| 11 | `scen_68` (`memory_decay`) | Vault 4 PIN query | `RETRIEVE_DECAYED_MEMORY` | `FAIL_MEMORY_RECALL` (FAILED) | `RETRIEVE_DECAYED_MEMORY` (PASSED) |
| 12 | `scen_12` (`temporal_conflict`) | Contact Globex query | `PERMIT_CONTACT` | `PREVENT_CONTACT` (FAILED) | `PERMIT_CONTACT` (PASSED) |
| 13 | `scen_76` (`contradiction_conflict`) | Legal audit cleared query | `RESOLVE_CONTRADICTION` | `RESOLVE_CONTRADICTION` (PASSED) | `PERMIT_CONTACT` (FAILED) |
| 14 | `scen_55` (`multi_hop_relationship`) | Owner meeting decision query | `EXTRACT_DECISION` | `EXTRACT_DECISION` (PASSED*) | `EXTRACT_DECISION` (PASSED) |
| 15 | `scen_5` (`temporal_conflict`) | Contact Globex query | `PERMIT_CONTACT` | `PREVENT_CONTACT` (FAILED) | `PERMIT_CONTACT` (PASSED) |
| 16 | `scen_28` (`entity_disambiguation`) | VP Sales John Smith query | `IDENTIFY_SENIOR_EXEC` | `IDENTIFY_SENIOR_EXEC` (PASSED*) | `IDENTIFY_SENIOR_EXEC` (PASSED) |
| 17 | `scen_30` (`entity_disambiguation`) | VP Sales John Smith query | `IDENTIFY_SENIOR_EXEC` | `IDENTIFY_SENIOR_EXEC` (PASSED*) | `IDENTIFY_SENIOR_EXEC` (PASSED) |
| 18 | `scen_65` (`memory_decay`) | Vault 4 PIN query | `RETRIEVE_DECAYED_MEMORY` | `FAIL_MEMORY_RECALL` (FAILED) | `RETRIEVE_DECAYED_MEMORY` (PASSED) |
| 19 | `scen_78` (`contradiction_conflict`) | Legal audit cleared query | `RESOLVE_CONTRADICTION` | `RESOLVE_CONTRADICTION` (PASSED) | `PERMIT_CONTACT` (FAILED) |
| 20 | `scen_72` (`memory_decay`) | Vault 4 PIN query | `RETRIEVE_DECAYED_MEMORY` | `FAIL_MEMORY_RECALL` (FAILED) | `RETRIEVE_DECAYED_MEMORY` (PASSED) |

*\* Note: Baseline RAG passed multi-hop and entity disambiguation because `BaselineRAGAgent` defaulted to `action = task.get("expected_action")` in its unhandled `else:` block.*

---

## 🛠️ Proposed Methodological Corrections (For Post-Audit Implementation)

1. **Remove Category Leaks:** Agent adapters must consume only `(query, workspace)` and execute dynamic retrieval/reasoning without reading `task_category`.
2. **Diversify Scenario Generator:** Replace repeated static templates with randomized entity generator producing 1,000 distinct organizational cases.
3. **Fix Evaluator Action Matching:** Evaluate actual text responses using string assertion matching rather than relying on agent-assigned `action` strings.
4. **Fix Latency Benchmarking:** Measure actual retrieval and reasoning execution time accurately without hardcoded `+ 12.0` offsets.
