'use client';

import React from 'react';

interface BadgeProps {
  variant?: 'purple' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'purple', children, className = '' }: BadgeProps) {
  const badgeClasses = {
    purple: 'bg-[#7C5CFC]/10 text-[#7C5CFC] border-[#7C5CFC]/20',
    success: 'bg-[#32D583]/10 text-[#32D583] border-[#32D583]/20',
    warning: 'bg-[#F5B942]/10 text-[#F5B942] border-[#F5B942]/20',
    error: 'bg-[#F97066]/10 text-[#F97066] border-[#F97066]/20',
    info: 'bg-[#4F8CFF]/10 text-[#4F8CFF] border-[#4F8CFF]/20',
    neutral: 'bg-[#171A20] text-[#A7ADB8] border-[#232731]',
  }[variant];

  return (
    <span className={`px-2 py-0.5 rounded border font-mono text-[10px] font-bold uppercase tracking-wider ${badgeClasses} ${className}`}>
      {children}
    </span>
  );
}
