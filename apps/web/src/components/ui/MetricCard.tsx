'use client';

import React from 'react';

interface MetricCardProps {
  value: string;
  label: string;
  sublabel?: string;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
}

export default function MetricCard({
  value,
  label,
  sublabel,
  variant = 'default'
}: MetricCardProps) {
  const borderClasses = {
    default: 'border-[#252A31]',
    accent: 'border-[#7C5CFC]/50 text-[#7C5CFC]',
    success: 'border-[#22C55E]/40 text-[#22C55E]',
    warning: 'border-[#F59E0B]/40 text-[#F59E0B]',
    error: 'border-[#EF4444]/40 text-[#EF4444]',
  }[variant];

  const valueClasses = {
    default: 'text-[#F4F5F7]',
    accent: 'text-[#7C5CFC]',
    success: 'text-[#22C55E]',
    warning: 'text-[#F59E0B]',
    error: 'text-[#EF4444]',
  }[variant];

  return (
    <div className={`p-5 rounded-lg bg-[#15181D] border ${borderClasses} space-y-1 font-mono`}>
      <div className={`text-3xl font-bold ${valueClasses}`}>{value}</div>
      <div className="text-xs text-[#9BA3AF] font-sans font-medium">{label}</div>
      {sublabel && <div className="text-[10px] text-[#66707D] font-mono">{sublabel}</div>}
    </div>
  );
}
