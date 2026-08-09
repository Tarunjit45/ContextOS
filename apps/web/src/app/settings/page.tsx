'use client';

import React from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="space-y-8 font-mono text-xs text-[#F4F5F7]">
      {/* Header */}
      <div className="border-b border-[#252A31] pb-6 flex justify-between items-start font-sans">
        <div>
          <h1 className="text-3xl font-semibold text-[#F4F5F7] tracking-tight font-sans">SETTINGS</h1>
          <p className="text-sm text-[#9BA3AF] mt-1 font-sans">
            Environment indicators and benchmark execution configuration.
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-[#15181D] border border-[#252A31] text-xs font-mono text-[#9BA3AF] hover:text-[#F4F5F7] transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* SETTINGS CARDS */}
      <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-6">
        <span className="font-bold text-[#F4F5F7] uppercase tracking-wider block">ENVIRONMENT & EVALUATION CONFIGURATION</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-[#15181D] border border-[#252A31] space-y-3 font-sans">
            <div className="font-mono text-[10px] text-[#66707D] uppercase font-bold">Execution Environment</div>
            <div className="text-sm font-semibold text-[#F4F5F7]">Local Evaluation Mode (FastAPI + SQLite)</div>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              ContextOS operates local-first. Evaluation traces are persisted in SQLite database (<code className="text-[#F4F5F7] font-mono">benchmarks/contextos_benchmark.db</code>).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#15181D] border border-[#252A31] space-y-3 font-sans">
            <div className="font-mono text-[10px] text-[#66707D] uppercase font-bold">LLM Provider & Model</div>
            <div className="text-sm font-semibold text-[#F4F5F7]">OpenRouter / Ollama / OpenAI / Mock</div>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              Default active real LLM endpoint: <code className="text-[#F4F5F7] font-mono">openrouter/free</code>. API keys are read strictly from process environment variables.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#15181D] border border-[#252A31] space-y-3 font-sans">
            <div className="font-mono text-[10px] text-[#66707D] uppercase font-bold">Benchmark Parameters</div>
            <div className="text-sm font-semibold text-[#F4F5F7]">Temperature = 0.0 | Max Tokens = 512</div>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              All agent configurations (Baseline, Full, Compact) execute under identical generation settings with a $5.00 cost limit guard.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#15181D] border border-[#252A31] space-y-3 font-sans">
            <div className="font-mono text-[10px] text-[#66707D] uppercase font-bold">Dataset Freeze Guard</div>
            <div className="text-sm font-semibold text-[#F4F5F7]">Dataset v1 (Seed 42)</div>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              SHA256: <code className="text-[#22C55E] font-mono">2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa</code>. Dataset is strictly frozen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
