# 🔒 ContextOS Security & Disclosure Policy

ContextOS prioritizes data privacy, API credential protection, and benchmark evaluation integrity.

---

## 1. API Credential Protection

- **Environment Variable Isolation:** API keys (`OPENROUTER_API_KEY`, `OPENAI_API_KEY`) are read strictly from process environment variables at runtime.
- **Zero Disk Persistence:** Credentials are **never** logged to stdout, printed in CLI summaries, or saved to SQLite trace databases (`llm_benchmark_traces`).
- **Zero Repository Exposure:** Source code, configuration files, and committed benchmarks contain no hardcoded secrets or API tokens.

---

## 2. Benchmark Integrity & Ground-Truth Leakage Protection

- **Strict Payload Isolation:** Function `assert_no_ground_truth_leakage(task)` strips all ground-truth metadata (`task_category`, `expected_answer`, `expected_action`, `failure_class`) before task payloads reach any agent under evaluation.
- **Dataset Hash Guard:** Verification function `load_and_verify_dataset_v1()` checks the Dataset v1 SHA256 hash (`2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa`) before benchmark execution to prevent dataset tampering.

---

## 3. Reporting Security Vulnerabilities

If you discover a security vulnerability or credential handling issue in ContextOS, please disclose it responsibly by contacting the maintainer via GitHub issues or email. We will review and address reported vulnerabilities promptly.
