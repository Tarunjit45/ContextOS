"""
ContextOS Phase 3 — Live LLM Benchmark Suite Execution Engine
Executes Live Baseline RAG and Live ContextOS over stratified dataset samples.
Exports PHASE_3_LLM_REPORT.md and PHASE_3_REPRESENTATIVE_CASES.md.
"""

import sys
import os
import json
import time
import asyncio
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Tuple

root_dir = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(root_dir))

from packages.scenarios.stratified import load_and_verify_dataset_v1, get_stratified_100_scenarios, save_stratified_manifest
from packages.agents.live_agents import LiveBaselineRAGAgent, LiveContextOSAgent
from packages.evaluation.live_evaluator import LiveEvaluationEngine
from packages.llm.provider import LLMFactory, LLMProvider
from packages.db.storage import BenchmarkStorage

MAX_COST_BUDGET_USD = float(os.environ.get("CONTEXTOS_MAX_COST_USD", "5.00"))

class LiveBenchmarkRunner:
    def __init__(self, provider: LLMProvider = None, seed: int = 42, db_path: str = None):
        self.provider = provider or LLMFactory.get_provider("auto")
        self.seed = seed
        self.evaluator = LiveEvaluationEngine()
        self.storage = BenchmarkStorage(db_path) if db_path else BenchmarkStorage()
        self.accumulated_cost_usd = 0.0

    async def run_live_benchmark(self, scenarios_count: int = 100, runs: int = 1) -> Dict[str, Any]:
        data = load_and_verify_dataset_v1(str(root_dir))
        workspace = data["workspace"]

        if scenarios_count == 100:
            selected_scenarios, manifest = get_stratified_100_scenarios(data)
            save_stratified_manifest(manifest, str(root_dir))
        else:
            selected_scenarios = data["scenarios"][:scenarios_count]

        baseline_agent = LiveBaselineRAGAgent(self.provider)
        contextos_agent = LiveContextOSAgent(self.provider)

        run_id = f"live_run_{int(time.time())}"
        timestamp = datetime.now().isoformat()

        all_summaries = []
        all_traces = []

        for agent in [baseline_agent, contextos_agent]:
            agent_traces = []
            for scen in selected_scenarios:
                clean_task = {"task_id": scen["scenario_id"], "query": scen["query"]}
                
                # Run agent
                output = await agent.run(clean_task, workspace)
                
                # Cost Guard Check
                cost = output.get("cost_usd", 0.0)
                self.accumulated_cost_usd += cost
                if self.accumulated_cost_usd > MAX_COST_BUDGET_USD:
                    raise RuntimeError(f"HARD COST BUDGET EXCEEDED! Current cost ${self.accumulated_cost_usd:.4f} > max limit ${MAX_COST_BUDGET_USD:.2f}")

                # Evaluate
                eval_res = self.evaluator.evaluate_live_trace(scen, output)

                trace_record = {
                    "run_id": run_id,
                    "scenario_id": scen["scenario_id"],
                    "category": scen["category"],
                    "agent_name": output["agent_type"],
                    "provider": output["provider"],
                    "model": output["model"],
                    "system_prompt": output["system_prompt"],
                    "user_prompt": output["user_prompt"],
                    "context": output["context"],
                    "answer": output["response"],
                    "decision": output["decision"],
                    "confidence": output["confidence"],
                    "input_tokens": output["input_tokens"],
                    "output_tokens": output["output_tokens"],
                    "cost_usd": output["cost_usd"],
                    "latency_ms": output["latency"]["total_ms"],
                    "system_prompt_hash": output["system_prompt_hash"],
                    "user_prompt_hash": output["user_prompt_hash"],
                    "context_hash": output["context_hash"],
                    "execution_status": eval_res["execution_status"],
                    "error_message": eval_res.get("error_message"),
                    "git_commit": "7b24a36",
                    "created_at": timestamp,
                    "is_action_correct": eval_res["is_action_correct"],
                    "is_hallucinating": eval_res.get("is_hallucinating", False),
                    "failure_class": eval_res.get("failure_class"),
                    "expected_answer": scen.get("expected_answer"),
                    "query": scen.get("query")
                }

                self.storage.save_llm_trace(trace_record)
                agent_traces.append(trace_record)
                all_traces.append(trace_record)

            # Summarize Agent Metrics
            total_cases = len(agent_traces)
            valid_cases = [t for t in agent_traces if t["execution_status"] == "SUCCESS"]
            correct_cases = [t for t in valid_cases if t["is_action_correct"]]

            overall_accuracy = (len(correct_cases) / total_cases * 100.0) if total_cases > 0 else 0.0
            halluc_rate = (sum(1 for t in valid_cases if t["is_hallucinating"]) / total_cases * 100.0) if total_cases > 0 else 0.0

            latencies = [t["latency_ms"] for t in agent_traces]
            latencies.sort()
            p50_lat = latencies[len(latencies)//2] if latencies else 0.0
            p95_lat = latencies[int(len(latencies)*0.95)] if latencies else 0.0

            tot_in_tok = sum(t["input_tokens"] for t in agent_traces)
            tot_out_tok = sum(t["output_tokens"] for t in agent_traces)
            tot_cost = sum(t["cost_usd"] for t in agent_traces)

            summary = {
                "run_id": run_id,
                "agent_name": agent_traces[0]["agent_name"],
                "provider": agent_traces[0]["provider"],
                "model": agent_traces[0]["model"],
                "scenario_count": total_cases,
                "overall_accuracy": round(overall_accuracy, 1),
                "hallucination_rate": round(halluc_rate, 1),
                "p50_latency_ms": round(p50_lat, 2),
                "p95_latency_ms": round(p95_lat, 2),
                "total_input_tokens": tot_in_tok,
                "total_output_tokens": tot_out_tok,
                "total_cost_usd": round(tot_cost, 6)
            }
            all_summaries.append(summary)

        self.export_reports(all_summaries, all_traces)
        return {"run_id": run_id, "summaries": all_summaries, "traces": all_traces}

    def export_reports(self, summaries: List[Dict[str, Any]], traces: List[Dict[str, Any]]):
        reports_dir = root_dir / "benchmarks" / "reports"
        os.makedirs(reports_dir, exist_ok=True)

        # 1. Main Phase 3 Report
        report_path = reports_dir / "PHASE_3_LLM_REPORT.md"
        base_s = next((s for s in summaries if "Baseline" in s["agent_name"]), {})
        ctx_s = next((s for s in summaries if "ContextOS" in s["agent_name"]), {})

        with open(report_path, "w", encoding="utf-8") as f:
            f.write("# 🔬 ContextOS Phase 3 — Live LLM Evaluation Engine Report\n\n")
            f.write(f"**Execution Timestamp:** `{datetime.now().isoformat()}`  \n")
            f.write(f"**Dataset v1 Hash Status:** `VERIFIED ✓ (SHA256: 2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa)`  \n")
            f.write(f"**Provider:** `{summaries[0]['provider']}` | **Model:** `{summaries[0]['model']}` | **Temperature:** `0.0`  \n")
            f.write(f"**Evaluation Method:** `deterministic ground-truth assertion`  \n\n")

            f.write("## 1. Metric Comparison\n\n")
            f.write("| Metric | Live Baseline RAG | Live ContextOS | Delta (ContextOS vs Baseline) |\n")
            f.write("|---|---|---|---|\n")

            acc_b = base_s.get("overall_accuracy", 0.0)
            acc_c = ctx_s.get("overall_accuracy", 0.0)
            f.write(f"| **Overall Accuracy** | {acc_b}% | {acc_c}% | {round(acc_c - acc_b, 1):+}% |\n")

            h_b = base_s.get("hallucination_rate", 0.0)
            h_c = ctx_s.get("hallucination_rate", 0.0)
            f.write(f"| **Hallucination Rate** | {h_b}% | {h_c}% | {round(h_c - h_b, 1):+}% |\n")

            p50_b = base_s.get("p50_latency_ms", 0.0)
            p50_c = ctx_s.get("p50_latency_ms", 0.0)
            f.write(f"| **P50 Latency** | {p50_b} ms | {p50_c} ms | {round(p50_c - p50_b, 2):+} ms |\n")

            tok_in_b = base_s.get("total_input_tokens", 0)
            tok_in_c = ctx_s.get("total_input_tokens", 0)
            f.write(f"| **Total Input Tokens** | {tok_in_b} | {tok_in_c} | {tok_in_c - tok_in_b:+} |\n")

            cost_b = base_s.get("total_cost_usd", 0.0)
            cost_c = ctx_s.get("total_cost_usd", 0.0)
            f.write(f"| **Total Cost (USD)** | ${cost_b:.4f} | ${cost_c:.4f} | ${cost_c - cost_b:+.4f} |\n\n")

        # 2. Representative Cases Report
        rep_path = reports_dir / "PHASE_3_REPRESENTATIVE_CASES.md"

        ctx_wins = []
        base_wins = []
        both_correct = []
        both_failed = []

        scen_ids = list(set(t["scenario_id"] for t in traces))
        for sid in scen_ids:
            b_tr = next((t for t in traces if t["scenario_id"] == sid and "Baseline" in t["agent_name"]), None)
            c_tr = next((t for t in traces if t["scenario_id"] == sid and "ContextOS" in t["agent_name"]), None)
            
            if b_tr and c_tr:
                b_pass = b_tr["is_action_correct"]
                c_pass = c_tr["is_action_correct"]

                pair = {"scenario_id": sid, "query": b_tr["query"], "expected": b_tr["expected_answer"], "b": b_tr, "c": c_tr}
                if c_pass and not b_pass and len(ctx_wins) < 5:
                    ctx_wins.append(pair)
                elif b_pass and not c_pass and len(base_wins) < 5:
                    base_wins.append(pair)
                elif b_pass and c_pass and len(both_correct) < 5:
                    both_correct.append(pair)
                elif not b_pass and not c_pass and len(both_failed) < 5:
                    both_failed.append(pair)

        with open(rep_path, "w", encoding="utf-8") as f:
            f.write("# 📋 ContextOS Phase 3 — Representative Case Report\n\n")
            
            sections = [
                ("🏆 5 Cases Where ContextOS Wins", ctx_wins),
                ("🎯 5 Cases Where Baseline RAG Wins", base_wins),
                ("✅ 5 Cases Where Both Agents Pass", both_correct),
                ("❌ 5 Cases Where Both Agents Fail", both_failed)
            ]

            for title, case_list in sections:
                f.write(f"## {title}\n\n")
                if not case_list:
                    f.write("_No cases matched this category in the current evaluation run._\n\n")
                    continue

                for i, item in enumerate(case_list, 1):
                    f.write(f"### Case {i}: Scenario `{item['scenario_id']}`\n")
                    f.write(f"- **Question:** {item['query']}\n")
                    f.write(f"- **Ground Truth Answer:** `{item['expected']}`\n")
                    f.write(f"- **Baseline Response:** {item['b']['answer']}\n")
                    f.write(f"- **ContextOS Response:** {item['c']['answer']}\n")
                    f.write(f"- **Baseline Result:** {'PASSED' if item['b']['is_action_correct'] else 'FAILED'}\n")
                    f.write(f"- **ContextOS Result:** {'PASSED' if item['c']['is_action_correct'] else 'FAILED'}\n\n")

        return str(report_path)
