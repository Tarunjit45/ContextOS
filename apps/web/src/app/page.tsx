'use client';

import React from 'react';
import Link from 'next/link';

export default function OverviewPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 font-mono text-slate-100 p-2">
      {/* Header Identity */}
      <div className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h1 className="text-2xl font-bold text-white tracking-tight">ContextOS</h1>
            <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
              LOCAL-FIRST EVALUATION PLATFORM
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            The evaluation laboratory for agent memory, temporal reasoning, and operational context.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/benchmarks"
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            [ BENCHMARKS LAB ]
          </Link>
          <Link
            href="/architecture"
            className="px-4 py-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            [ ARCHITECTURE ]
          </Link>
        </div>
      </div>

      {/* Dataset v1 Freeze Guard Banner */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base">🔒</span>
          <div>
            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Frozen Dataset v1 Active</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              SHA256: <span className="text-slate-200">2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa</span> | Seed: <span className="text-slate-200">42</span>
            </div>
          </div>
        </div>
        <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
          VERIFIED ✓
        </span>
      </div>

      {/* WHAT & WHY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WHAT */}
        <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-3">
          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">EVALUATION OBJECTIVE</div>
          <h2 className="text-base font-bold text-white">Context Failure Diagnostics</h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Evaluates whether autonomous AI agent context pipelines maintain temporal validity, disambiguate entity roles, enforce token budgets, and prevent ungrounded responses across evolving multi-source workspace data.
          </p>
        </div>

        {/* WHY */}
        <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-3">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">RAG ARCHITECTURAL BOUNDARIES</div>
          <h2 className="text-base font-bold text-white">Lexical Similarity ≠ Context Validity</h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Standard BM25/dense RAG selects documents by text similarity. In dynamic environments, RAG retrieves superseded hold notices over newer legal clearances, conflates similar entity names, and causes prompt bloat.
          </p>
        </div>
      </div>

      {/* HOW: VISUAL CONTEXT PIPELINE */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white uppercase tracking-wider">HOW IT WORKS — CONTEXT COMPILER PIPELINE</div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">8-STAGE PIPELINE</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-[11px]">
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
            <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-between space-y-1 hover:border-indigo-500/50 transition-colors">
              <div className="text-[10px] font-bold text-indigo-400 font-mono">0{s.step}</div>
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
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Real LLM Validation Benchmark Snapshot</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                OpenRouter API (n=10)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Controlled evaluation comparing Baseline RAG, ContextOS Full, and ContextOS Compact under identical generation parameters.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-amber-400 font-sans block">
              ⚠️ Low-resource validation; not statistically sufficient for generalization.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          {/* Baseline RAG */}
          <div className="p-5 rounded-lg bg-slate-950 border border-red-900/30 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">BASELINE RAG</div>
            <div className="text-2xl font-bold text-red-400 font-mono">50.0% <span className="text-xs font-normal text-slate-500">(5/10)</span></div>
            <div className="text-xs text-slate-400">Total Input Tokens: <span className="font-mono text-slate-200">2,441 tokens</span></div>
            <div className="text-[11px] text-red-400/80">Hallucination Rate: 10.0%</div>
          </div>

          {/* ContextOS Full */}
          <div className="p-5 rounded-lg bg-slate-950 border border-amber-900/30 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">CONTEXTOS FULL</div>
            <div className="text-2xl font-bold text-amber-400 font-mono">50.0% <span className="text-xs font-normal text-slate-500">(5/10)</span></div>
            <div className="text-xs text-slate-400">Total Input Tokens: <span className="font-mono text-amber-300">65,424 tokens</span></div>
            <div className="text-[11px] text-amber-400/80">Degraded due to Context Bloat</div>
          </div>

          {/* ContextOS Compact */}
          <div className="p-5 rounded-lg bg-slate-950 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">CONTEXTOS COMPACT</div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">HIGHEST ACCURACY</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">90.0% <span className="text-xs font-normal text-slate-500">(9/10)</span></div>
            <div className="text-xs text-slate-400">Total Input Tokens: <span className="font-mono text-emerald-300">4,204 tokens</span></div>
            <div className="text-[11px] text-emerald-400 font-bold">-93.6% Token Reduction vs Full</div>
          </div>
        </div>
      </div>

      {/* FAILURE TAXONOMY GRID */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-white uppercase tracking-wider">CONTEXT FAILURE TAXONOMY</div>
          <span className="text-[10px] text-slate-500 font-mono">6 CORE DIAGNOSTIC CLASSES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
          {[
            { id: 'TEMPORAL', title: 'Temporal Retrieval Failure', desc: 'Selected outdated Day 1 hold notices over Day 30 legal clearances.' },
            { id: 'ENTITY', title: 'Entity Resolution Failure', desc: 'Conflated John Smith (VP Sales) with John Smith Jr. (Sales Associate).' },
            { id: 'COMPOSITION', title: 'Context Composition Failure', desc: 'Raw context bloat (65k+ tokens) truncated or distorted key facts.' },
            { id: 'MEMORY', title: 'Memory Decay Failure', desc: 'Lost vault PIN notes introduced early (Day 1) and queried late (Day 60).' },
            { id: 'CONTRADICTION', title: 'Channel Contradiction', desc: 'Selected informal email quotes over CRM finance authorizations.' },
            { id: 'HALLUCINATION', title: 'Ungrounded Hallucination', desc: 'Invented non-existent acquisition terms when information was absent.' }
          ].map((f, i) => (
            <div key={i} className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-[10px] font-bold text-indigo-400 font-mono">{f.id}</div>
              <div className="font-bold text-slate-200">{f.title}</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT DIAGNOSTIC TRACES */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-white uppercase tracking-wider">FORENSIC EVALUATION TRACES</div>
          <Link href="/evaluations/1247" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
            Inspect Evaluation #1247 →
          </Link>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          <Link href="/evaluations/1247" className="py-3 flex justify-between items-center hover:bg-slate-800/40 px-2 -mx-2 rounded transition-colors group">
            <div className="flex items-center gap-4">
              <span className="text-indigo-400 font-bold group-hover:underline">#1247</span>
              <span className="text-slate-200 font-sans">Should we contact Initech regarding Project #1001?</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 font-mono">temporal_conflict</span>
              <span className="text-emerald-400 font-bold font-mono">Compact: 100% ✓</span>
              <span className="text-red-400 font-bold font-mono">Baseline: 0% ✕</span>
            </div>
          </Link>

          <div className="py-3 flex justify-between items-center px-2">
            <div className="flex items-center gap-4">
              <span className="text-slate-500 font-bold">#1246</span>
              <span className="text-slate-300 font-sans">Which John Smith is in executive sales and what is his email?</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 font-mono">entity_disambiguation</span>
              <span className="text-emerald-400 font-bold font-mono">Compact: 100% ✓</span>
              <span className="text-red-400 font-bold font-mono">Baseline: 0% ✕</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
