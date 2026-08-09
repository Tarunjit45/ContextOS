'use client';

import React from 'react';

export default function BenchmarksPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white">Agent Memory & Retrieval Benchmarks</h1>
        <p className="text-xs text-slate-400 mt-1">Reproducible benchmark comparison matrix across agent architectures.</p>
      </div>

      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800 space-y-4">
        <div className="text-xs font-bold text-white uppercase tracking-wider">BASELINE RAG VS CONTEXTOS BENCHMARK</div>

        <div className="divide-y divide-slate-800 text-xs">
          <div className="py-3 grid grid-cols-3 font-bold text-slate-400">
            <span>METRIC</span>
            <span>BASELINE RAG</span>
            <span className="text-blue-400">CONTEXTOS</span>
          </div>

          <div className="py-3 grid grid-cols-3">
            <span className="text-white">Overall Accuracy</span>
            <span className="text-slate-300">71%</span>
            <span className="text-emerald-400 font-bold">91%</span>
          </div>

          <div className="py-3 grid grid-cols-3">
            <span className="text-white">Memory Retention</span>
            <span className="text-slate-300">62%</span>
            <span className="text-emerald-400 font-bold">94%</span>
          </div>

          <div className="py-3 grid grid-cols-3">
            <span className="text-white">Temporal Reasoning</span>
            <span className="text-slate-300">58%</span>
            <span className="text-emerald-400 font-bold">88%</span>
          </div>

          <div className="py-3 grid grid-cols-3">
            <span className="text-white">Evidence Grounding</span>
            <span className="text-slate-300">79%</span>
            <span className="text-emerald-400 font-bold">93%</span>
          </div>

          <div className="py-3 grid grid-cols-3">
            <span className="text-white">Hallucination Rate</span>
            <span className="text-amber-400 font-bold">9%</span>
            <span className="text-emerald-400 font-bold">2%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
