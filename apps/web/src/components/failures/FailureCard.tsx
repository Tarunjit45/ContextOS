'use client';

import React from 'react';

interface FailureCardProps {
  keyTag: string;
  name: string;
  count: number;
  explanation: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function FailureCard({
  keyTag,
  name,
  count,
  explanation,
  isSelected = false,
  onClick
}: FailureCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-lg border cursor-pointer flex flex-col justify-between space-y-3 transition-colors ${
        isSelected
          ? 'bg-[#15181D] border-[#7C5CFC] shadow-sm'
          : 'bg-[#111419] border-[#252A31] hover:border-[#9BA3AF]'
      }`}
    >
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-[#7C5CFC] font-bold">{keyTag}</span>
          <span className="text-[#9BA3AF] font-bold">{count} cases</span>
        </div>
        <div className="font-bold text-[#F4F5F7] text-sm font-sans">{name}</div>
        <p className="text-xs text-[#9BA3AF] font-sans leading-relaxed pt-1">
          {explanation}
        </p>
      </div>

      <button className="w-full py-1.5 rounded bg-[#15181D] border border-[#252A31] font-mono text-xs text-center font-bold text-[#7C5CFC] hover:border-[#7C5CFC] transition-colors">
        {isSelected ? 'INSPECTING CASES ●' : 'VIEW CASES →'}
      </button>
    </div>
  );
}
