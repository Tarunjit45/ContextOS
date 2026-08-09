'use client';

import React from 'react';

export default function BenchmarkComparison() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
      {/* BASELINE RAG */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#F97066]/30 space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#A7ADB8] uppercase">BASELINE RAG</span>
          <span className="text-[10px] text-[#6B7280]">CONTROL</span>
        </div>

        <div>
          <div className="text-3xl font-semibold text-[#F97066] font-mono tabular-nums">50%</div>
          <div className="text-xs text-[#A7ADB8] mt-1 font-sans">Accuracy (5/10 scenarios passed)</div>
        </div>

        <div className="space-y-2 pt-3 border-t border-[#232731]">
          <div className="flex justify-between text-[#A7ADB8]">
            <span>Input Tokens:</span>
            <span className="text-[#F5F7FA] font-bold">2,441</span>
          </div>
          <div className="flex justify-between text-[#A7ADB8]">
            <span>Hallucination:</span>
            <span className="text-[#F97066] font-bold">10%</span>
          </div>
          <div className="flex justify-between text-[#A7ADB8]">
            <span>P50 Latency:</span>
            <span className="text-[#F5F7FA]">4.33s</span>
          </div>
        </div>
      </div>

      {/* CONTEXTOS FULL */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#F5B942]/30 space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#F5B942] uppercase">CONTEXTOS FULL</span>
          <span className="text-[10px] text-[#F5B942]/80">CONTEXT BLOAT</span>
        </div>

        <div>
          <div className="text-3xl font-semibold text-[#F5B942] font-mono tabular-nums">50%</div>
          <div className="text-xs text-[#A7ADB8] mt-1 font-sans">Accuracy (5/10 scenarios passed)</div>
        </div>

        <div className="space-y-2 pt-3 border-t border-[#232731]">
          <div className="flex justify-between text-[#A7ADB8]">
            <span>Input Tokens:</span>
            <span className="text-[#F5B942] font-bold">65,424</span>
          </div>
          <div className="flex justify-between text-[#A7ADB8]">
            <span>Hallucination:</span>
            <span className="text-[#32D583] font-bold">0%</span>
          </div>
          <div className="flex justify-between text-[#A7ADB8]">
            <span>P50 Latency:</span>
            <span className="text-[#F5F7FA]">3.80s</span>
          </div>
        </div>
      </div>

      {/* CONTEXTOS COMPACT (EMPHASIZED WITH PURPLE) */}
      <div className="p-6 rounded-lg bg-[#111318] border-2 border-[#7C5CFC] space-y-4 shadow-lg shadow-[#7C5CFC]/5">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#7C5CFC] uppercase">CONTEXTOS COMPACT</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#7C5CFC]/20 text-[#7C5CFC] font-bold">DECISION-GRADE</span>
        </div>

        <div>
          <div className="text-3xl font-semibold text-[#7C5CFC] font-mono tabular-nums">90%</div>
          <div className="text-xs text-[#A7ADB8] mt-1 font-sans">Accuracy (9/10 scenarios passed)</div>
        </div>

        <div className="space-y-2 pt-3 border-t border-[#232731]">
          <div className="flex justify-between text-[#A7ADB8]">
            <span>Input Tokens:</span>
            <span className="text-[#32D583] font-bold">4,204 (-93.6% vs Full)</span>
          </div>
          <div className="flex justify-between text-[#A7ADB8]">
            <span>Hallucination:</span>
            <span className="text-[#32D583] font-bold">0%</span>
          </div>
          <div className="flex justify-between text-[#A7ADB8]">
            <span>P50 Latency:</span>
            <span className="text-[#F5F7FA]">5.97s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
