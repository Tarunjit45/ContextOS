#!/usr/bin/env python3
"""
ContextOS CLI — Command-Line Interface for Agent Memory & Context Stress-Testing Tool
Supports Phase 2 Reproducible Benchmark Suite Execution (--scenarios 1000)
"""

import sys
import json
import argparse
import asyncio
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# Add parent directory to sys.path
root_dir = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root_dir))

from packages.scenarios.generator import SyntheticWorkspaceGenerator
from packages.evaluation.benchmark_runner import BenchmarkRunner
from packages.db.storage import BenchmarkStorage

def main():
    parser = argparse.ArgumentParser(description="ContextOS CLI — Agent Memory & Context Stress-Testing Tool")
    subparsers = parser.add_subparsers(dest="command", help="Available ContextOS commands")

    # init
    subparsers.add_parser("init", help="Initialize local ContextOS workspace configuration")
    
    # scenario generate
    scenario_parser = subparsers.add_parser("scenario", help="Scenario management commands")
    scenario_sub = scenario_parser.add_subparsers(dest="subcommand")
    gen_p = scenario_sub.add_parser("generate", help="Generate synthetic organizational scenario dataset")
    gen_p.add_argument("--name", default="Acme Corporation", help="Workspace organization name")
    gen_p.add_argument("--scenarios", type=int, default=1000, help="Number of synthetic scenarios")

    # benchmark run
    bm_parser = subparsers.add_parser("benchmark", help="Benchmark execution commands")
    bm_sub = bm_parser.add_subparsers(dest="subcommand")
    run_bm = bm_sub.add_parser("run", help="Run full memory & temporal benchmark suite")
    run_bm.add_argument("--scenarios", type=int, default=1000, help="Number of benchmark scenarios (default: 1000)")
    run_bm.add_argument("--agents", default="Baseline RAG Agent,ContextOS Agent", help="Comma-separated agent names")
    run_bm.add_argument("--output", default="json,csv,md", help="Export report formats")

    # report
    report_parser = subparsers.add_parser("report", help="Generate benchmark evaluation report from database")

    args = parser.parse_args()

    if args.command == "init":
        storage = BenchmarkStorage()
        print("⚡ ContextOS Environment Initialized.")
        print("├── Platform: Local-first Agent Evaluation Laboratory")
        print("├── Database: SQLite (benchmarks/contextos_benchmark.db)")
        print("└── Retrieval: Hybrid semantic, keyword, entity and temporal retrieval")

    elif args.command == "scenario" and getattr(args, "subcommand", None) == "generate":
        gen = SyntheticWorkspaceGenerator()
        dataset = gen.generate_benchmark_dataset(total_scenarios=args.scenarios)
        print(f"✅ Generated {len(dataset)} Synthetic Benchmark Scenarios across 6 Failure Classes.")

    elif args.command == "benchmark" and getattr(args, "subcommand", None) == "run":
        runner = BenchmarkRunner()
        agent_names = [a.strip() for a in args.agents.split(",") if a.strip()]

        print(f"\n🚀 Running ContextOS Phase 2 Benchmark Suite ({args.scenarios} Scenarios)...")
        print("=" * 75)

        summaries = []
        async def _execute_all():
            for agent_name in agent_names:
                print(f"▶ Executing {args.scenarios} evaluation cases for [{agent_name}]...")
                result = await runner.run_benchmark(agent_name=agent_name, scenario_count=args.scenarios)
                summaries.append(result["summary"])
                s = result["summary"]
                print(f"  └── Acc: {s['overall_accuracy']}% | Mem: {s['memory_retention']}% | Temp: {s['temporal_reasoning']}% | Ent: {s['entity_disambiguation']}% | Halluc: {s['hallucination_rate']}% | P50: {s['p50_latency_ms']}ms")

        asyncio.run(_execute_all())
        print("=" * 75)

        reports = runner.export_reports(summaries)
        print("📊 Benchmark Reports Generated:")
        print(f"├── JSON: {reports['json']}")
        print(f"├── CSV:  {reports['csv']}")
        print(f"└── MD:   {reports['md']}")
        print("=" * 75 + "\n")

    elif args.command == "report":
        storage = BenchmarkStorage()
        runs = storage.get_latest_runs(limit=5)
        if not runs:
            print("No evaluations yet. Run `python cli/contextos.py benchmark run` to execute benchmark suite.")
            return

        print("\n📊 ContextOS Benchmark Database Summary")
        print("=" * 75)
        print(f"{'Agent Name':<20} | {'Count':<5} | {'Acc (%)':<7} | {'Mem (%)':<7} | {'Temp (%)':<8} | {'Halluc (%)':<10}")
        print("-" * 75)
        for r in runs:
            print(f"{r['agent_name']:<20} | {r['scenario_count']:<5} | {r['overall_accuracy']:<7} | {r['memory_retention']:<7} | {r['temporal_reasoning']:<8} | {r['hallucination_rate']:<10}")
        print("=" * 75 + "\n")

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
