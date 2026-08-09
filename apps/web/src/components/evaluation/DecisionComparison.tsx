'use client';

import React from 'react';

interface DecisionComparisonProps {
  baselineDecision: string;
  baselineExplanation: string;
  baselineTokens: number;
  baselineLatency: string;
  contextosDecision: string;
  contextosExplanation: string;
  contextosTokens: number;
  contextosLatency: string;
}

export default function DecisionComparison({
  baselineDecision,
  baselineExplanation,
  baselineTokens,
  baselineLatency,
  contextosDecision,
  contextosExplanation,
  contextosTokens,
  contextosLatency,
}: DecisionComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
      {/* BASELINE RAG */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#F97066]/40 space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#A7ADB8] uppercase">BASELINE RAG</span>
          <span className="text-xs font-bold text-[#F97066] px-2 py-0.5 rounded bg-[#F97066]/10 border border-[#F97066]/20">
            FAILED ✕
          </span>
        </div>

        <div className="space-y-1 font-sans">
          <div className="font-mono text-[10px] text-[#6B7280] uppercase">Agent Decision</div>
          <div className="text-2xl font-bold font-mono text-[#F97066]">{baselineDecision}</div>
          <p className="text-xs text-[#A7ADB8] font-sans mt-1 leading-relaxed">
            {baselineExplanation}
          </p>
        </div>

        <div className="pt-3 border-t border-[#232731] flex justify-between text-[#A7ADB8]">
          <span>Tokens: {baselineTokens}</span>
          <span>Latency: {baselineLatency}</span>
        </div>
      </div>

      {/* CONTEXTOS COMPACT */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#32D583]/50 space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#7C5CFC] uppercase">CONTEXTOS COMPACT</span>
          <span className="text-xs font-bold text-[#32D583] px-2 py-0.5 rounded bg-[#32D583]/10 border border-[#32D583]/20">
            PASSED ✓
          </span>
        </div>

        <div className="space-y-1 font-sans">
          <div className="font-mono text-[10px] text-[#6B7280] uppercase">Agent Decision</div>
          <div className="text-2xl font-bold font-mono text-[#32D583]">{contextosDecision}</div>
          <p className="text-xs text-[#A7ADB8] font-sans mt-1 leading-relaxed">
            {contextosExplanation}
          </p>
        </div>

        <div className="pt-3 border-t border-[#232731] flex justify-between text-[#A7ADB8]">
          <span>Tokens: {contextosTokens}</span>
          <span>Latency: {contextosLatency}</span>
        </div>
      </div>
    </div>
  );
}
