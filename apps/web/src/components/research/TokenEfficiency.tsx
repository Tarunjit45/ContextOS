'use client';

import React from 'react';

export default function TokenEfficiency() {
  return (
    <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-[#F5F7FA] uppercase tracking-wider">TOKEN EFFICIENCY PAYLOAD</span>
        <span className="text-[#7C5CFC] font-bold">93.6% TOKEN REDUCTION</span>
      </div>

      <div className="space-y-4">
        {/* BASELINE */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#A7ADB8]">BASELINE RAG</span>
            <span className="text-[#F5F7FA]">2,441 tokens</span>
          </div>
          <div className="w-full bg-[#0D0F12] h-3.5 rounded overflow-hidden border border-[#232731]">
            <div className="bg-[#4F8CFF] h-full w-[3.7%]" />
          </div>
        </div>

        {/* FULL */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#F5B942]">CONTEXTOS FULL</span>
            <span className="text-[#F5B942] font-bold">65,424 tokens</span>
          </div>
          <div className="w-full bg-[#0D0F12] h-3.5 rounded overflow-hidden border border-[#232731]">
            <div className="bg-[#F5B942] h-full w-full" />
          </div>
        </div>

        {/* COMPACT */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#32D583]">CONTEXTOS COMPACT</span>
            <span className="text-[#32D583] font-bold">4,204 tokens (-93.6%)</span>
          </div>
          <div className="w-full bg-[#0D0F12] h-3.5 rounded overflow-hidden border border-[#232731]">
            <div className="bg-[#32D583] h-full w-[6.4%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
