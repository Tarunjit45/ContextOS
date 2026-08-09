# 🔄 ContextOS Reproducibility Guide

This guide provides step-by-step instructions to reproduce all unit tests, dataset validation, deterministic benchmarks, and live LLM evaluations in ContextOS.

---

## 1. Prerequisites & Environment Setup

- **Python Version:** `3.12+`
- **Operating System:** Windows, macOS, or Linux
- **Dependencies:** `pip install -r requirements.txt`

---

## 2. Dataset SHA256 Integrity Verification

Before running any benchmark, verify the integrity of Dataset v1:

```bash
python cli/contextos.py benchmark validate-dataset
```

**Expected Output:**
```text
Validating Dataset v1 Manifest & Integrity (Seed: 42)...
===========================================================================
|-- Total Scenarios:       1000
|-- Ground Truth Leakage:  NONE [OK]
SHA256 Hash Status:        VERIFIED [OK] (2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa)
===========================================================================
DATASET VALIDATION PASSED SUCCESSFULLY!
```

---

## 3. Subsystem Unit Test Suite (133 Tests)

Run the full pytest suite (all 133 unit tests use mocks and do NOT require live API keys):

```bash
python -m pytest tests/test_subsystems.py tests/test_phase3_llm.py tests/test_phase3_1_low_resource.py tests/test_phase3_3_context_compiler.py -v
```

**Expected Result:** `133 passed in ~2.8s`

---

## 4. Phase 2 Deterministic Benchmark Suite (1,000 Scenarios)

Execute the 1,000-scenario deterministic evaluation suite across agents:

```bash
python cli/contextos.py benchmark run --scenarios 1000 --seed 42 --agents "Baseline RAG Agent,ContextOS Agent"
```

**Expected Output:**
- Baseline RAG Agent: `69.1% Overall Accuracy`
- ContextOS Agent: `99.0% Overall Accuracy`
- Generated Reports: `benchmarks/reports/PHASE_2_2_COMPARISON.md`

---

## 5. Phase 3.2 Live LLM Benchmark Suite

### Option A: Offline Simulated Provider (Mock Mode)
```bash
python cli/contextos.py benchmark live --scenarios 10 --seed 42 --provider mock
```

### Option B: Real OpenRouter API Endpoint
Export your API key in your terminal environment. **NEVER hardcode API keys in source files or commit credentials.**

#### PowerShell (Windows):
```powershell
$env:OPENROUTER_API_KEY="sk-or-v1-..."
python cli/contextos.py benchmark live --scenarios 10 --seed 42 --provider openrouter --model openrouter/free
```

#### Bash (macOS / Linux):
```bash
export OPENROUTER_API_KEY="sk-or-v1-..."
python cli/contextos.py benchmark live --scenarios 10 --seed 42 --provider openrouter --model openrouter/free
```

**Exported Reports:**
- [`PHASE_3_2_REAL_LLM_REPORT.md`](file:///D:/GITHUB%20AUTOMATION/repos/ContextOS/PHASE_3_2_REAL_LLM_REPORT.md)
- SQLite Traces: `benchmarks/contextos_benchmark.db` (table `llm_benchmark_traces`)
