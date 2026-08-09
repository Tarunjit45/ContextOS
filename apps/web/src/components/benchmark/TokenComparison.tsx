'use client';

import React from 'react';

export default function TokenComparison() {
  return (
    <div className="p-5 rounded-lg bg-[#15181D] border border-[#252A31] space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center">
        <span className="font-bold text-[#F4F5F7] uppercase">INPUT TOKEN PAYLOAD COMPARISON</span>
        <span className="text-[#7C5CFC] font-bold">93.6% TOKEN REDUCTION</span>
      </div>

      <div className="space-y-3">
        {/* FULL */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#F59E0B]">CONTEXTOS FULL</span>
            <span className="text-[#F59E0B] font-bold">65,424 tokens</span>
          </div>
          <div className="w-full bg-[#0D0F12] h-4 rounded overflow-hidden border border-[#252A31]">
            <div className="bg-[#F59E0B] h-full w-full" />
          </div>
        </div>

        {/* COMPACT */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#22C55E]">CONTEXTOS COMPACT</span>
            <span className="text-[#22C55E] font-bold">4,204 tokens (-93.6%)</span>
          </div>
          <div className="w-full bg-[#0D0F12] h-4 rounded overflow-hidden border border-[#252A31]">
            <div className="bg-[#22C55E] h-full w-[6.4%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
