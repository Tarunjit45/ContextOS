'use client';

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function TrustBoundaryPanel() {
  return (
    <div className="space-y-4 font-sans">
      <div className="border-b border-[#232731] pb-3">
        <h2 className="text-xl font-semibold text-[#F5F7FA] tracking-tight">
          What This Demo Proves — And What It Doesn't
        </h2>
        <p className="text-xs text-[#A7ADB8] mt-0.5">
          Explicit research boundary outlining demonstrated facts versus unproven generalizations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
        {/* DEMONSTRATES */}
        <div className="p-5 rounded-lg bg-[#111318] border border-[#32D583]/30 space-y-3">
          <div className="flex items-center gap-2 text-[#32D583] font-mono font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>DEMONSTRATES</span>
          </div>

          <ul className="space-y-2 text-[#A7ADB8]">
            <li className="flex items-start gap-2">
              <span className="text-[#32D583] font-bold">✓</span>
              <span>Context retrieval can be improved with structured context composition.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#32D583] font-bold">✓</span>
              <span>Temporal state can be explicitly represented to resolve outdated evidence.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#32D583] font-bold">✓</span>
              <span>Entity ambiguity can be handled before sending context to the LLM.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#32D583] font-bold">✓</span>
              <span>ContextOS Compact dramatically reduces context payload (-93.6% token reduction).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#32D583] font-bold">✓</span>
              <span>The benchmark pipeline is fully deterministic and reproducible.</span>
            </li>
          </ul>
        </div>

        {/* DOES NOT PROVE */}
        <div className="p-5 rounded-lg bg-[#111318] border border-[#F97066]/30 space-y-3">
          <div className="flex items-center gap-2 text-[#F97066] font-mono font-bold text-xs">
            <XCircle className="w-4 h-4" />
            <span>DOES NOT PROVE</span>
          </div>

          <ul className="space-y-2 text-[#A7ADB8]">
            <li className="flex items-start gap-2">
              <span className="text-[#F97066] font-bold">✕</span>
              <span>Universal enterprise performance across all unconstrained domains.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F97066] font-bold">✕</span>
              <span>Superiority across all LLM providers or unreleased foundational models.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F97066] font-bold">✕</span>
              <span>Production-scale latency at millions of concurrent documents.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F97066] font-bold">✕</span>
              <span>Statistical significance from a low-resource n=10 sample size.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F97066] font-bold">✕</span>
              <span>That every custom AI agent will improve by exactly 40 percentage points.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
