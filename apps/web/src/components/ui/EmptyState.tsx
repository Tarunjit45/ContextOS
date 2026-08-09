'use client';

import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = 'No data available',
  message = 'There are no records matching your current filter criteria.',
  action
}: EmptyStateProps) {
  return (
    <div className="py-12 px-4 text-center rounded-lg bg-[#111318] border border-[#232731] space-y-3 font-sans">
      <div className="text-sm font-semibold text-[#F5F7FA] font-mono">{title}</div>
      <p className="text-xs text-[#A7ADB8] max-w-sm mx-auto leading-relaxed">{message}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
