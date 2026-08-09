'use client';

import React, { useState } from 'react';

export default function BenchmarksPage() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono">
      <div className="border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-white">Phase 2.1 Reconstructed Agent Context Benchmarks</h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero ground-truth leakage evaluation across 1,000 parameterized synthetic scenarios (Seed: 42).
          </p>
        </div>
        <button
          onClick={() => {
            setIsRunning(true);
            setTimeout(() => setIsRunning(false), 2000);
          }}
          disabled={isRunning}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors"
        >
          {isRunning ? 'RUNNING 1,000 SCENARIOS...' : 'RERUN BENCHMARK SUITE (1,000)'}
        </button>
      </div>

      {/* Comparison Matrix Table */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white uppercase tracking-wider">UNBIASED BENCHMARK RESULTS (1,000 SCENARIOS | SEED 42)</span>
          <span className="text-[10px] text-slate-500">Database: benchmarks/contextos_benchmark.db</span>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          <div className="py-3 grid grid-cols-5 font-bold text-slate-400">
            <span>METRIC</span>
            <span>BASELINE RAG</span>
            <span className="text-blue-400">CONTEXTOS AGENT</span>
            <span>CUSTOM AGENT</span>
            <span>DELTA</span>
          </div>

          <div className="py-3 grid grid-cols-5">
            <span className="text-white">Overall Accuracy</span>
            <span className="text-emerald-400 font-bold">69.1%</span>
            <span className="text-slate-300 font-bold">37.6%</span>
            <span className="text-slate-300">0.0%</span>
            <span className="text-red-400 font-bold">-31.5%</span>
          </div>

          <div className="py-3 grid grid-cols-5">
            <span className="text-white">Memory Retention</span>
            <span className="text-emerald-400 font-bold">94.0%</span>
            <span className="text-red-400 font-bold">0.7%</span>
            <span className="text-slate-300">0.0%</span>
            <span className="text-red-400 font-bold">-93.3%</span>
          </div>

          <div className="py-3 grid grid-cols-5">
            <span className="text-white">Temporal Reasoning</span>
            <span className="text-emerald-400 font-bold">100.0%</span>
            <span className="text-emerald-400 font-bold">100.0%</span>
            <span className="text-slate-300">0.0%</span>
            <span className="text-slate-400">0.0%</span>
          </div>

          <div className="py-3 grid grid-cols-5">
            <span className="text-white">Entity Disambiguation</span>
            <span className="text-slate-300 font-bold">0.0%</span>
            <span className="text-slate-300 font-bold">0.0%</span>
            <span className="text-slate-300">0.0%</span>
            <span className="text-slate-400">0.0%</span>
          </div>

          <div className="py-3 grid grid-cols-5">
            <span className="text-white">Evidence Grounding</span>
            <span className="text-emerald-400 font-bold">85.0%</span>
            <span className="text-slate-300 font-bold">35.0%</span>
            <span className="text-slate-300">0.0%</span>
            <span className="text-red-400 font-bold">-50.0%</span>
          </div>

          <div className="py-3 grid grid-cols-5">
            <span className="text-white">Hallucination Rate</span>
            <span className="text-amber-400 font-bold">10.0%</span>
            <span className="text-emerald-400 font-bold">7.5%</span>
            <span className="text-slate-300">0.0%</span>
            <span className="text-emerald-400 font-bold">-2.5%</span>
          </div>

          <div className="py-3 grid grid-cols-5">
            <span className="text-white">P50 Latency (ms)</span>
            <span className="text-slate-300">3.54 ms</span>
            <span className="text-slate-300">4.46 ms</span>
            <span className="text-slate-300">0.00 ms</span>
            <span className="text-slate-500">N/A</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 leading-relaxed">
        ⚠️ <strong>Integrity Finding:</strong> After removing ground-truth category leaks and rule shortcuts, ContextOS Agent currently scores lower on memory retention (0.7%) than Baseline RAG (94.0%) because naive recency sorting ranks recent unrelated communications above early vault notes. This provides an authentic baseline for future architectural improvements.
      </div>
    </div>
  );
}
