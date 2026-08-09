# ContextOS

> **The evaluation laboratory for agent memory and operational context.**

ContextOS is an open-source, local-first research platform for evaluating whether autonomous AI agents can remember, retrieve, disambiguate, and reason over long-horizon organizational context.

---

## 📌 Problem & Motivation

Existing RAG architectures perform well on static document retrieval, but frequently fail in long-running organizational environments. When agents interact with evolving workspaces over weeks or months, they encounter critical context failures:

1. **Temporal Conflicts:** Failing to prioritize recent legal clearances or policy updates over outdated Day 1 instructions.
2. **Entity Ambiguity:** Conflating individuals with identical or similar names (`John Smith` VP of Sales vs `John Smith Jr.` Sales Associate).
3. **Context Bloat:** Overloading LLM context windows with thousands of raw chat messages, causing response degradation or truncation.
4. **Information Absence:** Hallucinating facts when required information is not present in the workspace.

ContextOS provides a controlled synthetic environment, a 1,000-scenario frozen benchmark, and a decision-grade context compiler designed to measure and solve these operational context failures.

---

## 💡 Key Research Finding

In a controlled real-LLM experiment (`n=10`, seed: 42, OpenRouter API):

> **ContextOS Compact achieved 90.0% accuracy vs 50.0% for Baseline RAG, while reducing input tokens by 93.6% compared to raw full context composition.**

*Note: `n=10` is a low-resource validation experiment and is NOT statistically sufficient proof of general performance superiority across arbitrary enterprise datasets.*

| Configuration | Accuracy | Hallucination Rate | Input Tokens (10 Scenarios) | Token Overhead vs Baseline |
|---|---:|---:|---:|---:|
| **Live Baseline RAG** | **50.0%** | **10.0%** | **2,441** | 1.00x (Control) |
| **Live ContextOS Full** | **50.0%** | **0.0%** | **65,424** | 26.80x (Prompt Bloat) |
| **Live ContextOS Compact** | **90.0%** | **0.0%** | **4,204** | **1.72x (-93.6% vs Full)** |

---

## 🏗️ Architecture & Pipeline Overview

ContextOS processes queries through an 8-stage decision-grade context compilation pipeline:

```text
USER QUERY
    ↓
1. Input Sanitization (Strips ground-truth leakage)
    ↓
2. Hybrid Retrieval (Lexical BM25 + N-gram Cosine + Entity Hits + Recency + Authority)
    ↓
3. Candidate-Scored Entity Resolution (Suffix matching & explicit ambiguity detection)
    ↓
4. Temporal State Resolution (Validity intervals, active states, superseded events)
    ↓
5. Relational Context Graph (Bounded NetworkX multi-hop path expansion)
    ↓
6. Conflict Resolution (Authority hierarchy: CRM > Meeting Note > Email > Slack > Note)
    ↓
7. Deterministic Evidence Ranking (Multi-signal relevance scoring)
    ↓
8. Decision-Grade Context Compiler (Budget enforcement & answerability state assignment)
    ↓
COMPACT DECISION CONTEXT ──> LLM ──> ANSWER
```

---

## 🔬 Failure Taxonomy

ContextOS categorizes evaluation mistakes into 8 earliest identifiable failure stages:

1. `RETRIEVAL_FAILURE` — Relevant evidence was omitted from top candidates.
2. `MEMORY_FAILURE` — Critical historical facts were lost over long timelines.
3. `TEMPORAL_FAILURE` — Outdated instructions superseded newer policy updates.
4. `ENTITY_RESOLUTION_FAILURE` — Conflated distinct individuals or roles.
5. `RELATIONSHIP_FAILURE` — Failed multi-hop graph path connections.
6. `CONTEXT_COMPOSITION_FAILURE` — Context bloat truncated or distorted key facts.
7. `HALLUCINATION` — Model invented information not supported by evidence.
8. `TOOL_ACTION_FAILURE` — Agent failed to execute the intended action.

---

## 💻 CLI Quickstart

```bash
# Clone repository
git clone https://github.com/Tarunjit45/ContextOS.git
cd ContextOS

# Install dependencies
pip install -r requirements.txt

# Validate Dataset v1 SHA256 Hash
python cli/contextos.py benchmark validate-dataset

# Run all 133 subsystem unit tests
python -m pytest -v

# Perform LLM provider & hardware memory check
python cli/contextos.py llm check

# Run Phase 2 deterministic 1,000-scenario benchmark suite
python cli/contextos.py benchmark run --scenarios 1000 --seed 42

# Run Phase 3.2 Live LLM benchmark (Requires OPENROUTER_API_KEY environment variable)
$env:OPENROUTER_API_KEY="sk-or-v1-..."
python cli/contextos.py benchmark live --scenarios 10 --seed 42 --provider openrouter --model openrouter/free
```

---

## 🔒 Reproducibility & Security Guarantees

- **Dataset v1 SHA256 Hash:** `2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa` (`VERIFIED ✓`)
- **Deterministic Seed:** `42`
- **Zero Ground-Truth Leakage:** Agents are strictly prohibited from receiving `task_category`, `expected_answer`, `expected_action`, or `failure_class`.
- **Credential Protection:** API keys are read exclusively from process environment variables and are **never** logged, printed, or saved to SQLite trace databases.

---

## 📂 Repository Structure

```text
ContextOS/
├── apps/
│   ├── web/                    # Next.js 15 App Router Frontend & Benchmarks Dashboard
│   └── api/                    # FastAPI Backend Server & REST Endpoints
├── packages/
│   ├── context/                # DecisionGradeContextCompiler & Budget Composer
│   ├── retrieval/              # HybridRetriever, EntityResolver & TemporalStateResolver
│   ├── memory/                 # MemoryRanker & Recency Scoring
│   ├── graph/                  # NetworkX ContextGraphEngine
│   ├── llm/                    # LLMProvider Abstraction (Ollama, OpenAI, OpenRouter, Mock)
│   ├── agents/                 # LiveBaselineRAGAgent & LiveContextOSCompactAgent
│   ├── evaluation/             # LiveEvaluationEngine & BenchmarkRunner
│   ├── scenarios/              # Parameterized Dataset v1 Generator & Stratified Sampler
│   └── db/                     # BenchmarkStorage SQLite Persistence
├── tests/                      # 133 Subsystem Unit Tests
├── benchmarks/
│   ├── datasets/v1/            # Frozen Dataset v1 & Manifests
│   └── reports/                # Exported Evaluation Reports & Traces
├── docs/                       # System & Architecture Specifications
└── cli/                        # contextos.py CLI Executable
```

---

## ⚠️ Limitations & Scope

ContextOS is designed as a research evaluation platform. Present limitations include:
- **Synthetic Workspaces:** Workspace data is parameterically generated (seed 42) rather than extracted from live production enterprise data.
- **Low-Resource Real LLM Sample Size:** Real LLM evaluations were conducted on $n=10$ stratified scenarios due to free API endpoint routing.
- **Lexical/Graph In-Memory Pre-Filtering:** Retrieval operates in-memory; evaluation on external vector databases (Qdrant, LanceDB) is planned for Phase 5.

---

## 🗺️ Roadmap

- **Phase 4:** Multi-model real LLM evaluations (GPT-4o, Claude 3.5 Sonnet) across $n=100$ scenarios with 95% confidence intervals.
- **Phase 5:** 10,000+ document scale-out & vector index evaluation (Qdrant / LanceDB).
- **Phase 6:** Enterprise connectors (Slack, Gmail, Notion, Linear, Salesforce).
- **Phase 7:** Continuous agent-memory regression detection CI/CD pipeline.

---

## 📜 License

Released under the **MIT License**. Engineered by [Tarunjit Biswas](https://github.com/Tarunjit45).
