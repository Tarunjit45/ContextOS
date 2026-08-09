'use client';

import React from 'react';
import Link from 'next/link';

export default function ArchitecturePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 font-mono text-slate-100 p-2">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Pipeline Architecture</h1>
            <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono">
              SPECIFICATION v3.3
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Technical pipeline comparison between Baseline RAG and ContextOS Decision-Grade Context Compiler.
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:border-slate-700 transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* ARCHITECTURE PIPELINE COMPARISON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* BASELINE RAG PIPELINE */}
        <div className="p-6 rounded-xl bg-[#0d0f17] border border-red-900/40 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">BASELINE RAG ARCHITECTURE</span>
            <span className="text-[10px] text-red-400 font-mono">UNCOMPILED CONTEXT</span>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-center font-bold text-white font-mono">
              USER QUERY
            </div>
            <div className="text-center text-slate-500 text-xs font-mono">↓</div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-slate-300">
              <div className="font-bold text-slate-200 font-mono">BM25 Lexical Retriever</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Top-3 documents matching text similarity</div>
            </div>
            <div className="text-center text-slate-500 text-xs font-mono">↓</div>

            <div className="p-3 rounded bg-slate-950 border border-red-900/30 text-slate-400">
              <div className="font-bold text-slate-300 font-mono">Raw Document Concat</div>
              <div className="text-[11px] text-red-400/80 mt-0.5">No entity resolution, no temporal state check</div>
            </div>
            <div className="text-center text-slate-500 text-xs font-mono">↓</div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-center font-bold text-red-400 font-mono">
              LLM GENERATION (50% ACC)
            </div>
          </div>
        </div>

        {/* CONTEXTOS COMPILER PIPELINE */}
        <div className="p-6 rounded-xl bg-[#0d0f17] border border-emerald-500/40 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">CONTEXTOS DECISION COMPILER</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">DECISION-GRADE</span>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-center font-bold text-white font-mono">
              USER QUERY
            </div>
            <div className="text-center text-indigo-400 text-xs font-mono">↓</div>

            <div className="p-3 rounded bg-slate-950 border border-indigo-500/30 text-slate-200">
              <div className="font-bold text-indigo-300 font-mono">Hybrid Multi-Signal Retriever</div>
              <div className="text-[11px] text-slate-400 mt-0.5">BM25 + N-gram + Entity Hits + Recency + Authority</div>
            </div>
            <div className="text-center text-indigo-400 text-xs font-mono">↓</div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <div className="font-bold text-slate-200 font-mono text-[11px]">Entity Resolver</div>
                <div className="text-[10px] text-slate-400">Suffix & Role scoring</div>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <div className="font-bold text-slate-200 font-mono text-[11px]">Temporal State</div>
                <div className="text-[10px] text-slate-400">Valid interval resolver</div>
              </div>
            </div>
            <div className="text-center text-indigo-400 text-xs font-mono">↓</div>

            <div className="p-3 rounded bg-slate-950 border border-emerald-500/30 text-slate-200">
              <div className="font-bold text-emerald-400 font-mono">Decision-Grade Context Compiler</div>
              <div className="text-[11px] text-slate-400 mt-0.5">[ENTITIES], [STATE], [PROVENANCE], [ANSWERABILITY]</div>
            </div>
            <div className="text-center text-emerald-400 text-xs font-mono">↓</div>

            <div className="p-3 rounded bg-slate-950 border border-emerald-500/40 text-center font-bold text-emerald-400 font-mono">
              LLM GENERATION (90% ACC | -93.6% TOKENS)
            </div>
          </div>
        </div>
      </div>

      {/* SUBSYSTEM DETAILED BREAKDOWN */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
        <div className="text-xs font-bold text-white uppercase tracking-wider">SUBSYSTEM ENGINEERING SPECIFICATIONS</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-indigo-400 font-mono">1. Hybrid Multi-Signal Retriever</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Combines lexical BM25, character n-gram cosine similarity, entity hits, exponential recency decay, and channel authority (<code className="text-slate-300 font-mono">CRM &gt; Note &gt; Email &gt; Slack</code>).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-indigo-400 font-mono">2. Candidate-Scored Entity Resolver</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Disambiguates individuals using attribute scores (<code className="text-slate-300 font-mono">email</code> 0.35, <code className="text-slate-300 font-mono">role</code> 0.20, <code className="text-slate-300 font-mono">suffix</code> 0.10). Flags <code className="text-slate-300 font-mono">is_ambiguous=True</code> if top candidate delta &lt; 0.15.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-indigo-400 font-mono">3. Temporal State Resolver</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Parses workspace communications into discrete state transition events. Reconstructs active attribute values as of query date and records superseded historical events.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-indigo-400 font-mono">4. Decision-Grade Context Compiler</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Enforces strict token budgets and formats context into structured sections with answerability classification (<code className="text-slate-300 font-mono">SUFFICIENT</code>, <code className="text-slate-300 font-mono">INSUFFICIENT</code>, <code className="text-slate-300 font-mono">AMBIGUOUS</code>, <code className="text-slate-300 font-mono">CONFLICTED</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
