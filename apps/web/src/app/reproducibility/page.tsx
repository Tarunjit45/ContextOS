'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';

export default function ReproducibilityPage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const commands = [
    { label: 'Validate Dataset SHA256 Hash', cmd: 'python cli/contextos.py benchmark validate-dataset' },
    { label: 'Run 133 Subsystem Unit Tests', cmd: 'python -m pytest -v' },
    { label: 'Run 1,000 Deterministic Benchmark', cmd: 'python cli/contextos.py benchmark run --scenarios 1000 --seed 42' },
    { label: 'Run Live LLM Benchmark (OpenRouter)', cmd: 'python cli/contextos.py benchmark live --scenarios 10 --seed 42 --provider openrouter --model openrouter/free' },
  ];

  return (
    <div className="space-y-8 font-mono text-xs text-[#F4F5F7]">
      {/* Header */}
      <div className="border-b border-[#252A31] pb-6 flex justify-between items-start font-sans">
        <div>
          <h1 className="text-3xl font-semibold text-[#F4F5F7] tracking-tight font-sans">REPRODUCIBILITY</h1>
          <p className="text-sm text-[#9BA3AF] mt-1 font-sans">
            Deterministic verification, dataset hash integrity, and benchmark execution commands.
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-[#15181D] border border-[#252A31] text-xs font-mono text-[#9BA3AF] hover:text-[#F4F5F7] transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* VERIFICATION METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DATASET */}
        <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-3">
          <div className="flex justify-between items-center text-[10px] text-[#66707D] uppercase font-bold">
            <span>DATASET HASH INTEGRITY</span>
            <span className="text-[#22C55E]">✓ VERIFIED</span>
          </div>

          <div className="space-y-1">
            <div className="text-lg font-bold text-[#F4F5F7]">Dataset v1</div>
            <div className="text-[#9BA3AF] text-xs">Seed: 42 | Scenarios: 1,000</div>
          </div>

          <div className="p-2.5 rounded bg-[#15181D] border border-[#252A31] text-[11px] text-[#22C55E] break-all font-mono">
            2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa
          </div>
        </div>

        {/* TEST SUITE */}
        <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-3">
          <div className="flex justify-between items-center text-[10px] text-[#66707D] uppercase font-bold">
            <span>SUBSYSTEM UNIT TESTS</span>
            <span className="text-[#22C55E]">✓ PASSING</span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-bold text-[#22C55E]">133 / 133</div>
            <div className="text-[#9BA3AF] font-sans text-xs">Full pytest suite passing in ~2.8s</div>
          </div>

          <div className="text-[11px] text-[#9BA3AF]">
            Zero live API key dependencies for unit test execution.
          </div>
        </div>

        {/* REAL LLM ENVIRONMENT */}
        <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-3">
          <div className="flex justify-between items-center text-[10px] text-[#66707D] uppercase font-bold">
            <span>REAL LLM EVALUATION</span>
            <span className="text-[#7C5CFC]">OPENROUTER</span>
          </div>

          <div className="space-y-1">
            <div className="text-lg font-bold text-[#F4F5F7]">n = 10 Scenarios</div>
            <div className="text-[#9BA3AF] text-xs">Model: openrouter/free</div>
          </div>

          <div className="text-[11px] text-[#F59E0B]">
            Low-resource validation experiment; not statistically sufficient for generalization.
          </div>
        </div>
      </div>

      {/* REPRODUCIBILITY COMMANDS */}
      <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-4">
        <span className="font-bold text-[#F4F5F7] uppercase tracking-wider block">REPRODUCTION COMMANDS</span>

        <div className="space-y-3">
          {commands.map((c, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-[#15181D] border border-[#252A31] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9BA3AF] font-sans font-medium">{c.label}</span>
                <button
                  onClick={() => copyToClipboard(c.cmd)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#111419] border border-[#252A31] text-[#9BA3AF] hover:text-[#F4F5F7] transition-colors"
                >
                  {copiedCmd === c.cmd ? (
                    <>
                      <Check className="w-3 h-3 text-[#22C55E]" />
                      <span className="text-[#22C55E] text-[10px]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px]">COPY</span>
                    </>
                  )}
                </button>
              </div>

              <code className="text-[#38BDF8] text-[11px] font-mono block bg-[#0D0F12] p-2.5 rounded border border-[#252A31]">
                {c.cmd}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
