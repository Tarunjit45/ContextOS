"""
ContextOS Phase 2 — Benchmark Suite Execution Engine
Runs 1,000 synthetic scenarios across agents, computes metrics, persists results to SQLite, and exports reports.
"""

import sys
import os
import json
import csv
import time
import asyncio
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

root_dir = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(root_dir))

from packages.scenarios.generator import SyntheticWorkspaceGenerator
from packages.agents.agent_adapters import BaselineRAGAgent, ContextOSAgent, CustomAgent
from packages.evaluation.evaluator import EvaluationEngine
from packages.db.storage import BenchmarkStorage

class BenchmarkRunner:
    def __init__(self, db_path: str = None):
        self.generator = SyntheticWorkspaceGenerator()
        self.evaluator = EvaluationEngine()
        self.storage = BenchmarkStorage(db_path) if db_path else BenchmarkStorage()

    async def run_benchmark(self, agent_name: str, scenario_count: int = 1000, custom_endpoint: str = None) -> Dict[str, Any]:
        scenarios = self.generator.generate_benchmark_dataset(total_scenarios=scenario_count)
        workspace = self.generator.generate_workspace()

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
            output = await agent.run(scen, workspace)
            trace = self.evaluator.evaluate_single(scen, output)
            trace["timestamp"] = timestamp
            traces.append(trace)

        summary = self.evaluator.aggregate_benchmark_results(run_id, agent_name, traces)
        summary["timestamp"] = timestamp

        # Save to SQLite DB
        self.storage.save_benchmark_run(summary, traces)

        return {
            "summary": summary,
            "traces": traces
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
            f.write("# 🔬 ContextOS Phase 2 Benchmark Report\n\n")
            f.write(f"Generated: `{timestamp}`\n\n")
            f.write("| Agent Name | Scenarios | Accuracy | Memory | Temporal | Entity | Grounding | Hallucination | P50 (ms) | P95 (ms) |\n")
            f.write("|---|---|---|---|---|---|---|---|---|---|\n")
            for s in summaries:
                f.write(f"| {s['agent_name']} | {s['scenario_count']} | {s['overall_accuracy']}% | {s['memory_retention']}% | {s['temporal_reasoning']}% | {s['entity_disambiguation']}% | {s['evidence_grounding']}% | {s['hallucination_rate']}% | {s['p50_latency_ms']} | {s['p95_latency_ms']} |\n")
        
        return {
            "json": str(json_file),
            "csv": str(csv_file),
            "md": str(md_file)
        }
