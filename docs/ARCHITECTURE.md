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
│   ├── graph/                  # NetworkX Context Graph Engine
│   │   └── context_graph.py
│   ├── agents/                 # Baseline RAG & ContextOS Agent Adapters
│   ├── evaluation/             # Evaluator Engine & Benchmark Runner
│   ├── scenarios/              # Parameterized Synthetic Dataset Generator
│   └── db/                     # SQLite Local Storage Engine
├── tests/                      # Pytest Subsystem Test Suite (111 unit tests)
├── benchmarks/
│   ├── datasets/v1/            # Frozen Dataset v1 & manifest.json
│   └── reports/                # Benchmark Run Reports & PHASE_2_2_COMPARISON.md
└── cli/                        # contextos.py CLI tool
```

## 3. Context Pipeline Architecture

ContextOS implements a multi-stage context retrieval and composition pipeline:

1. **Input Sanitization:** Strips ground-truth leakage (`task_category`, `expected_answer`, `expected_action`, `failure_class`).
2. **Hybrid Retrieval:** Multi-signal score blending lexical BM25, N-gram cosine similarity, entity hits, temporal decay, graph distance, and source authority.
3. **Entity Resolution:** Canonical entity disambiguation matching names, emails, roles, and departments.
4. **Temporal State Reconstruction:** Historical event timeline parsing resolving attribute state as of query time.
5. **Context Graph Traversal:** Bounded NetworkX multi-hop path expansion (`Person -> Project -> Meeting -> Decision`).
6. **Memory Ranking:** Relevance + Importance > Recency ranking.
7. **Context Composition:** Structured budget-aware context assembly with conflict precedence rules.

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
