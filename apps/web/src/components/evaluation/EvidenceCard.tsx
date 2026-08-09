'use client';

import React from 'react';

interface EvidenceCardProps {
  source: string;
  timestamp: string;
  entity: string;
  relevance: string;
  content: string;
  status: 'WINNING' | 'SUPERSEDED' | 'IRRELEVANT';
}

export default function EvidenceCard({
  source,
  timestamp,
  entity,
  relevance,
  content,
  status
}: EvidenceCardProps) {
  const borderClass = {
    WINNING: 'border-[#22C55E]/40',
    SUPERSEDED: 'border-[#F59E0B]/30',
    IRRELEVANT: 'border-[#252A31]',
  }[status];

  const statusBadge = {
    WINNING: 'bg-[#22C55E]/10 text-[#22C55E]',
    SUPERSEDED: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    IRRELEVANT: 'bg-[#66707D]/10 text-[#66707D]',
  }[status];

  return (
    <div className={`p-4 rounded-lg bg-[#15181D] border ${borderClass} space-y-2.5 font-mono text-xs`}>
      <div className="flex justify-between items-center text-[11px]">
        <span className="font-bold text-[#7C5CFC]">{source}</span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${statusBadge}`}>
          {status}
        </span>
      </div>

      <div className="text-[10px] text-[#66707D] space-y-0.5">
        <div>Timestamp: {timestamp}</div>
        <div>Entity: {entity}</div>
        <div>Relevance: {relevance}</div>
      </div>

      <p className="text-xs text-[#F4F5F7] font-sans pt-1 leading-relaxed border-t border-[#252A31]">
        "{content}"
      </p>
    </div>
  );
}
