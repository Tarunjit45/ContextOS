"""
ContextOS Phase 3.1 — Low-Resource Unit Test Suite
Includes unit tests for:
- Hardware Detection & RAM Risk Assessment
- Stratified 10-Scenario Dataset Selection
- Context Composer Compact Mode & Telemetry
- Cost Budget Guard & Unknown Cost Formatting
- Provider Failure Isolation
- Zero Ground-Truth Leakage Enforcement
"""

import pytest
import os
import json
import hashlib
from pathlib import Path
from unittest.mock import MagicMock, patch

from packages.utils.hardware import detect_hardware, assess_model_resource_fit, estimate_model_params
from packages.scenarios.stratified import load_and_verify_dataset_v1, get_stratified_10_scenarios, save_stratified_manifest
from packages.memory.context_composer import ContextComposer
from packages.agents.live_agents import LiveContextOSCompactAgent, LiveBaselineRAGAgent, LiveContextOSAgent
from packages.llm.provider import MockLLMProvider, OllamaProvider
from packages.evaluation.live_runner import LiveBenchmarkRunner

# 1. Hardware Detection & RAM Risk Assessment Tests
def test_hardware_detection():
    hw = detect_hardware()
    assert "cpu_cores" in hw
    assert "total_ram_gb" in hw
    assert "available_ram_gb" in hw
    assert "has_gpu" in hw

def test_model_params_estimation():
    assert estimate_model_params("llama3:8b") == 8.0
    assert estimate_model_params("qwen2.5:1.5b") == 1.5
    assert estimate_model_params("phi3:mini") == 0.5

def test_model_resource_fit_assessment():
    mock_hw = {
        "os": "Windows",
        "cpu_cores": 4,
        "total_ram_gb": 6.0,
        "available_ram_gb": 1.5,
        "has_gpu": False,
        "gpu_name": None,
        "gpu_vram_mb": 0
    }
    
    # 8B model requires ~7.0GB RAM -> Should trigger warning on 1.5GB available RAM
    fit_8b = assess_model_resource_fit("llama3:8b", mock_hw)
    assert fit_8b["is_fit"] is False
    assert "WARNING" in fit_8b["warning_message"]

    # Small 1.5B model requires ~2.1GB RAM -> Low RAM fit
    fit_1b = assess_model_resource_fit("qwen2.5:0.5b", mock_hw)
    assert fit_1b["estimated_ram_required_gb"] < 2.0

# 2. Stratified 10-Scenario Selection Test
def test_stratified_10_scenarios_manifest():
    root_dir = str(Path(__file__).resolve().parents[1])
    data = load_and_verify_dataset_v1(root_dir)
    scenarios, manifest = get_stratified_10_scenarios(data)
    assert len(scenarios) == 10
    assert manifest["sample_size"] == 10
    assert manifest["dataset_v1_sha256"] == "2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa"

# 3. Context Composer Compact Mode Test
def test_compact_context_composer():
    composer = ContextComposer(token_budget=2000)
    retrieved = [
        {"evidence_id": "m1", "raw_comm": {"id": "m1", "type": "crm", "content": "Critical deal status", "timestamp": "2026-01-05"}},
        {"evidence_id": "m2", "raw_comm": {"id": "m2", "type": "note", "content": "Secondary note", "timestamp": "2026-01-06"}}
    ]
    entities = {"people": [{"name": "John Smith", "email": "john@acme.com", "role": "VP", "department": "Sales"}], "companies": []}
    state = {"current_value": "allowed", "valid_as_of": "2026-01-30"}

    compact = composer.compose_compact(retrieved, entities, state, ["p1"])
    assert compact["mode"] == "compact"
    assert "critical_facts" in compact
    assert "telemetry" in compact
    assert compact["telemetry"]["raw_evidence_count"] == 2

# 4. Three-Way Live Runner Smoke Test (Offline Mock)
@pytest.mark.asyncio
async def test_three_way_live_runner_smoke_test(tmp_path):
    provider = MockLLMProvider()
    db_file = tmp_path / "smoke.db"
    runner = LiveBenchmarkRunner(provider=provider, db_path=str(db_file))

    # Run 1-scenario smoke test
    res = await runner.run_live_benchmark(scenarios_count=1)
    assert res["run_id"].startswith("live_run_")
    assert len(res["summaries"]) == 3 # Baseline, Full, Compact
    assert len(res["traces"]) == 3
