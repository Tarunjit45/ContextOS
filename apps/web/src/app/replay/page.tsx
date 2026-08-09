'use client';

import React, { useState } from 'react';

export default function ReplayPage() {
  const [replayDay, setReplayDay] = useState<number>(30);

  const getReplayMetrics = (day: number) => {
    if (day <= 7) return { entities: 17, relationships: 12, memories: 42 };
    if (day <= 30) return { entities: 91, relationships: 143, memories: 312 };
    return { entities: 248, relationships: 1204, memories: 2481 };
  };

  const currentReplay = getReplayMetrics(replayDay);

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono">
      <div className="border-b border-slate-800 pb-4">
        <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase tracking-widest inline-block mb-2">
          Signature Feature
        </span>
        <h1 className="text-xl font-bold text-white">Context Replay Timeline</h1>
        <p className="text-xs text-slate-400 mt-1">Replay an organization over time and evaluate agent decisions as available context evolves.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-[#0d0f17] border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Active Entities</div>
          <div className="text-3xl font-bold text-blue-400 mt-1">{currentReplay.entities}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0d0f17] border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Active Relationships</div>
          <div className="text-3xl font-bold text-purple-400 mt-1">{currentReplay.relationships}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0d0f17] border border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Retained Memories</div>
          <div className="text-3xl font-bold text-emerald-400 mt-1">{currentReplay.memories}</div>
        </div>
      </div>

      <div className="p-8 rounded-xl bg-[#0d0f17] border border-slate-800 space-y-6">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-bold">Timeline Cursor Position</span>
          <span className="text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20">
            DAY {replayDay} OF 60
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="60"
          value={replayDay}
          onChange={e => setReplayDay(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-slate-500 font-bold">
          <span>DAY 1 (Hold Notice)</span>
          <span>DAY 30 (Legal Clearance Update)</span>
          <span>TODAY (Day 60)</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 text-xs text-blue-300 leading-relaxed">
        💡 <strong>Context Replay Insight:</strong> On Day 1, contacting Globex was prohibited. On Day 30, Sarah Chen posted a legal clearance update authorizing contact. ContextOS evaluates whether your agent uses the Day 30 instruction when queried today.
      </div>
    </div>
  );
}
