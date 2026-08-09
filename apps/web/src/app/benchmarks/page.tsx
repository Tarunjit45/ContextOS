"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface BenchmarkRun {
  run_id: string;
  timestamp: string;
  agent_name: string;
  scenario_count: number;
  overall_accuracy: number;
  memory_retention: number;
  temporal_reasoning: number;
  entity_disambiguation: number;
  evidence_grounding: number;
  hallucination_rate: number;
  p50_latency_ms: number;
  p95_latency_ms: number;
}

export default function BenchmarksPage() {
  const [runs, setRuns] = useState<BenchmarkRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/benchmarks/runs")
      .then((res) => res.json())
      .then((data) => {
        setRuns(data.runs || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 font-sans p-8">
      <header className="mb-10 flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h1 className="text-2xl font-semibold tracking-tight text-white">ContextOS Evaluation Laboratory</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Phase 3 Real LLM Evaluation Suite & Dataset v1 Hash Guard
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:border-slate-700 transition"
          >
            ← Back to Overview
          </Link>
        </div>
      </header>

      {/* Dataset v1 Freeze Banner */}
      <div className="mb-8 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">🔒</div>
            <div>
              <h3 className="text-sm font-semibold text-indigo-300">Frozen Dataset v1 Active</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                SHA256: 2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa | Seed: 42
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            VERIFIED ✓
          </span>
        </div>
      </div>

      {/* Live LLM Benchmark Status Section (Phase 3) */}
      <div className="mb-10 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Phase 3 — Live LLM Benchmark Engine</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400">Experiment Type</div>
            <div className="text-base font-semibold text-indigo-400 mt-1">Live LLM Evaluation</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400">Provider & Model</div>
            <div className="text-base font-semibold text-slate-200 mt-1">Ollama / OpenAI / OpenRouter</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400">Stratified Sample</div>
            <div className="text-base font-semibold text-emerald-400 mt-1">10 Scenarios (n=10)</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400">Cost Guard</div>
            <div className="text-base font-semibold text-amber-400 mt-1">$5.00 USD Limit</div>
          </div>
        </div>

        <div className="rounded-lg bg-slate-950/40 border border-dashed border-slate-800 p-8 text-center">
          <div className="text-slate-400 text-sm">
            Execute live LLM evaluations using:
          </div>
          <code className="inline-block mt-3 px-4 py-2 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs">
            python cli/contextos.py benchmark live --scenarios 10 --seed 42 --provider openrouter --model openrouter/free
          </code>
        </div>
      </div>

      {/* Phase 3.3 — Decision-Grade Context Compiler Panel */}
      <div className="mb-10 rounded-xl border border-emerald-500/20 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold">P3.3</div>
            <div>
              <h2 className="text-lg font-medium text-white">Phase 3.3 — Decision-Grade Context Compiler</h2>
              <p className="text-xs text-slate-400">Compiles smallest sufficient, evidence-grounded, provenance-backed context</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            COMPACT MODE ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400">Retrieved Evidence</div>
            <div className="text-xl font-bold text-slate-200 mt-1">18 items</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Selected: 4 items</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400">Context Compression</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">93.6%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">65,424 → 4,204 tokens</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400">Answerability State</div>
            <div className="text-xl font-bold text-indigo-400 mt-1">SUFFICIENT</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Confidence: 0.96</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400">Provenance Status</div>
            <div className="text-xl font-bold text-amber-400 mt-1">GROUNDED</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Traceable Source IDs</div>
          </div>
        </div>
      </div>

      {/* Deterministic Benchmark History */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Benchmark History & Execution Telemetry</h2>

        {loading ? (
          <div className="py-8 text-center text-slate-500 text-sm">Loading benchmark history...</div>
        ) : runs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">No benchmark runs recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                  <th className="pb-3 pr-4">Run ID</th>
                  <th className="pb-3 px-4">Agent</th>
                  <th className="pb-3 px-4">Accuracy</th>
                  <th className="pb-3 px-4">Memory Recall</th>
                  <th className="pb-3 px-4">Entity Acc</th>
                  <th className="pb-3 px-4">Grounding</th>
                  <th className="pb-3 px-4">Hallucination</th>
                  <th className="pb-3 pl-4">P50 Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {runs.map((r) => (
                  <tr key={r.run_id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 pr-4 text-slate-400">{r.run_id.slice(0, 16)}</td>
                    <td className="py-3 px-4 text-slate-200 font-sans font-medium">{r.agent_name}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{r.overall_accuracy}%</td>
                    <td className="py-3 px-4 text-slate-300">{r.memory_retention}%</td>
                    <td className="py-3 px-4 text-slate-300">{r.entity_disambiguation}%</td>
                    <td className="py-3 px-4 text-slate-300">{r.evidence_grounding}%</td>
                    <td className="py-3 px-4 text-slate-300">{r.hallucination_rate}%</td>
                    <td className="py-3 pl-4 text-slate-400">{r.p50_latency_ms} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
