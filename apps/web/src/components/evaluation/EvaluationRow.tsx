'use client';

import React from 'react';
import Link from 'next/link';

export interface EvaluationRowData {
  id: string;
  query: string;
  category: string;
  categoryLabel: string;
  contextosResult: string;
  status: 'PASSED' | 'FAILED';
  latency: string;
  tokens: number;
}

interface EvaluationRowProps {
  data: EvaluationRowData;
}

export default function EvaluationRow({ data }: EvaluationRowProps) {
  return (
    <Link
      href={`/evaluations/${data.id}`}
      className="p-4 rounded-lg bg-[#111318] border border-[#232731] hover:border-[#7C5CFC]/60 transition-colors block space-y-2 group"
    >
      <div className="flex justify-between items-center font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#7C5CFC] group-hover:underline">#{data.id}</span>
          <span className="px-2 py-0.5 rounded bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/20 text-[10px] uppercase font-bold">
            {data.categoryLabel}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-[#A7ADB8] font-sans">{data.latency}</span>
          <span className="text-[#6B7280] font-mono">{data.tokens} tokens</span>
          <span
            className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
              data.status === 'PASSED'
                ? 'bg-[#32D583]/10 text-[#32D583] border-[#32D583]/20'
                : 'bg-[#F97066]/10 text-[#F97066] border-[#F97066]/20'
            }`}
          >
            {data.status === 'PASSED' ? 'PASSED ✓' : 'FAILED ✕'}
          </span>
        </div>
      </div>

      <div className="text-sm font-medium text-[#F5F7FA] font-sans truncate">
        "{data.query}"
      </div>
    </Link>
  );
}
