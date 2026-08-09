'use client';

import React, { useState } from 'react';

export default function FailuresPage() {
  const [selectedFailure, setSelectedFailure] = useState<number>(982);

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white">Failure Taxonomy Explorer</h1>
        <p className="text-xs text-slate-400 mt-1">Root-cause classification and diagnostic debugging for failed evaluations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {[
            { id: 982, type: 'TEMPORAL RETRIEVAL FAILURE', task: 'Should we contact Globex?', count: 41 },
            { id: 981, type: 'RETRIEVAL RANKING FAILURE', task: 'Who owns deal #104?', count: 27 },
            { id: 980, type: 'CONTEXT COMPOSITION FAILURE', task: 'Connect meeting & CRM record', count: 19 },
            { id: 979, type: 'TOOL / ACTION FAILURE', task: 'Schedule follow-up tool call', count: 14 }
          ].map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedFailure(item.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedFailure === item.id 
                  ? 'bg-red-950/20 border-red-500/50' 
                  : 'bg-[#0d0f17] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-red-400">FAILURE #{item.id}</span>
                <span className="text-[10px] text-slate-500">{item.count} occurrences</span>
              </div>
              <div className="text-xs font-bold text-white">{item.type}</div>
              <div className="text-[11px] text-slate-400 mt-1">{item.task}</div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-7 p-6 rounded-xl bg-[#0d0f17] border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <div className="text-[10px] text-red-400 uppercase tracking-widest font-bold">FAILURE DIAGNOSTIC #{selectedFailure}</div>
            <div className="text-base font-bold text-white mt-1">
              {selectedFailure === 982 ? 'TEMPORAL RETRIEVAL FAILURE' : selectedFailure === 980 ? 'CONTEXT COMPOSITION FAILURE' : 'TOOL / ACTION FAILURE'}
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Task Query</span>
              <span className="text-white font-medium">"Should we follow up with Acme today?"</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Expected Action</span>
                <span className="text-emerald-300 font-bold">WAIT / PERMIT_CONTACT</span>
              </div>
              <div className="p-3 bg-red-950/20 border border-red-800/40 rounded">
                <span className="text-[10px] text-red-400 uppercase font-bold block">Baseline Output</span>
                <span className="text-red-300 font-bold">CONTACT / PREVENT_WAIT</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Missing Evidence</span>
              <span className="text-amber-300 font-mono">January instruction vs March meeting state</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Root Cause Analysis</span>
              <span className="text-slate-300">
                The baseline agent retrieved the latest semantic match but failed to reconstruct the temporal state of the account.
              </span>
            </div>

            <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded text-blue-300">
              <span className="text-[10px] text-blue-400 uppercase font-bold block">Suggested Fix</span>
              Enable recency-weighted temporal graph retrieval in ContextComposer.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
