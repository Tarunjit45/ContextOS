# ContextOS Architecture & System Specification

## 1. Executive Summary

ContextOS is a local-first evaluation platform for testing long-context operational performance in autonomous AI agents.

## 2. Monorepo Structure

```text
ContextOS/
├── apps/
│   ├── web/                    # Next.js 15 App Router Frontend
│   └── api/                    # FastAPI Backend API Server
├── packages/
│   ├── retrieval/              # Hybrid Retrieval & Entity/Temporal Resolvers
│   │   ├── hybrid_retriever.py
│   │   ├── entity_resolver.py
│   │   └── temporal_resolver.py
│   ├── memory/                 # Memory Ranker & Context Budget Composer
│   │   ├── memory_ranker.py
│   │   └── context_composer.py
│   ├── context/                # Decision-Grade Context Compiler (Phase 3.3)
│   │   └── context_compiler.py
│   ├── graph/                  # NetworkX Context Graph Engine
│   │   └── context_graph.py
│   ├── llm/                    # LLM Provider Abstraction (Ollama, OpenAI, OpenRouter, Mock)
│   │   └── provider.py
│   ├── agents/                 # Baseline RAG & ContextOS Live Agent Adapters
│   ├── evaluation/             # Evaluator Engine & Live Benchmark Runner
│   ├── scenarios/              # Parameterized Synthetic Dataset Generator
│   └── db/                     # SQLite Local Storage Engine
├── tests/                      # Pytest Subsystem Test Suite (133 unit tests)
├── benchmarks/
│   ├── datasets/v1/            # Frozen Dataset v1 & manifest.json
│   └── reports/                # Benchmark Run Reports & PHASE_3_2_REAL_LLM_REPORT.md
└── cli/                        # contextos.py CLI tool
```

## 3. Context Pipeline Architecture

ContextOS implements a multi-stage decision-grade context compiler pipeline:

1. **Input Sanitization:** Strips ground-truth leakage (`task_category`, `expected_answer`, `expected_action`, `failure_class`).
2. **Hybrid Retrieval:** Multi-signal score blending lexical BM25, N-gram cosine similarity, entity hits, temporal decay, graph distance, and source authority.
3. **Entity Resolution:** Candidate scoring system with suffix matching (`Jr.` vs `Sr.`), role/department attributes, and explicit ambiguity detection.
4. **Temporal State Reconstruction:** Historical event timeline parsing resolving attribute state as of query time with validity intervals and superseded event tracking.
5. **Context Graph Traversal:** Bounded NetworkX multi-hop path expansion (`Person -> Project -> Meeting -> Decision`).
6. **Conflict Resolution:** Source authority precedence (`CRM > Meeting Note > Email > Slack > Note`) with chronological clearance superseding earlier hold notices.
7. **Evidence Ranking & Decision-Grade Context Compiler:** Budget-aware deterministic context compilation producing a concise structured format (`[ENTITIES]`, `[CURRENT STATE]`, `[TIMELINE]`, `[RELATIONSHIPS]`, `[EVIDENCE PROVENANCE]`, `[CONFLICT RESOLUTION]`, `[ANSWERABILITY]`, `[CONFIDENCE]`).
8. **Answerability Classification:** `SUFFICIENT`, `INSUFFICIENT`, `AMBIGUOUS`, or `CONFLICTED` state assignment.

## 4. Failure Taxonomy

Failed scenarios are categorized into 8 earliest identifiable failure stages:

1. `RETRIEVAL_FAILURE`
2. `MEMORY_FAILURE`
3. `TEMPORAL_FAILURE`
4. `ENTITY_RESOLUTION_FAILURE`
5. `RELATIONSHIP_FAILURE`
6. `CONTEXT_COMPOSITION_FAILURE`
7. `HALLUCINATION`
8. `TOOL_ACTION_FAILURE`
