'use client';

import React from 'react';

export default function FailureSummary() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono text-xs">
      <div className="p-4 rounded-lg bg-[#111318] border border-[#232731]">
        <div className="text-[10px] text-[#6B7280] uppercase">Total Failures</div>
        <div className="text-2xl font-bold text-[#F97066] mt-1">1,100</div>
      </div>
      <div className="p-4 rounded-lg bg-[#111318] border border-[#232731]">
        <div className="text-[10px] text-[#6B7280] uppercase">Memory</div>
        <div className="text-2xl font-bold text-[#F5B942] mt-1">150</div>
      </div>
      <div className="p-4 rounded-lg bg-[#111318] border border-[#232731]">
        <div className="text-[10px] text-[#6B7280] uppercase">Entity</div>
        <div className="text-2xl font-bold text-[#F5B942] mt-1">200</div>
      </div>
      <div className="p-4 rounded-lg bg-[#111318] border border-[#232731]">
        <div className="text-[10px] text-[#6B7280] uppercase">Temporal</div>
        <div className="text-2xl font-bold text-[#F5B942] mt-1">200</div>
      </div>
      <div className="p-4 rounded-lg bg-[#111318] border border-[#232731]">
        <div className="text-[10px] text-[#6B7280] uppercase">Composition</div>
        <div className="text-2xl font-bold text-[#32D583] mt-1">100</div>
      </div>
    </div>
  );
}
