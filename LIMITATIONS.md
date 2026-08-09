# ⚠️ ContextOS Research Limitations & Scope

This document provides a candid evaluation of the research limitations, experimental boundaries, and engineering trade-offs in ContextOS.

---

## 1. Synthetic Dataset Boundaries

- **Parameterized Generation:** Dataset v1 scenarios (1,000 cases, seed 42) are generated via parameterized templates (`packages/scenarios/generator.py`) rather than extracted from live production enterprise workspaces.
- **Controlled Scope:** Scenarios simulate common organizational artifacts (Slack chats, emails, CRM records, meeting notes, vault PINs) but do not capture complex unformatted PDF documents, image attachments, or nested spreadsheets.

---

## 2. Real LLM Sample Size Limitations ($n=10$)

- **Low-Resource Smoke Test:** Real LLM evaluations were conducted on $n=10$ stratified scenarios (`benchmarks/datasets/v1/stratified_10_manifest.json`).
- **Statistical Insufficiency:** $n=10$ is **NOT** statistically sufficient to prove general performance superiority across arbitrary enterprise datasets or model families.
- **Model Endpoint Variance:** Real LLM runs utilized OpenRouter free routed endpoints (`openrouter/free` -> `nvidia/nemotron-3-ultra-550b-a55b:free`). Free endpoints can experience routing latency spikes or intermittent model substitutions.

---

## 3. Local Development Hardware Environment

- **CPU-Only Execution:** System development and testing were conducted on a Windows 11 machine with 12 CPU cores, 5.85 GB Total RAM, and 0.40 GB Available RAM (no discrete NVIDIA GPU).
- **Local LLM Thrashing Risk:** Attempting to run standard 7B or 8B local models via Ollama on this environment causes out-of-memory thrashing. Small quantized 0.5B/1B models or remote APIs (OpenRouter, OpenAI) are required.

---

## 4. Vector Database & Large-Scale Indexing

- **In-Memory Pre-Filtering:** Candidate document pre-filtering operates in-memory using BM25 and N-gram cosine similarity rather than distributed vector databases.
- **Scale Out:** Performance on 10,000+ document workspaces using production vector indices (Qdrant, LanceDB) has not yet been benchmarked.

---

## 5. Subsystem Edge Cases

- **Entity Disambiguation Mismatches:** When multiple individuals share identical names and identical departments without distinguishing roles or emails, answerability correctly flags `AMBIGUOUS`.
- **Complex Multi-Hop Decision Ordering:** In rare cases involving 4+ chained meeting notes, graph traversal can omit secondary relationship nodes if context budget is set below 512 tokens.
