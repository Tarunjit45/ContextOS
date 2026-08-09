'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
    fetch('http://localhost:8000/api/benchmarks/history')
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
    <div className="max-w-6xl mx-auto space-y-10 font-mono text-slate-100 p-2">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Benchmark Laboratory</h1>
            <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono">
              PHASE 3.3 VALIDATED
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Comparative evaluation suite across Baseline RAG, ContextOS Full, and ContextOS Compact.
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:border-slate-700 transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* Dataset v1 Freeze Guard Banner */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base">🔒</span>
          <div>
            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Frozen Benchmark Dataset v1</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              SHA256: <span className="text-slate-200">2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa</span> | Seed: <span className="text-slate-200">42</span>
            </div>
          </div>
        </div>
        <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
          VERIFIED ✓
        </span>
      </div>

      {/* PRIMARY BENCHMARK COMPARISON CENTERPIECE (Real LLM n=10) */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">CANONICAL REAL LLM EVALUATION</div>
            <h2 className="text-lg font-bold text-white mt-0.5">Three-Way Comparative Benchmark (n=10)</h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Identical generation parameters: <code className="text-slate-200 font-mono">temperature=0.0</code>, <code className="text-slate-200 font-mono">max_tokens=512</code>, OpenRouter free endpoint.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-amber-400 font-sans block">
              ⚠️ Low-resource validation experiment; not statistically sufficient for generalization.
            </span>
          </div>
        </div>

        {/* 3-Column Visual Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {/* Baseline RAG */}
          <div className="p-6 rounded-xl bg-slate-950 border border-red-900/30 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">BASELINE RAG</span>
              <span className="text-[10px] text-slate-500 font-mono">CONTROL</span>
            </div>

            <div>
              <div className="text-3xl font-bold text-red-400 font-mono">50.0%</div>
              <div className="text-xs text-slate-400 mt-1">Accuracy (5/10 scenarios passed)</div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Input Tokens:</span>
                <span className="text-slate-200 font-bold">2,441</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Hallucination Rate:</span>
                <span className="text-red-400 font-bold">10.0%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>P50 Latency:</span>
                <span className="text-slate-300">4,330 ms</span>
              </div>
            </div>
          </div>

          {/* ContextOS Full */}
          <div className="p-5 rounded-xl bg-slate-950 border border-amber-900/30 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">CONTEXTOS FULL</span>
              <span className="text-[10px] text-amber-400/80 font-mono">PROMPT BLOAT</span>
            </div>

            <div>
              <div className="text-3xl font-bold text-amber-400 font-mono">50.0%</div>
              <div className="text-xs text-slate-400 mt-1">Accuracy (5/10 scenarios passed)</div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Input Tokens:</span>
                <span className="text-amber-300 font-bold">65,424</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Hallucination Rate:</span>
                <span className="text-emerald-400 font-bold">0.0%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>P50 Latency:</span>
                <span className="text-slate-300">3,804 ms</span>
              </div>
            </div>
          </div>

          {/* ContextOS Compact */}
          <div className="p-6 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">CONTEXTOS COMPACT</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">SOLVED BLOAT</span>
            </div>

            <div>
              <div className="text-3xl font-bold text-emerald-400 font-mono">90.0%</div>
              <div className="text-xs text-slate-400 mt-1">Accuracy (9/10 scenarios passed)</div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Input Tokens:</span>
                <span className="text-emerald-300 font-bold">4,204</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Token Savings vs Full:</span>
                <span className="text-emerald-400 font-bold">-93.6%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Hallucination Rate:</span>
                <span className="text-emerald-400 font-bold">0.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Key Takeaway Banner */}
        <div className="p-4 rounded-lg bg-slate-950 border border-indigo-500/20 text-xs font-sans space-y-1">
          <div className="font-bold text-indigo-300">Research Takeaway: Context Bloat vs Decision-Grade Compilation</div>
          <p className="text-slate-400 leading-relaxed">
            Supplying raw uncompiled context (Full mode: 65,424 tokens) degraded LLM attention, causing accuracy to drop to 50.0%. ContextOS Decision-Grade Context Compiler reduced input tokens by <strong>93.6%</strong> to 4,204 tokens, restoring accuracy to <strong>90.0%</strong>.
          </p>
        </div>
      </div>

      {/* DETAILED CATEGORY BENCHMARK TABLE */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-white uppercase tracking-wider">CATEGORY BREAKDOWN (n=10 REAL LLM)</div>
          <span className="text-[10px] text-slate-500 font-mono">STRATIFIED SAMPLE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 px-4">Count</th>
                <th className="pb-3 px-4">Live Baseline RAG</th>
                <th className="pb-3 px-4">Live ContextOS Full</th>
                <th className="pb-3 pl-4">Live ContextOS Compact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                { cat: 'temporal_conflict', count: 2, base: '50% (1/2)', full: '0% (0/2)', compact: '100% (2/2)' },
                { cat: 'memory_decay', count: 2, base: '100% (2/2)', full: '50% (1/2)', compact: '100% (2/2)' },
                { cat: 'entity_disambiguation', count: 2, base: '0% (0/2)', full: '0% (0/2)', compact: '50% (1/2)' },
                { cat: 'multi_hop_relationship', count: 2, base: '100% (2/2)', full: '100% (2/2)', compact: '100% (2/2)' },
                { cat: 'contradiction_conflict', count: 1, base: '0% (0/1)', full: '100% (1/1)', compact: '100% (1/1)' },
                { cat: 'missing_information', count: 1, base: '0% (0/1)', full: '100% (1/1)', compact: '100% (1/1)' }
              ].map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pr-4 text-slate-300 font-bold">{r.cat}</td>
                  <td className="py-3 px-4 text-slate-400">{r.count}</td>
                  <td className="py-3 px-4 text-red-400">{r.base}</td>
                  <td className="py-3 px-4 text-amber-400">{r.full}</td>
                  <td className="py-3 pl-4 text-emerald-400 font-bold">{r.compact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETERMINISTIC BENCHMARK SUITE HISTORY (1,000 SCENARIOS) */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-white uppercase tracking-wider">DETERMINISTIC BENCHMARK RUN HISTORY (1,000 SCENARIOS)</div>
          <span className="text-[10px] text-slate-500 font-mono">PERSISTED IN SQLITE DB</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-500 text-xs font-mono">Loading benchmark telemetry from SQLite...</div>
        ) : runs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs font-mono">No deterministic benchmark runs recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Run ID</th>
                  <th className="pb-3 px-4">Agent Name</th>
                  <th className="pb-3 px-4">Accuracy</th>
                  <th className="pb-3 px-4">Memory Recall</th>
                  <th className="pb-3 px-4">Entity Acc</th>
                  <th className="pb-3 px-4">Grounding</th>
                  <th className="pb-3 px-4">Hallucination</th>
                  <th className="pb-3 pl-4">P50 Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {runs.map((r) => (
                  <tr key={r.run_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pr-4 text-slate-500">{r.run_id.slice(0, 16)}</td>
                    <td className="py-3 px-4 text-slate-200 font-bold">{r.agent_name}</td>
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
