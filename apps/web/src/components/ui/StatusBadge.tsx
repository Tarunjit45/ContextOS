'use client';

import React from 'react';

interface StatusBadgeProps {
  status: 'passed' | 'failed' | 'warning' | 'info' | 'verified';
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = {
    passed: {
      bg: 'bg-[#22C55E]/10',
      text: 'text-[#22C55E]',
      border: 'border-[#22C55E]/20',
      defaultLabel: 'PASSED ✓',
    },
    verified: {
      bg: 'bg-[#22C55E]/10',
      text: 'text-[#22C55E]',
      border: 'border-[#22C55E]/20',
      defaultLabel: '✓ VERIFIED',
    },
    failed: {
      bg: 'bg-[#EF4444]/10',
      text: 'text-[#EF4444]',
      border: 'border-[#EF4444]/20',
      defaultLabel: 'FAILED ✕',
    },
    warning: {
      bg: 'bg-[#F59E0B]/10',
      text: 'text-[#F59E0B]',
      border: 'border-[#F59E0B]/20',
      defaultLabel: 'WARNING',
    },
    info: {
      bg: 'bg-[#38BDF8]/10',
      text: 'text-[#38BDF8]',
      border: 'border-[#38BDF8]/20',
      defaultLabel: 'INFO',
    },
  }[status];

  return (
    <span
      className={`px-2 py-0.5 rounded border font-mono text-[10px] font-bold ${config.bg} ${config.text} ${config.border}`}
    >
      {label || config.defaultLabel}
    </span>
  );
}
