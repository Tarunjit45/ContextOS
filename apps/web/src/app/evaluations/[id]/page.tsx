'use client';

import React from 'react';
import Link from 'next/link';

export default function ForensicEvaluationPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono text-slate-100 p-2">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-300">HOME</Link>
        <span>/</span>
        <Link href="/benchmarks" className="hover:text-slate-300">BENCHMARKS</Link>
        <span>/</span>
        <span className="text-white font-bold">#1247</span>
      </div>

      {/* Screen Title & Category Badge */}
      <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight">EVALUATION #1247</h1>
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
              TEMPORAL CONFLICT
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Diagnostic trace log explaining why Baseline RAG failed and why ContextOS Compact succeeded.
          </p>
        </div>

        <Link
          href="/benchmarks"
          className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:border-slate-700 transition-colors"
        >
          ← Back to Benchmarks
        </Link>
      </div>

      {/* 1. TASK */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-2 font-sans">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">1. TASK & QUERY</div>
        <div className="text-base font-bold text-white">
          "Should we follow up with Initech regarding Project #1001?"
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Ground Truth Answer: <span className="text-emerald-400 font-bold">"Yes, legal audit cleared for Initech Project #1001 on 2026-01-14 and outreach is authorized."</span>
        </div>
      </div>

      {/* 2. BASELINE RAG vs CONTEXTOS DECISION COMPARISON */}
      <div className="space-y-2">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">2. BASELINE RAG vs CONTEXTOS DECISION COMPARISON</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BASELINE RAG */}
          <div className="p-6 rounded-xl bg-[#0d0f17] border border-red-900/50 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">BASELINE RAG AGENT</span>
              <span className="text-xs font-bold text-red-400 uppercase font-mono">❌ FAILED</span>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase">Decision</div>
              <div className="text-lg font-bold text-red-400">PROHIBITED (HOLD ACTIVE)</div>
              <div className="text-xs text-slate-400 font-sans mt-1">
                Model response: <em className="text-slate-300">"No, outreach is currently prohibited due to active legal audit hold."</em>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between">
              <span>Input Tokens: <strong className="text-slate-200">248 tokens</strong></span>
              <span>Latency: <strong className="text-slate-200">4,330 ms</strong></span>
            </div>
          </div>

          {/* CONTEXTOS COMPACT */}
          <div className="p-6 rounded-xl bg-[#0d0f17] border border-emerald-500/50 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">CONTEXTOS COMPACT AGENT</span>
              <span className="text-xs font-bold text-emerald-400 uppercase font-mono">✓ PASSED</span>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase">Decision</div>
              <div className="text-lg font-bold text-emerald-400">AUTHORIZED (CLEARANCE VALID)</div>
              <div className="text-xs text-slate-400 font-sans mt-1">
                Model response: <em className="text-slate-300">"Yes, outreach to Initech regarding Project #1001 is authorized as legal audit cleared on 2026-01-14."</em>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between">
              <span>Input Tokens: <strong className="text-emerald-300">420 tokens</strong></span>
              <span>Latency: <strong className="text-slate-200">5,965 ms</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONTEXT TRACE & TIMELINE */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-5">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">3. CONTEXT TRACE & TIMELINE TRANSITION</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          {/* Timeline Trace */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 font-mono uppercase">Reconstructed State Timeline</div>
            <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-slate-500">2026-01-10 ─</span>
                <span className="text-red-400">Hold Notice Active</span>
                <span className="text-[10px] text-slate-500">(NOTE)</span>
              </div>
              <div className="border-l-2 border-indigo-500/50 ml-8 pl-4 py-1 text-indigo-400 text-[11px]">
                State Transition: prohibited → allowed
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500">2026-01-14 ─</span>
                <span className="text-emerald-400 font-bold">Legal Clearance Active</span>
                <span className="text-[10px] text-slate-500">(SLACK)</span>
              </div>
            </div>
          </div>

          {/* Root Cause Diagnosis */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 font-mono uppercase">4. ROOT CAUSE DIAGNOSIS</div>
            <div className="p-4 rounded bg-slate-950 border border-amber-900/40 space-y-2">
              <div className="font-bold text-amber-400 font-mono">STAGE 3: TEMPORAL RETRIEVAL FAILURE</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                The Baseline RAG agent selected the earlier 2026-01-10 hold notice note due to high lexical BM25 similarity with "legal hold". Baseline RAG lacked temporal state resolution and failed to recognize that the 2026-01-14 Slack update superseded the earlier hold notice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. RELEVANT EVIDENCE & PROVENANCE */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">5. RELEVANT EVIDENCE & PROVENANCE TRACE</div>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 rounded bg-slate-950 border border-emerald-500/30 text-slate-200 flex justify-between items-start">
            <div>
              <div className="font-bold text-emerald-400">[SLACK 2026-01-14 | ID: m_2]</div>
              <div className="text-slate-300 mt-1 font-sans">"UPDATE: Legal audit cleared for Initech Project #1001. You are authorized to resume outreach."</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">WINNING EVIDENCE</span>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 text-slate-400 flex justify-between items-start">
            <div>
              <div className="font-bold text-slate-400">[NOTE 2026-01-10 | ID: m_1]</div>
              <div className="text-slate-400 mt-1 font-sans">"Hold notice: do not contact Initech regarding Project #1001 due to legal audit."</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">SUPERSEDED EVIDENCE</span>
          </div>
        </div>
      </div>

      {/* 6. CONTEXT GRAPH TRAVERSAL */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-3 font-mono text-xs">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">6. CONTEXT GRAPH TRAVERSAL PATH</div>
        <div className="p-4 rounded bg-slate-950 border border-slate-800 text-indigo-300 font-mono">
          Person (p_1: John Smith) ──[OWNS]──&gt; Project (proj_1001: Project #1001) ──[HAS_COMM]──&gt; Slack (m_2: Legal Clearance)
        </div>
      </div>
    </div>
  );
}
