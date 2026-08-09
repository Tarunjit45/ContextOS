'use client';

import React from 'react';

export default function BenchmarkComparison() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
      {/* BASELINE RAG */}
      <div className="p-6 rounded-lg bg-[#15181D] border border-[#EF4444]/30 space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#9BA3AF] uppercase">BASELINE RAG</span>
          <span className="text-[10px] text-[#66707D]">CONTROL</span>
        </div>

        <div>
          <div className="text-3xl font-bold text-[#EF4444]">50%</div>
          <div className="text-xs text-[#9BA3AF] mt-1 font-sans">Accuracy (5/10 scenarios passed)</div>
        </div>

        <div className="space-y-2 pt-3 border-t border-[#252A31]">
          <div className="flex justify-between text-[#9BA3AF]">
            <span>Input Tokens:</span>
            <span className="text-[#F4F5F7] font-bold">2,441</span>
          </div>
          <div className="flex justify-between text-[#9BA3AF]">
            <span>Hallucination:</span>
            <span className="text-[#EF4444] font-bold">10%</span>
          </div>
          <div className="flex justify-between text-[#9BA3AF]">
            <span>P50 Latency:</span>
            <span className="text-[#F4F5F7]">4.33s</span>
          </div>
        </div>
      </div>

      {/* CONTEXTOS FULL */}
      <div className="p-6 rounded-lg bg-[#15181D] border border-[#F59E0B]/30 space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#F59E0B] uppercase">CONTEXTOS FULL</span>
          <span className="text-[10px] text-[#F59E0B]/80">CONTEXT BLOAT</span>
        </div>

        <div>
          <div className="text-3xl font-bold text-[#F59E0B]">50%</div>
          <div className="text-xs text-[#9BA3AF] mt-1 font-sans">Accuracy (5/10 scenarios passed)</div>
        </div>

        <div className="space-y-2 pt-3 border-t border-[#252A31]">
          <div className="flex justify-between text-[#9BA3AF]">
            <span>Input Tokens:</span>
            <span className="text-[#F59E0B] font-bold">65,424</span>
          </div>
          <div className="flex justify-between text-[#9BA3AF]">
            <span>Hallucination:</span>
            <span className="text-[#22C55E] font-bold">0%</span>
          </div>
          <div className="flex justify-between text-[#9BA3AF]">
            <span>P50 Latency:</span>
            <span className="text-[#F4F5F7]">3.80s</span>
          </div>
        </div>
      </div>

      {/* CONTEXTOS COMPACT (EMPHASIZED WITH PURPLE) */}
      <div className="p-6 rounded-lg bg-[#15181D] border-2 border-[#7C5CFC] space-y-4 shadow-lg shadow-[#7C5CFC]/10">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#7C5CFC] uppercase">CONTEXTOS COMPACT</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#7C5CFC]/20 text-[#7C5CFC] font-bold">DECISION-GRADE</span>
        </div>

        <div>
          <div className="text-3xl font-bold text-[#7C5CFC]">90%</div>
          <div className="text-xs text-[#9BA3AF] mt-1 font-sans">Accuracy (9/10 scenarios passed)</div>
        </div>

        <div className="space-y-2 pt-3 border-t border-[#252A31]">
          <div className="flex justify-between text-[#9BA3AF]">
            <span>Input Tokens:</span>
            <span className="text-[#22C55E] font-bold">4,204</span>
          </div>
          <div className="flex justify-between text-[#9BA3AF]">
            <span>Hallucination:</span>
            <span className="text-[#22C55E] font-bold">0%</span>
          </div>
          <div className="flex justify-between text-[#9BA3AF]">
            <span>P50 Latency:</span>
            <span className="text-[#F4F5F7]">5.97s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
