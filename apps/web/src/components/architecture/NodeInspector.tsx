'use client';

import React from 'react';

export interface SubsystemDetail {
  id: string;
  name: string;
  module: string;
  purpose: string;
  input: string;
  output: string;
  failureClass: string;
  specification: string;
}

interface NodeInspectorProps {
  node: SubsystemDetail;
}

export default function NodeInspector({ node }: NodeInspectorProps) {
  return (
    <div className="p-6 rounded-lg bg-[#111318] border border-[#7C5CFC]/40 space-y-4 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-[#232731] pb-3">
        <div className="flex items-center gap-3 font-mono">
          <span className="w-2.5 h-2.5 rounded bg-[#7C5CFC]" />
          <h3 className="text-lg font-semibold text-[#F5F7FA]">{node.name}</h3>
        </div>
        <code className="text-xs text-[#A7ADB8] font-mono bg-[#171A20] px-2.5 py-1 rounded border border-[#232731]">
          {node.module}
        </code>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
        {/* PURPOSE */}
        <div className="space-y-1">
          <span className="font-mono text-[10px] font-bold text-[#6B7280] uppercase tracking-widest block">PURPOSE</span>
          <p className="text-[#F5F7FA] leading-relaxed">{node.purpose}</p>
        </div>

        {/* FAILURE CLASS ADDRESSED */}
        <div className="space-y-1">
          <span className="font-mono text-[10px] font-bold text-[#F5B942] uppercase tracking-widest block">PREVENTS / ADDRESSED FAILURE</span>
          <p className="text-[#F5B942] font-mono font-bold">{node.failureClass}</p>
        </div>

        {/* INPUT */}
        <div className="space-y-1">
          <span className="font-mono text-[10px] font-bold text-[#6B7280] uppercase tracking-widest block">INPUT</span>
          <code className="text-[#A7ADB8] font-mono text-[11px] block bg-[#171A20] p-3 rounded border border-[#232731]">
            {node.input}
          </code>
        </div>

        {/* OUTPUT */}
        <div className="space-y-1">
          <span className="font-mono text-[10px] font-bold text-[#6B7280] uppercase tracking-widest block">OUTPUT</span>
          <code className="text-[#32D583] font-mono text-[11px] block bg-[#171A20] p-3 rounded border border-[#232731]">
            {node.output}
          </code>
        </div>
      </div>

      {/* ALGORITHMIC SPECIFICATION */}
      <div className="pt-3 border-t border-[#232731] font-mono text-xs">
        <span className="text-[#6B7280] text-[10px] font-bold uppercase tracking-widest block mb-1">MATHEMATICAL / ALGORITHMIC SPECIFICATION</span>
        <div className="bg-[#171A20] p-3.5 rounded text-[#4F8CFF] border border-[#232731]">
          {node.specification}
        </div>
      </div>
    </div>
  );
}
