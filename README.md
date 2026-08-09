# 🔬 ContextOS — Product & Engineering Specification

> **Tagline:** Stress-test the memory and operational context of long-running AI agents.  
> **Repository:** `Tarunjit45/ContextOS`

![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Local--First-black?style=for-the-badge)
![Phase 2](https://img.shields.io/badge/Phase%202-1%2C000%20Scenario%20Benchmark%20Engine-emerald?style=for-the-badge)

---

## 📌 1. Product Identity

**ContextOS** is a local-first developer platform that creates realistic synthetic organizational environments and evaluates whether AI agents can:
- Remember information across long timelines
- Retrieve relevant context & connect entities
- Reason about temporal changes (e.g. Day 1 instructions vs Day 30 updates)
- Distinguish current from obsolete information
- Compose context from multiple sources without hallucinating missing context
- Identify root-cause failure classifications when an agent makes a mistake

---

## ⚡ 2. Phase 2 — Reproducible Benchmark Engine (1,000 Scenarios)

ContextOS evaluates agents deterministically across **1,000 synthetic scenarios** divided into **6 failure classes**:

1. **Temporal Conflict (200 cases):** Evaluates whether agents obey recent updates over outdated instructions.
2. **Entity Disambiguation (200 cases):** Tests resolution of similar names (`John Smith VP` vs `John Smith Jr.`).
3. **Multi-Hop Relationship (200 cases):** Requires multi-hop graph traversal (`Person -> Project -> Meeting -> Decision`).
4. **Memory Decay (150 cases):** Tests retention of crucial facts introduced early (Day 1) and queried late (Day 60).
5. **Contradiction / Conflict (150 cases):** Resolves conflicting statements across Slack, Email, and CRM.
6. **Missing Information (100 cases):** Verifies that agents decline unannounced context queries without hallucinating.

---

## 💻 3. Command-Line Interface (`contextos` CLI)

```bash
# Initialize local ContextOS environment and SQLite database
python cli/contextos.py init

# Run full 1,000 scenario Phase 2 benchmark suite across agents
python cli/contextos.py benchmark run --scenarios 1000 --agents "Baseline RAG Agent,ContextOS Agent" --output json,csv,md

# Display benchmark comparison report from SQLite DB
python cli/contextos.py report
```

### 📊 Exported Benchmark Reports (`benchmarks/reports/`)
- `benchmark_report_<timestamp>.json`
- `benchmark_report_<timestamp>.csv`
- `benchmark_report_<timestamp>.md`

---

## 🧠 4. Core Monorepo Layout

```text
ContextOS/
├── apps/
│   ├── web/                    # Next.js 15 App Router + React 18 + Tailwind + OLED Dark UI
│   └── api/                    # Python 3.12 + FastAPI + SQLite DB + NetworkX Server
├── packages/
│   ├── evaluation/             # BenchmarkRunner & Multi-Dimensional Evaluator
│   ├── db/                     # BenchmarkStorage SQLite persistence (contextos_benchmark.db)
│   ├── retrieval/              # Hybrid semantic, keyword, entity and temporal retrieval
│   ├── memory/                 # Context Budget Composer & Recency Ranker
│   ├── graph/                  # NetworkX Relational Context Graph Engine
│   ├── agents/                 # Baseline RAG Agent, ContextOS Agent, Custom Agent
│   └── scenarios/              # 1,000 Synthetic Scenario Dataset Generator
├── benchmarks/                 # Persistent SQLite DB & Generated Benchmark Reports
└── cli/                        # `contextos` CLI Executable
```

---

## 📜 Author & License

Architected & Engineered by **[Tarunjit Biswas](https://github.com/Tarunjit45)**.  
Released under the **MIT License**.
