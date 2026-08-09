'use client';

import React from 'react';
import MetricCard from '../ui/MetricCard';

export default function ResearchSnapshot() {
  return (
    <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-5">
      <div className="flex justify-between items-center font-mono">
        <span className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">RESEARCH SNAPSHOT</span>
        <span className="text-xs text-[#32D583] font-bold bg-[#32D583]/10 px-2 py-0.5 rounded border border-[#32D583]/20">
          OpenRouter API (n=10)
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard value="90%" label="ContextOS Compact Accuracy" variant="success" />
        <MetricCard value="93.6%" label="Token Reduction vs Full" variant="accent" />
        <MetricCard value="0%" label="Hallucination Rate" variant="success" />
        <MetricCard value="133" label="Subsystem Unit Tests" variant="default" sublabel="Passing" />
      </div>
    </div>
  );
}
