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
    default: 'border-[#232731]',
    accent: 'border-[#7C5CFC]/40',
    success: 'border-[#32D583]/40',
    warning: 'border-[#F5B942]/40',
    error: 'border-[#F97066]/40',
  }[variant];

  const valueClasses = {
    default: 'text-[#F5F7FA]',
    accent: 'text-[#7C5CFC]',
    success: 'text-[#32D583]',
    warning: 'text-[#F5B942]',
    error: 'text-[#F97066]',
  }[variant];

  return (
    <div className={`p-5 rounded-lg bg-[#111318] border ${borderClasses} space-y-1 font-mono`}>
      <div className={`text-3xl font-semibold font-mono tabular-nums ${valueClasses}`}>{value}</div>
      <div className="text-xs text-[#A7ADB8] font-sans font-medium">{label}</div>
      {sublabel && <div className="text-[10px] text-[#6B7280] font-mono">{sublabel}</div>}
    </div>
  );
}
