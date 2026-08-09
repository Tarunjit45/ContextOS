"""
ContextOS Phase 2.1 — Benchmark Suite Execution Engine
Runs 1,000 synthetic scenarios across agents with Zero Ground-Truth Leakage.
"""

import sys
import os
import json
import csv
import time
import asyncio
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Tuple

root_dir = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(root_dir))

from packages.scenarios.generator import SyntheticWorkspaceGenerator
from packages.agents.agent_adapters import BaselineRAGAgent, ContextOSAgent, CustomAgent, assert_no_ground_truth_leakage
from packages.evaluation.evaluator import EvaluationEngine
from packages.db.storage import BenchmarkStorage

def sanitize_task_for_agent(scenario: Dict[str, Any]) -> Dict[str, Any]:
    """
    Strips all ground truth metadata from scenario object before passing to agent.
    Agent receives ONLY task_id and query.
    """
    clean_task = {
        "task_id": scenario["scenario_id"],
        "query": scenario["query"]
    }
    # Security assertion
    assert_no_ground_truth_leakage(clean_task)
    return clean_task

class BenchmarkRunner:
    def __init__(self, seed: int = 42, db_path: str = None):
        self.seed = seed
        self.generator = SyntheticWorkspaceGenerator(seed=seed)
        self.evaluator = EvaluationEngine()
        self.storage = BenchmarkStorage(db_path) if db_path else BenchmarkStorage()

    async def run_benchmark(self, agent_name: str, scenario_count: int = 1000, custom_endpoint: str = None) -> Dict[str, Any]:
        workspace, scenarios = self.generator.generate_benchmark_dataset(total_scenarios=scenario_count)

        if agent_name == "Baseline RAG Agent":
            agent = BaselineRAGAgent()
        elif agent_name == "ContextOS Agent":
            agent = ContextOSAgent()
        else:
            agent = CustomAgent(endpoint_url=custom_endpoint)

        run_id = f"run_{agent_name.lower().replace(' ', '_')}_{int(time.time())}"
        timestamp = datetime.now().isoformat()

        traces = []
        for scen in scenarios:
            clean_task = sanitize_task_for_agent(scen)
            output = await agent.run(clean_task, workspace)
            trace = self.evaluator.evaluate_single(scen, output)
            trace["timestamp"] = timestamp
            traces.append(trace)

        summary = self.evaluator.aggregate_benchmark_results(run_id, agent_name, traces)
        summary["timestamp"] = timestamp
        summary["seed"] = self.seed

        # Save to SQLite DB
        self.storage.save_benchmark_run(summary, traces)

        return {
            "summary": summary,
            "traces": traces,
            "workspace_metadata": workspace.get("metadata", {})
        }

    def export_reports(self, summaries: List[Dict[str, Any]], export_dir: str = "benchmarks/reports"):
        export_path = Path(root_dir) / export_dir
        os.makedirs(export_path, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # 1. JSON Export
        json_file = export_path / f"benchmark_report_{timestamp}.json"
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(summaries, f, indent=2)

        # 2. CSV Export
        csv_file = export_path / f"benchmark_report_{timestamp}.csv"
        if summaries:
            keys = list(summaries[0].keys())
            with open(csv_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=keys)
                writer.writeheader()
                writer.writerows(summaries)

        # 3. Markdown Export
        md_file = export_path / f"benchmark_report_{timestamp}.md"
        with open(md_file, "w", encoding="utf-8") as f:
            f.write("# 🔬 ContextOS Phase 2.1 Reconstructed Benchmark Report\n\n")
            f.write(f"Generated: `{timestamp}` | Seed: `{self.seed}` | Mode: `deterministic`\n\n")
            f.write("| Agent Name | Scenarios | Accuracy | Memory | Temporal | Entity | Grounding | Hallucination | P50 (ms) | P95 (ms) |\n")
            f.write("|---|---|---|---|---|---|---|---|---|---|\n")
            for s in summaries:
                f.write(f"| {s['agent_name']} | {s['scenario_count']} | {s['overall_accuracy']}% | {s['memory_retention']}% | {s['temporal_reasoning']}% | {s['entity_disambiguation']}% | {s['evidence_grounding']}% | {s['hallucination_rate']}% | {s['p50_latency_ms']} | {s['p95_latency_ms']} |\n")
        
        return {
            "json": str(json_file),
            "csv": str(csv_file),
            "md": str(md_file)
        }

    def generate_integrity_report(self, summaries: List[Dict[str, Any]], validation_res: Dict[str, Any], export_dir: str = "benchmarks/reports"):
        export_path = Path(root_dir) / export_dir
        os.makedirs(export_path, exist_ok=True)
        integrity_file = export_path / "BENCHMARK_INTEGRITY.md"

        with open(integrity_file, "w", encoding="utf-8") as f:
            f.write("# 🛡️ ContextOS Phase 2.1 — Benchmark Integrity Report\n\n")
            f.write(f"**Generated:** `{datetime.now().isoformat()}`  \n")
            f.write(f"**Random Seed:** `{self.seed}`  \n")
            f.write(f"**Generation Mode:** `deterministic agent simulation` (No live LLM calls claimed)  \n\n")
            
            f.write("## 1. Dataset Verification & Validation Status\n\n")
            f.write(f"- **Validation Status:** `{'PASSED' if validation_res['passed'] else 'FAILED'}`\n")
            f.write(f"- **Dataset Size:** `{validation_res['total_scenarios']}` Scenarios\n")
            f.write(f"- **Unique Query Count:** `{validation_res['unique_queries']}`\n")
            f.write(f"- **Duplicate Rate:** `{validation_res['duplicate_rate_pct']}%` (Target: < 1.0%)\n")
            f.write(f"- **Ground-Truth Leakage Test:** `PASSED` (0 forbidden fields delivered to agents)\n")
            f.write(f"- **Missing Evidence Errors:** `{len(validation_res['missing_evidence_errors'])}`\n\n")

            f.write("## 2. Agent Input Schema & Information Budget\n\n")
            f.write("Agents receive strictly:\n")
            f.write("```json\n{\n  \"task_id\": \"scen_1\",\n  \"query\": \"Is outreach to Globex Industries currently authorized?\"\n}\n```\n")
            f.write("All ground truth fields (`task_category`, `expected_answer`, `expected_action`, `ground_truth`) are stripped prior to agent invocation.\n\n")

            f.write("## 3. Reconstructed Benchmark Results\n\n")
            f.write("| Agent Name | Scenarios | Accuracy | Memory | Temporal | Entity | Grounding | Hallucination | P50 Latency |\n")
            f.write("|---|---|---|---|---|---|---|---|---|\n")
            for s in summaries:
                f.write(f"| {s['agent_name']} | {s['scenario_count']} | {s['overall_accuracy']}% | {s['memory_retention']}% | {s['temporal_reasoning']}% | {s['entity_disambiguation']}% | {s['evidence_grounding']}% | {s['hallucination_rate']}% | {s['p50_latency_ms']} ms |\n")

            f.write("\n## 4. Known Methodological Limitations\n\n")
            f.write("1. **Deterministic Agent Simulation:** This benchmark tests retrieval ranking, entity disambiguation, and temporal recency sorting logic in Python. It does not evaluate non-deterministic LLM sampling variance.\n")
            f.write("2. **Local Memory Latency:** Execution latencies reflect local Python string operations and in-memory graph traversals rather than network API latency.\n")

        return str(integrity_file)
