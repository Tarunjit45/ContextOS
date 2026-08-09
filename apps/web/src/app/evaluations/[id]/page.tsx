'use client';

import React from 'react';
import Link from 'next/link';

export default function SignatureEvaluationPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 font-mono">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-300">EVALUATIONS</Link>
        <span>/</span>
        <span className="text-white font-bold">#1247</span>
      </div>

      {/* Screen Title */}
      <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white tracking-tight">EVALUATION #1247</h1>
        <span className="text-xs text-slate-500">Diagnostic Trace Log</span>
      </div>

      {/* TASK SECTION */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-2">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">TASK</div>
        <div className="text-base font-bold text-white">"Should we follow up with Acme?"</div>
      </div>

      {/* AGENT COMPARISON GRID */}
      <div className="grid grid-cols-2 gap-6">
        {/* BASELINE RAG */}
        <div className="p-6 rounded-xl bg-[#0d0f17] border border-red-900/40 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">BASELINE RAG</div>
          <div>
            <div className="text-xs text-slate-500 uppercase">Decision</div>
            <div className="text-lg font-bold text-white">CONTACT</div>
            <div className="text-xs text-red-400 font-bold mt-1">❌ Incorrect</div>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-500">Score: </span>
            <span className="text-sm font-bold text-slate-300">71%</span>
          </div>
        </div>

        {/* CONTEXTOS AGENT */}
        <div className="p-6 rounded-xl bg-[#0d0f17] border border-emerald-900/40 space-y-4">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">CONTEXTOS</div>
          <div>
            <div className="text-xs text-slate-500 uppercase">Decision</div>
            <div className="text-lg font-bold text-white">WAIT</div>
            <div className="text-xs text-emerald-400 font-bold mt-1">✓ Correct</div>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-500">Score: </span>
            <span className="text-sm font-bold text-emerald-400">94%</span>
          </div>
        </div>
      </div>

      {/* CONTEXT TRACE */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-6">
        <div className="text-xs font-bold text-white uppercase tracking-wider">CONTEXT TRACE</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Retrieved Items */}
          <div className="space-y-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Retrieved Evidence</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span>✓</span>
                <span className="text-slate-200">Acme CRM record</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span>✓</span>
                <span className="text-slate-200">March meeting</span>
              </div>
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <span>✗</span>
                <span className="text-slate-400">January instruction</span>
              </div>
            </div>
          </div>

          {/* Timeline Trace */}
          <div className="space-y-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Timeline Trace</div>
            <div className="space-y-2 text-slate-300 font-mono">
              <div><span className="text-slate-500">Jan 12 ─</span> Don't contact</div>
              <div><span className="text-slate-500">Feb 18 ─</span> Budget approved</div>
              <div><span className="text-slate-500">Mar 04 ─</span> Contact permitted</div>
            </div>
          </div>
        </div>
      </div>

      {/* ROOT CAUSE DIAGNOSIS */}
      <div className="p-6 rounded-xl bg-[#0d0f17] border border-amber-900/40 space-y-3">
        <div className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">ROOT CAUSE</div>
        <div className="text-sm font-bold text-amber-400">TEMPORAL RETRIEVAL FAILURE</div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The baseline agent retrieved the latest semantic match but failed to reconstruct the temporal state of the account.
        </p>
      </div>

      {/* QUICK ACTION BUTTONS */}
      <div className="flex items-center gap-4 pt-2">
        <Link 
          href="/graph" 
          className="px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
        >
          [ VIEW CONTEXT GRAPH ]
        </Link>
        <Link 
          href="/replay" 
          className="px-5 py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors"
        >
          [ REPLAY TIMELINE ]
        </Link>
      </div>
    </div>
  );
}
