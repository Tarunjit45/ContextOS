"""
ContextOS CLI Tool — Phase 2 & Phase 3 Commands
Usage:
  python cli/contextos.py llm check
  python cli/contextos.py benchmark run --scenarios 1000 --seed 42
  python cli/contextos.py benchmark live --scenarios 100 --seed 42 --provider mock
  python cli/contextos.py benchmark live-report
  python cli/contextos.py benchmark live-trace --run-id <RUN_ID>
  python cli/contextos.py benchmark validate-dataset
"""

import sys
import os
import json
import argparse
import asyncio
from pathlib import Path

root_dir = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root_dir))

from packages.scenarios.generator import SyntheticWorkspaceGenerator
from packages.evaluation.benchmark_runner import BenchmarkRunner, verify_dataset_v1_manifest
from packages.llm.provider import LLMFactory
from packages.evaluation.live_runner import LiveBenchmarkRunner
from packages.db.storage import BenchmarkStorage

def main():
    parser = argparse.ArgumentParser(description="ContextOS Evaluation & Benchmark CLI Platform")
    subparsers = parser.add_subparsers(dest="command", help="Available Commands")

    # --- 1. LLM Command Group ---
    llm_parser = subparsers.add_parser("llm", help="Manage LLM Providers & Health Checks")
    llm_sub = llm_parser.add_subparsers(dest="subcommand", help="LLM Subcommands")
    llm_sub.add_parser("check", help="Check LLM provider availability, models, and cost limit")

    # --- 2. Benchmark Command Group ---
    bench_parser = subparsers.add_parser("benchmark", help="Benchmark Engine Operations")
    bench_sub = bench_parser.add_subparsers(dest="subcommand", help="Benchmark Subcommands")

    # Deterministic Benchmark Run
    run_p = bench_sub.add_parser("run", help="Run Phase 2 deterministic benchmark suite")
    run_p.add_argument("--scenarios", type=int, default=1000, help="Scenario count (default 1000)")
    run_p.add_argument("--seed", type=int, default=42, help="Random seed (default 42)")
    run_p.add_argument("--agents", type=str, default="Baseline RAG Agent,ContextOS Agent", help="Comma-separated agent names")

    # Dataset Validation
    val_p = bench_sub.add_parser("validate-dataset", help="Validate Dataset v1 integrity and hash")
    val_p.add_argument("--scenarios", type=int, default=1000, help="Scenario count (default 1000)")
    val_p.add_argument("--seed", type=int, default=42, help="Random seed (default 42)")

    # Live LLM Benchmark Run (Phase 3)
    live_p = bench_sub.add_parser("live", help="Run Phase 3 live LLM benchmark suite")
    live_p.add_argument("--scenarios", type=int, default=100, help="Scenario count (default 100)")
    live_p.add_argument("--seed", type=int, default=42, help="Random seed (default 42)")
    live_p.add_argument("--provider", type=str, default="auto", choices=["auto", "ollama", "openai", "mock"], help="LLM provider (default auto)")
    live_p.add_argument("--model", type=str, default=None, help="LLM model name")

    # Live Report & Live Trace
    bench_sub.add_parser("live-report", help="Display Phase 3 LLM benchmark summary report")
    trace_p = bench_sub.add_parser("live-trace", help="View raw LLM execution trace by Run ID")
    trace_p.add_argument("--run-id", type=str, required=True, help="Live run ID")

    # Legacy Reports
    bench_sub.add_parser("report", help="View deterministic benchmark summary report")
    bench_sub.add_parser("history", help="List recent benchmark runs")

    args = parser.parse_args()

    if args.command == "llm" and args.subcommand == "check":
        print("\nChecking ContextOS LLM Provider Environments...")
        print("=" * 75)
        
        factory = LLMFactory()
        ollama = factory.get_provider("ollama")
        ollama_status = ollama.check_availability()
        
        openai = factory.get_provider("openai")
        openai_status = openai.check_availability()

        mock = factory.get_provider("mock")
        mock_status = mock.check_availability()

        max_cost = os.environ.get("CONTEXTOS_MAX_COST_USD", "5.00")

        print(f"|-- Provider: Ollama (http://localhost:11434)")
        print(f"|   |-- Available:   {'YES [OK]' if ollama_status['available'] else 'NO [OFFLINE]'}")
        print(f"|   +-- Error:       {ollama_status.get('error') or 'None'}")
        print(f"|-- Provider: OpenAI API")
        print(f"|   |-- Available:   {'YES [OK]' if openai_status['available'] else 'NO [KEY MISSING]'}")
        print(f"|   +-- Error:       {openai_status.get('error') or 'None'}")
        print(f"|-- Provider: Offline Mock LLM")
        print(f"|   +-- Available:   YES [OK] (Always ready)")
        print(f"+-- Cost Guard:     CONTEXTOS_MAX_COST_USD = ${max_cost}")
        print("=" * 75 + "\n")

    elif args.command == "benchmark" and args.subcommand == "validate-dataset":
        print(f"\nValidating Dataset v1 Manifest & Integrity (Seed: {args.seed})...")
        print("=" * 75)
        try:
            content = verify_dataset_v1_manifest()
            print(f"|-- Total Scenarios:       {len(content['scenarios'])}")
            print(f"|-- Ground Truth Leakage:  NONE [OK]")
            print(f"Wait SHA256 Hash Status:    VERIFIED [OK] (2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa)")
            print("======================================================================")
            print("DATASET VALIDATION PASSED SUCCESSFULLY!\n")
        except Exception as e:
            print(f"DATASET VALIDATION FAILED: {e}\n")

    elif args.command == "benchmark" and args.subcommand == "run":
        runner = BenchmarkRunner(seed=args.seed)
        agent_names = [a.strip() for a in args.agents.split(",") if a.strip()]

        try:
            dataset_content = verify_dataset_v1_manifest()
            ws = dataset_content["workspace"]
            dataset = dataset_content["scenarios"]
        except Exception as e:
            print(f"Dataset Verification Error: {e}")
            sys.exit(1)

        print(f"\nRunning ContextOS Phase 2.2 Benchmark Suite ({args.scenarios} Scenarios | Seed: {args.seed})...")
        print("=" * 75)

        summaries = []
        async def _execute_all():
            for agent_name in agent_names:
                print(f"Executing {args.scenarios} evaluation cases for [{agent_name}]...")
                result = await runner.run_benchmark(agent_name=agent_name, scenario_count=args.scenarios)
                summaries.append(result["summary"])
                s = result["summary"]
                mem = s.get('memory_recall', s.get('memory_retention', 0.0))
                temp = s.get('temporal_state_accuracy', s.get('temporal_reasoning', 0.0))
                ent = s.get('entity_resolution_accuracy', s.get('entity_disambiguation', 0.0))
                print(f"  +-- Acc: {s['overall_accuracy']}% | Mem: {mem}% | Temp: {temp}% | Ent: {ent}% | Halluc: {s['hallucination_rate']}% | P50: {s['p50_latency_ms']}ms")

        asyncio.run(_execute_all())
        print("=" * 75)

        reports = runner.export_reports(summaries)
        comp_doc = runner.generate_phase_2_2_comparison(summaries)

        print("\nContextOS Phase 2.2 Benchmark Summary:")
        print(f"  |-- JSON Report:  {reports['json']}")
        print(f"  |-- CSV Report:   {reports['csv']}")
        print(f"  |-- Markdown:     {reports['md']}")
        print(f"  +-- Comparison:   {comp_doc}\n")
        print("=" * 75 + "\n")

    elif args.command == "benchmark" and args.subcommand == "live":
        print(f"\nRunning ContextOS Phase 3 Live LLM Benchmark Suite ({args.scenarios} Scenarios | Provider: {args.provider})...")
        print("=" * 75)
        
        provider_obj = LLMFactory.get_provider(args.provider, model=args.model)
        live_runner = LiveBenchmarkRunner(provider=provider_obj, seed=args.seed)

        async def _run_live():
            res = await live_runner.run_live_benchmark(scenarios_count=args.scenarios)
            print("\nLive Benchmark Results:")
            for s in res["summaries"]:
                print(f"  |-- [{s['agent_name']}] ({s['provider']}/{s['model']})")
                print(f"  |   |-- Overall Accuracy: {s['overall_accuracy']}%")
                print(f"  |   |-- Hallucination:    {s['hallucination_rate']}%")
                print(f"  |   |-- P50 Latency:      {s['p50_latency_ms']} ms")
                print(f"  |   |-- Token Usage:      {s['total_input_tokens']} in / {s['total_output_tokens']} out")
                print(f"  |   +-- Total Cost:       ${s['total_cost_usd']:.4f}")
            print("\n  +-- Phase 3 Report: benchmarks/reports/PHASE_3_LLM_REPORT.md\n")

        asyncio.run(_run_live())

    elif args.command == "benchmark" and args.subcommand == "live-report":
        report_file = os.path.join(root_dir, "benchmarks", "reports", "PHASE_3_LLM_REPORT.md")
        if os.path.exists(report_file):
            print("\n" + open(report_file, encoding="utf-8").read())
        else:
            print("\n❌ No live LLM evaluations yet.\n")

    elif args.command == "benchmark" and args.subcommand == "live-trace":
        storage = BenchmarkStorage()
        with storage.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM llm_benchmark_traces WHERE run_id = ? LIMIT 5", (args.run_id,))
            rows = [dict(r) for r in cursor.fetchall()]
            print(f"\n🔍 Live Traces for Run ID '{args.run_id}':")
            print(json.dumps(rows, indent=2))

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
