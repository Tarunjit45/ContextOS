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

export default function OverviewPage() {
  const [activeTab, setActiveTab] = useState<'real' | 'deterministic'>('real');
  const [runs, setRuns] = useState<BenchmarkRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/benchmarks/history')
      .then((res) => res.json())
      .then((data) => {
        const rawRuns: BenchmarkRun[] = data.runs || [];
        const seen = new Set<string>();
        const grouped: BenchmarkRun[] = [];
        for (const r of rawRuns) {
          const key = `${r.agent_name}_${r.scenario_count}_${r.overall_accuracy}`;
          if (!seen.has(key)) {
            seen.add(key);
            grouped.push(r);
          }
        }
        setRuns(grouped);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 font-sans text-slate-100 p-2">
      {/* Header & Identity */}
      <div className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 font-mono">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h1 className="text-2xl font-bold text-white tracking-tight">ContextOS</h1>
            <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 uppercase">
              LOCAL EVALUATION LABORATORY
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Context engineering and evaluation system for agent memory, temporal reasoning, and context composition.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <Link
            href="/benchmarks"
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            BENCHMARKS LAB
          </Link>
          <Link
            href="/architecture"
            className="px-4 py-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            ARCHITECTURE
          </Link>
        </div>
      </div>

      {/* SYSTEM OBJECTIVES & RAG BOUNDARIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-3">
          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">EVALUATION OBJECTIVE</div>
          <h2 className="text-base font-bold text-white">Context Failure Diagnostics</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates whether autonomous AI agent context pipelines maintain temporal validity, disambiguate entity roles, enforce token budgets, and prevent ungrounded responses across evolving multi-source workspace data.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-3">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">RAG ARCHITECTURAL BOUNDARIES</div>
          <h2 className="text-base font-bold text-white">Lexical Similarity ≠ Context Validity</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Standard BM25/dense RAG selects documents by text similarity. In dynamic environments, RAG retrieves superseded hold notices over newer legal clearances, conflates similar entity names, and causes prompt bloat.
          </p>
        </div>
      </div>

      {/* PIPELINE STAGES */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-5 font-mono">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white uppercase tracking-wider">HOW IT WORKS — CONTEXT COMPILER PIPELINE</div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">8-STAGE PIPELINE</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          {[
            { step: '1', title: 'Sanitization', desc: 'Zero Leakage' },
            { step: '2', title: 'Hybrid Retrieval', desc: 'BM25 + Recency' },
            { step: '3', title: 'Entity Scoring', desc: 'Suffix & Role' },
            { step: '4', title: 'Temporal Resolver', desc: 'Valid Intervals' },
            { step: '5', title: 'Context Graph', desc: 'Multi-Hop Paths' },
            { step: '6', title: 'Conflict Resolution', desc: 'Authority Rules' },
            { step: '7', title: 'Context Compiler', desc: 'Budget Guard' },
            { step: '8', title: 'LLM Generation', desc: 'Compact Output' }
          ].map((s, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-1">
              <div className="text-[10px] font-bold text-indigo-400">0{s.step}</div>
              <div className="font-bold text-slate-200 text-[11px] font-sans">{s.title}</div>
              <div className="text-[9px] text-slate-500">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* REAL LLM BENCHMARK SNAPSHOT (n=10) */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <div className="flex items-center gap-2 font-mono">
              <h2 className="text-base font-bold text-white">Real LLM Validation Benchmark Snapshot</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                OpenRouter API (n=10)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Controlled evaluation comparing Baseline RAG, ContextOS Full, and ContextOS Compact under identical generation parameters.
            </p>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] text-amber-400 block">
              ⚠️ Low-resource validation; not statistically sufficient for generalization.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-5 rounded-lg bg-slate-950 border border-red-900/30 space-y-2">
            <div className="font-bold text-slate-400 uppercase tracking-wider">BASELINE RAG</div>
            <div className="text-2xl font-bold text-red-400">50.0% <span className="text-xs font-normal text-slate-500">(5/10)</span></div>
            <div className="text-slate-400">Input Tokens: <span className="text-slate-200 font-bold">2,441</span></div>
            <div className="text-red-400/80 text-[11px]">Hallucination Rate: 10.0%</div>
          </div>

          <div className="p-5 rounded-lg bg-slate-950 border border-amber-900/30 space-y-2">
            <div className="font-bold text-amber-400 uppercase tracking-wider">CONTEXTOS FULL</div>
            <div className="text-2xl font-bold text-amber-400">50.0% <span className="text-xs font-normal text-slate-500">(5/10)</span></div>
            <div className="text-slate-400">Input Tokens: <span className="text-amber-300 font-bold">65,424</span></div>
            <div className="text-amber-400/80 text-[11px]">Degraded due to Context Bloat</div>
          </div>

          <div className="p-5 rounded-lg bg-slate-950 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-emerald-400 uppercase tracking-wider">CONTEXTOS COMPACT</div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">DECISION-GRADE</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">90.0% <span className="text-xs font-normal text-slate-500">(9/10)</span></div>
            <div className="text-slate-400">Input Tokens: <span className="text-emerald-300 font-bold">4,204</span></div>
            <div className="text-emerald-400 font-bold text-[11px]">-93.6% Token Reduction vs Full</div>
          </div>
        </div>
      </div>

      {/* SECTION 5: CATEGORY BREAKDOWN TABLE */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
        <div className="flex justify-between items-center font-mono">
          <div className="text-xs font-bold text-white uppercase tracking-wider">5. CATEGORY BREAKDOWN (REAL LLM n=10)</div>
          <span className="text-[10px] text-slate-500">6 CATEGORIES</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 px-4">Sample Count</th>
                <th className="pb-3 px-4">Baseline RAG</th>
                <th className="pb-3 px-4">ContextOS Full</th>
                <th className="pb-3 pl-4">ContextOS Compact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                { cat: 'Temporal Conflict', count: 2, base: '50% (1/2)', full: '0% (0/2)', compact: '100% (2/2)' },
                { cat: 'Memory Decay', count: 2, base: '100% (2/2)', full: '50% (1/2)', compact: '100% (2/2)' },
                { cat: 'Entity Disambiguation', count: 2, base: '0% (0/2)', full: '0% (0/2)', compact: '50% (1/2)' },
                { cat: 'Multi-Hop Relationship', count: 2, base: '100% (2/2)', full: '100% (2/2)', compact: '100% (2/2)' },
                { cat: 'Contradiction / Conflict', count: 1, base: '0% (0/1)', full: '100% (1/1)', compact: '100% (1/1)' },
                { cat: 'Missing Information', count: 1, base: '0% (0/1)', full: '100% (1/1)', compact: '100% (1/1)' }
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

      {/* SECTION 6: FAILURE ANALYSIS & CTA */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">6. FAILURE ANALYSIS & DIAGNOSTICS</div>
          <Link
            href="/failures"
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider font-mono transition-colors"
          >
            [ INSPECT FAILURE CASES ]
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {[
            { title: 'Temporal Retrieval Failure', desc: 'Selected outdated Day 1 hold notices over Day 30 legal clearances.' },
            { title: 'Entity Resolution Failure', desc: 'Conflated John Smith (VP Sales) with John Smith Jr. (Sales Associate).' },
            { title: 'Context Composition Failure', desc: 'Raw context bloat (65k+ tokens) truncated or degraded key facts.' },
            { title: 'Memory Decay Failure', desc: 'Lost vault PIN notes introduced early (Day 1) and queried late (Day 60).' },
            { title: 'Channel Contradiction', desc: 'Selected informal email quotes over CRM finance authorizations.' },
            { title: 'Ungrounded Hallucination', desc: 'Invented non-existent acquisition terms when information was absent.' }
          ].map((f, i) => (
            <div key={i} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200">{f.title}</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 7: ARCHITECTURE SUMMARY */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4 font-mono text-xs">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-white uppercase tracking-wider">7. ARCHITECTURE SUMMARY</div>
          <Link
            href="/architecture"
            className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            [ VIEW ARCHITECTURE ]
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TRADITIONAL RAG */}
          <div className="p-4 rounded-lg bg-slate-950 border border-red-900/30 space-y-2 text-center">
            <div className="font-bold text-slate-400 uppercase">TRADITIONAL RAG</div>
            <div className="text-slate-300">Query</div>
            <div className="text-slate-600">↓</div>
            <div className="text-slate-300">BM25 Search</div>
            <div className="text-slate-600">↓</div>
            <div className="text-slate-300">Top-K Evidence</div>
            <div className="text-slate-600">↓</div>
            <div className="text-red-400 font-bold">LLM System Prompt</div>
          </div>

          {/* CONTEXTOS */}
          <div className="p-4 rounded-lg bg-slate-950 border border-emerald-500/30 space-y-2 text-center">
            <div className="font-bold text-emerald-400 uppercase">CONTEXTOS COMPILER</div>
            <div className="text-slate-300">Query</div>
            <div className="text-indigo-400">↓</div>
            <div className="text-slate-300">Hybrid Retrieval $\rightarrow$ Entity Resolution $\rightarrow$ Temporal State</div>
            <div className="text-indigo-400">↓</div>
            <div className="text-slate-300">Memory Ranking $\rightarrow$ Context Graph $\rightarrow$ Context Composition</div>
            <div className="text-indigo-400">↓</div>
            <div className="text-emerald-400 font-bold">LLM System Prompt (-93.6% Tokens)</div>
          </div>
        </div>
      </div>

      {/* SECTION 8: REPRODUCIBILITY */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4 font-mono text-xs">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-white uppercase tracking-wider">8. REPRODUCIBILITY & INTEGRITY</div>
          <div className="flex gap-2">
            <a
              href="https://github.com/Tarunjit45/ContextOS/blob/main/REPRODUCIBILITY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 font-bold text-xs uppercase"
            >
              [ REPRODUCTION GUIDE ]
            </a>
            <a
              href="https://github.com/Tarunjit45/ContextOS/blob/main/BENCHMARKS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase"
            >
              [ VIEW DATASET INTEGRITY ]
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <div className="text-slate-500 text-[10px] font-bold uppercase">Dataset File</div>
            <div className="text-slate-200 font-bold mt-1">Dataset v1</div>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <div className="text-slate-500 text-[10px] font-bold uppercase">SHA256 Hash</div>
            <code className="text-emerald-400 font-bold mt-1 text-[11px] block">2ba27191...12fa</code>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <div className="text-slate-500 text-[10px] font-bold uppercase">Random Seed</div>
            <div className="text-slate-200 font-bold mt-1">Seed: 42</div>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-emerald-500/30">
            <div className="text-slate-500 text-[10px] font-bold uppercase">Subsystem Unit Tests</div>
            <div className="text-emerald-400 font-bold mt-1">133 PASSING ✓</div>
          </div>
        </div>
      </div>

      {/* SECTION 9: EXPERIMENT HISTORY (TABBED) */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider">9. EXPERIMENT HISTORY</div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('real')}
              className={`px-3 py-1.5 rounded font-bold uppercase transition-colors ${
                activeTab === 'real'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              [ REAL LLM ]
            </button>
            <button
              onClick={() => setActiveTab('deterministic')}
              className={`px-3 py-1.5 rounded font-bold uppercase transition-colors ${
                activeTab === 'deterministic'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              [ DETERMINISTIC ]
            </button>
          </div>
        </div>

        {activeTab === 'real' ? (
          <div className="space-y-3 font-sans">
            <div className="text-slate-400 text-xs">
              Canonical Phase 3 real-LLM validation benchmark execution (<code className="text-slate-200 font-mono">n=10</code> scenarios via OpenRouter API).
            </div>
            <div className="grid grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded bg-slate-950 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Live Baseline RAG</div>
                <div className="text-red-400 font-bold text-lg mt-1">50.0% Accuracy</div>
                <div className="text-slate-400 text-[11px]">Tokens: 2,441</div>
              </div>
              <div className="p-4 rounded bg-slate-950 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Live ContextOS Full</div>
                <div className="text-amber-400 font-bold text-lg mt-1">50.0% Accuracy</div>
                <div className="text-slate-400 text-[11px]">Tokens: 65,424</div>
              </div>
              <div className="p-4 rounded bg-slate-950 border border-emerald-500/40">
                <div className="text-emerald-400 text-[10px] uppercase font-bold">Live ContextOS Compact</div>
                <div className="text-emerald-400 font-bold text-lg mt-1">90.0% Accuracy</div>
                <div className="text-slate-400 text-[11px]">Tokens: 4,204 (-93.6%)</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-slate-400 text-xs leading-relaxed">
              <strong>Note:</strong> Deterministic regression benchmark used for large-scale subsystem validation. These results are not equivalent to the real-LLM experiment.
            </div>

            {loading ? (
              <div className="py-4 text-center text-slate-500">Loading benchmark telemetry...</div>
            ) : runs.length === 0 ? (
              <div className="py-4 text-center text-slate-500">No data available</div>
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
        )}
      </div>
    </div>
  );
}
