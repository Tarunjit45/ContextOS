'use client';

import React from 'react';

interface Stage {
  title: string;
  desc: string;
}

const STAGES: Stage[] = [
  { title: 'QUERY', desc: 'Input Query' },
  { title: 'HYBRID RETRIEVAL', desc: 'BM25 + Recency' },
  { title: 'ENTITY RESOLUTION', desc: 'Role Scoring' },
  { title: 'TEMPORAL STATE', desc: 'Valid Intervals' },
  { title: 'MEMORY RANKING', desc: 'Importance' },
  { title: 'CONTEXT GRAPH', desc: 'NetworkX Paths' },
  { title: 'CONTEXT COMPOSITION', desc: 'Budget Guard' },
  { title: 'LLM', desc: 'Compact Output' },
];

export default function PipelineDiagram() {
  return (
    <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-4">
      <div className="flex justify-between items-center font-mono">
        <span className="text-xs font-bold text-[#F4F5F7] uppercase tracking-wider">CONTEXT COMPILER PIPELINE</span>
        <span className="text-[11px] text-[#66707D]">8 CONNECTED STAGES</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-center font-mono text-xs">
        {STAGES.map((stage, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-[#15181D] border border-[#252A31] flex flex-col justify-between space-y-1">
            <span className="text-[10px] text-[#7C5CFC] font-bold">0{idx + 1}</span>
            <span className="text-[11px] font-bold text-[#F4F5F7]">{stage.title}</span>
            <span className="text-[9px] text-[#66707D]">{stage.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
