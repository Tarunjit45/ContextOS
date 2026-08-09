'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ResearchWarningProps {
  message?: string;
}

export default function ResearchWarning({
  message = "Low-resource validation. Not statistically sufficient to establish general performance across arbitrary enterprise workloads."
}: ResearchWarningProps) {
  return (
    <div className="rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/5 p-3.5 flex items-start gap-3 text-xs font-sans">
      <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
      <div>
        <span className="font-bold text-[#F59E0B] font-mono text-[11px] uppercase tracking-wider block mb-0.5">
          RESEARCH LIMITATION NOTICE (n = 10)
        </span>
        <span className="text-[#9BA3AF] leading-relaxed block">{message}</span>
      </div>
    </div>
  );
}
