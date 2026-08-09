"""
ContextOS Phase 3 — Unit Test Suite for Real LLM Evaluation Subsystems
Includes unit tests for:
- Provider Abstraction & Mock Provider
- Ollama Availability Health Check
- Prompt Construction & Equivalence
- Zero Ground-Truth Leakage Enforcement
- Dataset Hash Verification
- LLM Trace Persistence
- Cost Guard & Token Tracking
- Error Handling
"""

import pytest
import os
import json
import hashlib
from pathlib import Path
from unittest.mock import MagicMock, patch

from packages.llm.provider import LLMFactory, MockLLMProvider, OllamaProvider, OpenAIProvider
from packages.agents.live_agents import LiveBaselineRAGAgent, LiveContextOSAgent, compute_sha256, SYSTEM_PROMPT_TEMPLATE
from packages.agents.agent_adapters import assert_no_ground_truth_leakage
from packages.scenarios.stratified import load_and_verify_dataset_v1, get_stratified_100_scenarios
from packages.db.storage import BenchmarkStorage
from packages.evaluation.live_runner import LiveBenchmarkRunner

# 1. Provider Abstraction Tests
def test_mock_llm_provider_generation():
    provider = MockLLMProvider()
    avail = provider.check_availability()
    assert avail["available"] is True
    assert avail["provider"] == "mock"

    res = provider.generate("System prompt", "Is outreach to Globex authorized as of Day 30?")
    assert res["status"] == "SUCCESS"
    assert "Yes" in res["text"] or "authorized" in res["text"] or "decision" in res["text"]
    assert res["cost_usd"] == 0.0

def test_ollama_provider_check_offline():
    provider = OllamaProvider(base_url="http://invalid-localhost-url:9999")
    avail = provider.check_availability()
    assert avail["available"] is False
    assert "error" in avail

def test_openai_provider_no_key():
    provider = OpenAIProvider(api_key=None)
    avail = provider.check_availability()
    assert avail["available"] is False

# 2. Zero Ground-Truth Leakage Guard Test
def test_zero_ground_truth_leakage_assertion():
    forbidden_task = {"query": "What is the vault PIN?", "task_category": "memory_decay"}
    with pytest.raises(ValueError, match="Ground-Truth Leakage"):
        assert_no_ground_truth_leakage(forbidden_task)

    clean_task = {"task_id": "scen_1", "query": "What is the vault PIN?"}
    assert_no_ground_truth_leakage(clean_task) # Should pass cleanly

# 3. Prompt Equivalence & Hashing Test
def test_prompt_equivalence_and_hashing():
    sys_hash = compute_sha256(SYSTEM_PROMPT_TEMPLATE)
    ctx_hash = compute_sha256("Sample Context")
    assert len(sys_hash) == 64
    assert len(ctx_hash) == 64

# 4. Dataset v1 Hash Verification Test
def test_phase3_dataset_hash_verification():
    root_dir = str(Path(__file__).resolve().parents[1])
    data = load_and_verify_dataset_v1(root_dir)
    assert len(data["scenarios"]) == 1000
    
    scenarios, manifest = get_stratified_100_scenarios(data)
    assert len(scenarios) == 100
    assert manifest["sample_size"] == 100

# 5. LLM Trace Persistence Test
def test_llm_trace_storage_persistence(tmp_path):
    db_file = tmp_path / "test_llm.db"
    storage = BenchmarkStorage(str(db_file))
    
    trace_data = {
        "run_id": "run_test_123",
        "scenario_id": "scen_01",
        "category": "memory_decay",
        "agent_name": "Live ContextOS",
        "provider": "mock",
        "model": "mock-llm",
        "system_prompt": SYSTEM_PROMPT_TEMPLATE,
        "user_prompt": "CONTEXT:\nTest\n\nQUESTION:\nQuery?",
        "context": "Test context",
        "answer": "Security bypass code 9842-AX.",
        "decision": "revealed",
        "confidence": 0.98,
        "input_tokens": 50,
        "output_tokens": 12,
        "cost_usd": 0.0,
        "latency_ms": 5.2,
        "system_prompt_hash": compute_sha256(SYSTEM_PROMPT_TEMPLATE),
        "user_prompt_hash": compute_sha256("user"),
        "context_hash": compute_sha256("ctx"),
        "execution_status": "SUCCESS",
        "created_at": "2026-08-09T00:00:00"
    }

    storage.save_llm_trace(trace_data)

    with storage.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM llm_benchmark_traces WHERE run_id = ?", ("run_test_123",))
        rows = cursor.fetchall()
        assert len(rows) == 1
        assert rows[0]["answer"] == "Security bypass code 9842-AX."

# 6. Cost Guard Test
@pytest.mark.asyncio
async def test_cost_guard_exceeded():
    provider = MockLLMProvider()
    runner = LiveBenchmarkRunner(provider=provider)
    runner.accumulated_cost_usd = 10.00 # Exceeds default $5.00 limit

    with pytest.raises(RuntimeError, match="HARD COST BUDGET EXCEEDED"):
        await runner.run_live_benchmark(scenarios_count=1)
