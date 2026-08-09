'use client';

import React from 'react';

const CATEGORIES = [
  { name: 'Temporal Retrieval Failure', count: 200, percent: 18.2, color: 'bg-[#F5B942]' },
  { name: 'Entity Resolution Failure', count: 200, percent: 18.2, color: 'bg-[#F5B942]' },
  { name: 'Multi-Hop Relationship', count: 200, percent: 18.2, color: 'bg-[#4F8CFF]' },
  { name: 'Memory Decay Failure', count: 150, percent: 13.6, color: 'bg-[#F5B942]' },
  { name: 'Channel Contradiction', count: 150, percent: 13.6, color: 'bg-[#F97066]' },
  { name: 'Context Composition Bloat', count: 100, percent: 9.1, color: 'bg-[#7C5CFC]' },
  { name: 'Ungrounded Hallucination', count: 100, percent: 9.1, color: 'bg-[#F97066]' },
];

export default function FailureDistribution() {
  return (
    <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-[#F5F7FA] uppercase tracking-wider">FAILURE DISTRIBUTION BY CATEGORY</span>
        <span className="text-[#6B7280]">1,100 BENCHMARK TRACES</span>
      </div>

      <div className="space-y-3">
        {CATEGORIES.map((cat, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#A7ADB8] font-sans">{cat.name}</span>
              <span className="text-[#F5F7FA]">{cat.count} cases ({cat.percent}%)</span>
            </div>
            <div className="w-full bg-[#0D0F12] h-2.5 rounded overflow-hidden border border-[#232731]">
              <div className={`${cat.color} h-full`} style={{ width: `${cat.percent * 4}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
