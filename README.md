# 🔬 ContextOS — Product & Engineering Specification

> **Tagline:** Stress-test the memory and operational context of long-running AI agents.  
> **Repository:** `Tarunjit45/ContextOS`

![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Local--First-black?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-V1%20Production%20Ready-success?style=for-the-badge)

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

## 🔁 2. Core Product Loop

```text
       DATA
        ↓
   SIMULATION
        ↓
    AGENT RUN
        ↓
    EVALUATION
        ↓
 FAILURE ANALYSIS
        ↓
     INSIGHT
        ↓
   IMPROVEMENT
        ↓
     RE-RUN
```

---

## 🧠 3. Core Architecture & Monorepo Layout

```text
ContextOS/
├── apps/
│   ├── web/                    # Next.js / Vite + React 18 + Tailwind + Recharts + OLED Dark UI
│   └── api/                    # Python 3.12 + FastAPI + NetworkX + pgvector Server
├── packages/
│   ├── evaluation/             # Multi-dimensional Evaluators & Failure Taxonomy Engine
│   ├── retrieval/              # Hybrid Semantic, Keyword, Entity & Temporal Retrievers
│   ├── memory/                 # Context Budget Composer & Recency Ranker
│   ├── graph/                  # NetworkX Relational Context Graph Engine
│   ├── agents/                 # Baseline RAG Agent vs ContextOS Agent Adapters
│   ├── scenarios/              # Synthetic Organizational Workspace & Task Generator
│   └── providers/              # LiteLLM / Gemini / OpenAI / Ollama Model Adapters
├── benchmarks/                 # Temporal, Retrieval, Memory & Hallucination Suites
├── cli/                        # `contextos` Command-Line Tool
├── docker-compose.yml          # Local-first full stack deployment
└── requirements.txt            # Core engine dependencies
```

---

## 🧪 4. Key Laboratory Features

### 🕒 Signature Feature — Context Replay
Replay an organization over time (Day 1 → Day 7 → Day 30 → Day 60 → Today) to observe how an agent's available context, entity graph, and retained memories evolve over time.

### 📊 Root-Cause Failure Taxonomy
Every failed evaluation receives an automated root-cause classification:
1. **Retrieval Failure:** Relevant information exists but wasn't retrieved.
2. **Memory Failure:** Agent previously knew information but failed to retain it.
3. **Temporal Failure:** Agent relies on outdated Day 1 instructions over Day 30 updates.
4. **Entity Resolution Failure:** Fails to recognize `John Smith` = `john@acme.com`.
5. **Relationship Failure:** Fails to connect `John -> Acme -> Deal #104 -> Meeting`.
6. **Hallucination:** Agent invents unsupported facts for missing information queries.

---

## 🚀 5. Quickstart & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Tarunjit45/ContextOS.git
cd ContextOS

# 2. Spin up full stack using Docker Compose
docker compose up -d

# 3. Access Web UI Laboratory
open http://localhost:3000
```

### 💻 Command-Line Interface (CLI)

```bash
# Initialize ContextOS environment
contextos init

# Generate synthetic organizational workspace
contextos scenario generate --name "Acme Corp" --entities 40 --days 60

# Run benchmark suite comparing Baseline RAG vs ContextOS Agent
contextos benchmark run --agent "ContextOS Agent"

# Print evaluation report
contextos report
```

---

## 📜 Author & License

Architected & Engineered by **[Tarunjit Biswas](https://github.com/Tarunjit45)**.  
Released under the **MIT License**.
