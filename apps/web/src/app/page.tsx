'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OverviewPage() {
  const [hasEvaluations, setHasEvaluations] = useState(true);

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono">
      {/* Header Title */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Agent Memory Evaluation</h1>
        <p className="text-xs text-slate-400 mt-1">Local evaluation laboratory for agent memory & context retention.</p>
      </div>

      {!hasEvaluations ? (
        <div className="p-8 rounded-xl bg-[#0d0f17] border border-slate-800 text-center space-y-4">
          <div className="text-slate-500 font-mono text-sm">No evaluations yet</div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Run the benchmark suite across synthetic scenarios to populate evaluation metrics and failure distributions.
          </p>
          <button 
            onClick={() => setHasEvaluations(true)}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Load Benchmark Evaluation Demo Data
          </button>
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-[#0d0f17] border border-slate-800/80">
              <div className="text-2xl font-bold text-white">1,248</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">RUNS</div>
            </div>

            <div className="p-5 rounded-xl bg-[#0d0f17] border border-slate-800/80">
              <div className="text-2xl font-bold text-emerald-400">91.7%</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">ACCURACY</div>
            </div>

            <div className="p-5 rounded-xl bg-[#0d0f17] border border-slate-800/80">
              <div className="text-2xl font-bold text-amber-400">3.1%</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">HALLUC.</div>
            </div>
          </div>

          {/* Failure Distribution */}
          <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
            <div className="text-xs font-bold text-white uppercase tracking-wider">FAILURE DISTRIBUTION</div>
            
            <div className="space-y-3 pt-1 text-xs">
              {[
                { name: 'Retrieval', count: 12, bar: '████████████' },
                { name: 'Temporal', count: 7, bar: '███████' },
                { name: 'Composition', count: 5, bar: '█████' },
                { name: 'Entity', count: 4, bar: '████' }
              ].map((item, i) => (
                <div key={i} className="grid grid-cols-12 items-center">
                  <span className="col-span-3 text-slate-400">{item.name}</span>
                  <span className="col-span-7 font-mono text-blue-500">{item.bar}</span>
                  <span className="col-span-2 text-right font-bold text-slate-300">{item.count}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Evaluations */}
          <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white uppercase tracking-wider">RECENT EVALUATIONS</span>
              <span className="text-[10px] text-slate-500">Click #1247 for detailed diagnosis</span>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              <div className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-bold">#1248</span>
                  <span className="text-white">Context Agent</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 font-bold">94%</span>
                  <span className="text-emerald-400 font-bold">✓</span>
                </div>
              </div>

              <Link href="/evaluations/1247" className="py-3 flex justify-between items-center hover:bg-slate-800/30 px-2 -mx-2 rounded transition-colors group">
                <div className="flex items-center gap-4">
                  <span className="text-blue-400 font-bold group-hover:underline">#1247</span>
                  <span className="text-white">Baseline RAG</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 font-bold">71%</span>
                  <span className="text-red-400 font-bold">✕</span>
                </div>
              </Link>

              <div className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-bold">#1246</span>
                  <span className="text-white">Context Agent</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 font-bold">91%</span>
                  <span className="text-emerald-400 font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
