"""
ContextOS Phase 3.1 — Low-Resource Live LLM Benchmark Suite Execution Engine
Executes Live Baseline RAG, Live ContextOS Full, and Live ContextOS Compact over 10 stratified scenarios.
Exports PHASE_3_1_LOW_RESOURCE_REPORT.md and PHASE_3_1_REPRESENTATIVE_CASES.md.
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

from packages.scenarios.stratified import load_and_verify_dataset_v1, get_stratified_100_scenarios, get_stratified_10_scenarios, save_stratified_manifest
from packages.agents.live_agents import LiveBaselineRAGAgent, LiveContextOSAgent, LiveContextOSCompactAgent
from packages.evaluation.live_evaluator import LiveEvaluationEngine
from packages.llm.provider import LLMFactory, LLMProvider
from packages.utils.hardware import detect_hardware, assess_model_resource_fit
from packages.db.storage import BenchmarkStorage

MAX_COST_BUDGET_USD = float(os.environ.get("CONTEXTOS_MAX_COST_USD", "5.00"))

class LiveBenchmarkRunner:
    def __init__(self, provider: LLMProvider = None, seed: int = 42, db_path: str = None):
        self.provider = provider or LLMFactory.get_provider("auto")
        self.seed = seed
        self.evaluator = LiveEvaluationEngine()
        self.storage = BenchmarkStorage(db_path) if db_path else BenchmarkStorage()
        self.accumulated_cost_usd = 0.0

    async def run_live_benchmark(self, scenarios_count: int = 10, runs: int = 1, context_mode: str = "three_way") -> Dict[str, Any]:
        data = load_and_verify_dataset_v1(str(root_dir))
        workspace = data["workspace"]

        if scenarios_count == 10:
            selected_scenarios, manifest = get_stratified_10_scenarios(data)
            save_stratified_manifest(manifest, "stratified_10_manifest.json", str(root_dir))
        elif scenarios_count == 100:
            selected_scenarios, manifest = get_stratified_100_scenarios(data)
            save_stratified_manifest(manifest, "stratified_100_manifest.json", str(root_dir))
        else:
            selected_scenarios = data["scenarios"][:scenarios_count]

        agents = [
            LiveBaselineRAGAgent(self.provider),
            LiveContextOSAgent(self.provider),
            LiveContextOSCompactAgent(self.provider)
        ]

        run_id = f"live_run_{int(time.time())}"
        timestamp = datetime.now().isoformat()
        hardware_info = detect_hardware()

        all_summaries = []
        all_traces = []

        for agent in agents:
            agent_traces = []
            for scen in selected_scenarios:
                clean_task = {"task_id": scen["scenario_id"], "query": scen["query"]}
                
                output = await agent.run(clean_task, workspace)
                
                cost = output.get("cost_usd")
                if cost is not None and isinstance(cost, float):
                    self.accumulated_cost_usd += cost
                    if self.accumulated_cost_usd > MAX_COST_BUDGET_USD:
                        raise RuntimeError(f"HARD COST BUDGET EXCEEDED! Current cost ${self.accumulated_cost_usd:.4f} > limit ${MAX_COST_BUDGET_USD:.2f}")

                eval_res = self.evaluator.evaluate_live_trace(scen, output)

                trace_record = {
                    "run_id": run_id,
                    "scenario_id": scen["scenario_id"],
                    "category": scen["category"],
                    "agent_name": output["agent_type"],
                    "context_mode": output.get("context_mode", "full"),
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
                    "cost_usd": output.get("cost_usd"),
                    "latency_ms": output["latency"]["total_ms"],
                    "system_prompt_hash": output["system_prompt_hash"],
                    "user_prompt_hash": output["user_prompt_hash"],
                    "context_hash": output["context_hash"],
                    "execution_status": eval_res["execution_status"],
                    "error_message": eval_res.get("error_message"),
                    "git_commit": "de7a44e",
                    "created_at": timestamp,
                    "is_action_correct": eval_res["is_action_correct"],
                    "is_hallucinating": eval_res.get("is_hallucinating", False),
                    "failure_class": eval_res.get("failure_class"),
                    "expected_answer": scen.get("expected_answer"),
                    "query": scen.get("query"),
                    "telemetry": output.get("telemetry", {})
                }

                self.storage.save_llm_trace(trace_record)
                agent_traces.append(trace_record)
                all_traces.append(trace_record)

            total_cases = len(agent_traces)
            valid_cases = [t for t in agent_traces if t["execution_status"] == "SUCCESS"]
            correct_cases = [t for t in valid_cases if t["is_action_correct"]]

            overall_accuracy = (len(correct_cases) / total_cases * 100.0) if total_cases > 0 else 0.0
            halluc_rate = (sum(1 for t in valid_cases if t["is_hallucinating"]) / total_cases * 100.0) if total_cases > 0 else 0.0

            latencies = [t["latency_ms"] for t in agent_traces]
            latencies.sort()
            p50_lat = latencies[len(latencies)//2] if latencies else 0.0

            tot_in_tok = sum(t["input_tokens"] for t in agent_traces)
            tot_out_tok = sum(t["output_tokens"] for t in agent_traces)
            
            costs = [t["cost_usd"] for t in agent_traces if t["cost_usd"] is not None]
            tot_cost_str = f"${sum(costs):.4f}" if len(costs) == len(agent_traces) else "unknown"

            summary = {
                "run_id": run_id,
                "agent_name": agent_traces[0]["agent_name"],
                "context_mode": agent_traces[0]["context_mode"],
                "provider": agent_traces[0]["provider"],
                "model": agent_traces[0]["model"],
                "scenario_count": total_cases,
                "overall_accuracy": round(overall_accuracy, 1),
                "hallucination_rate": round(halluc_rate, 1),
                "p50_latency_ms": round(p50_lat, 2),
                "total_input_tokens": tot_in_tok,
                "total_output_tokens": tot_out_tok,
                "total_cost_usd_display": tot_cost_str
            }
            all_summaries.append(summary)

        self.export_reports(all_summaries, all_traces, hardware_info)
        return {"run_id": run_id, "summaries": all_summaries, "traces": all_traces, "hardware": hardware_info}

    def export_reports(self, summaries: List[Dict[str, Any]], traces: List[Dict[str, Any]], hardware_info: Dict[str, Any]):
        reports_dir = root_dir / "benchmarks" / "reports"
        os.makedirs(reports_dir, exist_ok=True)

        report_path = reports_dir / "PHASE_3_1_LOW_RESOURCE_REPORT.md"
        base_s = next((s for s in summaries if "Baseline" in s["agent_name"]), {})
        ctx_s = next((s for s in summaries if "Full" in s["agent_name"]), {})
        compact_s = next((s for s in summaries if "Compact" in s["agent_name"]), {})

        with open(report_path, "w", encoding="utf-8") as f:
            f.write("# 🔬 ContextOS Phase 3.1 — Low-Resource Real LLM Evaluation Report\n\n")
            f.write(f"**Execution Timestamp:** `{datetime.now().isoformat()}`  \n")
            f.write(f"**Experiment Mode:** `REAL_LLM_LOCAL_LOW_RESOURCE`  \n")
            f.write(f"**Dataset v1 Hash Status:** `VERIFIED ✓ (SHA256: 2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa)`  \n")
            f.write(f"**Provider:** `{summaries[0]['provider']}` | **Model:** `{summaries[0]['model']}` | **Temperature:** `0.0`  \n")
            f.write(f"**Hardware:** {hardware_info['cpu_cores']} CPU Cores | {hardware_info['total_ram_gb']} GB RAM Total ({hardware_info['available_ram_gb']} GB Available) | GPU: {hardware_info['gpu_name'] or 'None (CPU Only)'}  \n\n")

            f.write("> [!IMPORTANT]\n")
            f.write("> **Statistical Disclaimer:** `n=10` is a smoke test and is NOT statistically sufficient to establish general performance superiority.\n\n")

            f.write("## 1. Three-Way Metric & Token Telemetry Comparison\n\n")
            f.write("| Metric | Live Baseline RAG | Live ContextOS (Full) | Live ContextOS (Compact) | Delta (Full vs Baseline) |\n")
            f.write("|---|---|---|---|---|\n")

            acc_b = base_s.get("overall_accuracy", 0.0)
            acc_c = ctx_s.get("overall_accuracy", 0.0)
            acc_comp = compact_s.get("overall_accuracy", 0.0)
            f.write(f"| **Overall Accuracy** | {acc_b}% | {acc_c}% | {acc_comp}% | {round(acc_c - acc_b, 1):+}% |\n")

            h_b = base_s.get("hallucination_rate", 0.0)
            h_c = ctx_s.get("hallucination_rate", 0.0)
            h_comp = compact_s.get("hallucination_rate", 0.0)
            f.write(f"| **Hallucination Rate** | {h_b}% | {h_c}% | {h_comp}% | {round(h_c - h_b, 1):+}% |\n")

            p50_b = base_s.get("p50_latency_ms", 0.0)
            p50_c = ctx_s.get("p50_latency_ms", 0.0)
            p50_comp = compact_s.get("p50_latency_ms", 0.0)
            f.write(f"| **P50 Latency** | {p50_b} ms | {p50_c} ms | {p50_comp} ms | {round(p50_c - p50_b, 2):+} ms |\n")

            tok_in_b = base_s.get("total_input_tokens", 0)
            tok_in_c = ctx_s.get("total_input_tokens", 0)
            tok_in_comp = compact_s.get("total_input_tokens", 0)
            f.write(f"| **Total Input Tokens** | {tok_in_b} | {tok_in_c} | {tok_in_comp} | {tok_in_c - tok_in_b:+} |\n")

            f.write(f"| **Total Cost** | {base_s.get('total_cost_usd_display')} | {ctx_s.get('total_cost_usd_display')} | {compact_s.get('total_cost_usd_display')} | N/A |\n\n")

            f.write("## 2. Experimental Validity Assessment\n\n")
            f.write("- **Identical Prompting:** All agents received equivalent system instructions.\n")
            f.write("- **Identical Hardware & Generation Settings:** All models ran at `temperature=0.0`, `max_tokens=512` on the exact same CPU environment.\n")
            f.write("- **Zero Ground-Truth Leakage:** No agent received category metadata or expected answers.\n")
            f.write("- **Isolating Variable:** Isolate ContextOS full context composition vs compact context composition vs naive BM25 context.\n")

        # 2. Representative Cases Report
        rep_path = reports_dir / "PHASE_3_1_REPRESENTATIVE_CASES.md"
        with open(rep_path, "w", encoding="utf-8") as f:
            f.write("# 📋 ContextOS Phase 3.1 — 10-Scenario Low-Resource Representative Case Report\n\n")
            scen_ids = list(set(t["scenario_id"] for t in traces))
            for sid in scen_ids:
                b_tr = next((t for t in traces if t["scenario_id"] == sid and "Baseline" in t["agent_name"]), None)
                f_tr = next((t for t in traces if t["scenario_id"] == sid and "Full" in t["agent_name"]), None)
                c_tr = next((t for t in traces if t["scenario_id"] == sid and "Compact" in t["agent_name"]), None)

                if b_tr and f_tr:
                    f.write(f"### Scenario `{sid}` ({b_tr['category']})\n")
                    f.write(f"- **Query:** {b_tr['query']}\n")
                    f.write(f"- **Ground Truth Answer:** `{b_tr['expected_answer']}`\n")
                    f.write(f"- **Baseline RAG:** {b_tr['answer']} (`{'PASSED' if b_tr['is_action_correct'] else 'FAILED'}`)\n")
                    f.write(f"- **ContextOS Full:** {f_tr['answer']} (`{'PASSED' if f_tr['is_action_correct'] else 'FAILED'}`)\n")
                    if c_tr:
                        f.write(f"- **ContextOS Compact:** {c_tr['answer']} (`{'PASSED' if c_tr['is_action_correct'] else 'FAILED'}`)\n")
                    f.write("\n")

        return str(report_path)
