# 🤝 Contributing to ContextOS

Thank you for your interest in contributing to ContextOS! ContextOS is an open-source evaluation platform and context compiler for autonomous AI agents.

---

## 1. Development Guidelines

1. **Dataset Integrity:** Never modify `benchmarks/datasets/v1/dataset.json` or alter the random seed (42). The dataset SHA256 hash `2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa` must remain intact.
2. **Zero Ground-Truth Leakage:** Agents under test must NEVER receive `task_category`, `expected_answer`, `expected_action`, or `failure_class`.
3. **No Credential Exposure:** Never commit API keys or credentials. Use process environment variables (`OPENROUTER_API_KEY`, `OPENAI_API_KEY`).
4. **Subsystem Testing:** All pull requests must pass the complete unit test suite (`python -m pytest -v`).

---

## 2. Pull Request Workflow

1. Fork the repository and create a feature branch (`git checkout -b feature/my-feature`).
2. Implement your changes following PEP 8 coding standards for Python and ESLint for TypeScript/Next.js.
3. Run unit tests and dataset validation:
   ```bash
   python -m pytest -v
   python cli/contextos.py benchmark validate-dataset
   ```
4. Commit your changes with clear, descriptive commit messages (`git commit -m "feat(retrieval): add hybrid dense-sparse fusion"`).
5. Push to your branch and open a Pull Request.

---

## 3. Reporting Issues

If you discover bugs or security vulnerabilities, please open an issue on GitHub with:
- System environment details (OS, Python version).
- Steps to reproduce.
- Relevant command output or stack traces.
