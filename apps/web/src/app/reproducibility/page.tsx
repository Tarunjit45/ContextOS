'use client';

import React from 'react';
import Link from 'next/link';
import CopyButton from '../../components/ui/CopyButton';

export default function ReproducibilityPage() {
  const steps = [
    {
      num: '1',
      title: 'Environment & Dependency Installation',
      cmd: 'pip install -r requirements.txt && cd apps/web && npm install',
      desc: 'Installs core Python packages (NetworkX, NumPy, FastAPI, Pytest) and Next.js frontend dependencies.'
    },
    {
      num: '2',
      title: 'Dataset v1 SHA256 Integrity Hash Verification',
      cmd: 'python cli/contextos.py benchmark validate-dataset',
      desc: 'Validates SHA256 digest against canonical frozen hash 2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa.'
    },
    {
      num: '3',
      title: 'Subsystem Unit Test Suite (133 Tests)',
      cmd: 'python -m pytest -v',
      desc: 'Executes zero-leakage offline unit test suite across hybrid retriever, entity resolver, temporal state resolver, and context compiler.'
    },
    {
      num: '4',
      title: 'Run 1,000-Scenario Deterministic Regression Benchmark',
      cmd: 'python cli/contextos.py benchmark run --scenarios 1000 --seed 42',
      desc: 'Runs full offline deterministic evaluation pipeline across all 1,000 Dataset v1 scenarios.'
    },
    {
      num: '5',
      title: 'Run 10-Scenario Real LLM OpenRouter Benchmark',
      cmd: 'python cli/contextos.py benchmark live --scenarios 10 --seed 42 --provider openrouter --model openrouter/free',
      desc: 'Executes live 3-way comparative evaluation (Baseline vs Full vs Compact) using OpenRouter API under $5.00 cost limit.'
    }
  ];

  return (
    <div className="space-y-8 font-sans text-[#F5F7FA]">
      {/* Page Header */}
      <div className="border-b border-[#232731] pb-6 flex justify-between items-start font-mono">
        <div>
          <h1 className="text-2xl font-semibold text-[#F5F7FA] tracking-tight">Reproducibility Appendix</h1>
          <p className="text-sm text-[#A7ADB8] mt-1 font-sans">
            Environment specifications, dataset SHA256 hash verification, and benchmark execution commands.
          </p>
        </div>
        <Link
          href="/"
          className="px-3 py-1.5 rounded-md bg-[#111318] border border-[#232731] text-xs text-[#A7ADB8] hover:text-[#F5F7FA] transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* Environment & Dataset Integrity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Environment */}
        <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-3">
          <div className="text-[10px] text-[#6B7280] uppercase font-bold">SYSTEM ENVIRONMENT SPECIFICATIONS</div>

          <div className="space-y-2 text-[#A7ADB8] font-sans text-xs">
            <div className="flex justify-between border-b border-[#232731] pb-1.5 font-mono">
              <span>Python Version:</span>
              <span className="text-[#F5F7FA] font-bold">Python 3.12+</span>
            </div>
            <div className="flex justify-between border-b border-[#232731] pb-1.5 font-mono">
              <span>Node.js / Next.js:</span>
              <span className="text-[#F5F7FA] font-bold">Node v20.x / Next.js 15.5</span>
            </div>
            <div className="flex justify-between border-b border-[#232731] pb-1.5 font-mono">
              <span>Primary OS Target:</span>
              <span className="text-[#F5F7FA] font-bold">Windows / macOS / Linux</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Persistence DB:</span>
              <span className="text-[#F5F7FA] font-bold">SQLite (benchmarks/contextos_benchmark.db)</span>
            </div>
          </div>
        </div>

        {/* Dataset Integrity */}
        <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-3">
          <div className="flex justify-between items-center text-[10px] text-[#6B7280] uppercase font-bold">
            <span>DATASET HASH INTEGRITY</span>
            <span className="text-[#32D583]">✓ VERIFIED</span>
          </div>

          <div className="space-y-1">
            <div className="text-base font-bold text-[#F5F7FA]">Dataset v1</div>
            <div className="text-[#A7ADB8] text-xs">Seed: 42 | Scenarios: 1,000</div>
          </div>

          <div className="p-3 rounded bg-[#0D0F12] border border-[#232731] text-[11px] text-[#32D583] break-all font-mono">
            2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa
          </div>
        </div>
      </div>

      {/* Numbered Reproduction Steps */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-6">
        <span className="font-bold text-[#F5F7FA] font-mono text-xs uppercase tracking-wider block">REPRODUCTION PROTOCOL</span>

        <div className="space-y-5">
          {steps.map((s) => (
            <div key={s.num} className="p-5 rounded-lg bg-[#171A20] border border-[#232731] space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-[#7C5CFC]/20 text-[#7C5CFC] border border-[#7C5CFC]/30 flex items-center justify-center font-mono font-bold text-xs">
                    {s.num}
                  </span>
                  <span className="text-sm font-semibold text-[#F5F7FA] font-sans">{s.title}</span>
                </div>
                <CopyButton text={s.cmd} />
              </div>

              <p className="text-xs text-[#A7ADB8] font-sans leading-relaxed">{s.desc}</p>

              <code className="text-[#4F8CFF] text-[11px] font-mono block bg-[#0D0F12] p-3 rounded border border-[#232731]">
                {s.cmd}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Expected Benchmark Results Summary */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#32D583]/30 space-y-3 font-mono text-xs">
        <span className="font-bold text-[#32D583] uppercase tracking-wider block">EXPECTED CANONICAL RESULTS</span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-3.5 rounded bg-[#171A20] border border-[#232731] font-mono">
            <div className="text-[#6B7280] text-[10px]">BASELINE RAG</div>
            <div className="text-[#F97066] font-bold text-base mt-0.5">50% Accuracy</div>
            <div className="text-[#A7ADB8] text-[11px]">Tokens: 2,441</div>
          </div>

          <div className="p-3.5 rounded bg-[#171A20] border border-[#232731] font-mono">
            <div className="text-[#6B7280] text-[10px]">CONTEXTOS FULL</div>
            <div className="text-[#F5B942] font-bold text-base mt-0.5">50% Accuracy</div>
            <div className="text-[#A7ADB8] text-[11px]">Tokens: 65,424</div>
          </div>

          <div className="p-3.5 rounded bg-[#171A20] border border-[#7C5CFC]/40 font-mono">
            <div className="text-[#7C5CFC] text-[10px] font-bold">CONTEXTOS COMPACT</div>
            <div className="text-[#32D583] font-bold text-base mt-0.5">90% Accuracy</div>
            <div className="text-[#A7ADB8] text-[11px]">Tokens: 4,204 (-93.6%)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
