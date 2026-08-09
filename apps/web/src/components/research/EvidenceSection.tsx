'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileCheck, FlaskConical, Hash } from 'lucide-react';
import Button from '../ui/Button';

export default function EvidenceSection() {
  return (
    <div className="space-y-4 font-sans">
      <div className="border-b border-[#232731] pb-3">
        <h2 className="text-xl font-semibold text-[#F5F7FA] tracking-tight">Evidence, Not Just a Demo</h2>
        <p className="text-xs text-[#A7ADB8] mt-0.5">
          ContextOS is backed by reproducible unit tests, deterministic benchmarks, and a controlled real-LLM validation experiment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Tests */}
        <div className="p-5 rounded-lg bg-[#111318] border border-[#232731] flex flex-col justify-between space-y-3 font-mono">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[#32D583]">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-bold">✓ PASSING</span>
            </div>
            <div className="text-2xl font-bold text-[#F5F7FA]">133</div>
            <div className="text-xs text-[#A7ADB8] font-sans">Automated Subsystem Tests</div>
            <p className="text-[11px] text-[#6B7280] font-sans leading-relaxed pt-1">
              All ContextOS subsystem tests passing offline without API key requirements.
            </p>
          </div>
          <Link href="/reproducibility" className="pt-2">
            <Button variant="secondary" size="sm" className="w-full">
              View Tests →
            </Button>
          </Link>
        </div>

        {/* Card 2: 1000 Scenarios */}
        <div className="p-5 rounded-lg bg-[#111318] border border-[#232731] flex flex-col justify-between space-y-3 font-mono">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[#4F8CFF]">
              <FileCheck className="w-5 h-5" />
              <span className="text-[10px] font-bold">DETERMINISTIC</span>
            </div>
            <div className="text-2xl font-bold text-[#F5F7FA]">1,000</div>
            <div className="text-xs text-[#A7ADB8] font-sans">Deterministic Scenarios</div>
            <p className="text-[11px] text-[#6B7280] font-sans leading-relaxed pt-1">
              Reproducible offline regression benchmark using Dataset v1.
            </p>
          </div>
          <Link href="/benchmarks" className="pt-2">
            <Button variant="secondary" size="sm" className="w-full">
              View Benchmark →
            </Button>
          </Link>
        </div>

        {/* Card 3: 10 Real LLM */}
        <div className="p-5 rounded-lg bg-[#111318] border border-[#7C5CFC]/40 flex flex-col justify-between space-y-3 font-mono">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[#7C5CFC]">
              <FlaskConical className="w-5 h-5" />
              <span className="text-[10px] font-bold">REAL LLM</span>
            </div>
            <div className="text-2xl font-bold text-[#F5F7FA]">10</div>
            <div className="text-xs text-[#A7ADB8] font-sans">Real LLM Scenarios</div>
            <p className="text-[11px] text-[#6B7280] font-sans leading-relaxed pt-1">
              Controlled OpenRouter validation (nemotron-3-ultra-550b).
            </p>
          </div>
          <Link href="/benchmarks" className="pt-2">
            <Button variant="primary" size="sm" className="w-full">
              View Results →
            </Button>
          </Link>
        </div>

        {/* Card 4: SHA256 */}
        <div className="p-5 rounded-lg bg-[#111318] border border-[#232731] flex flex-col justify-between space-y-3 font-mono">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[#32D583]">
              <Hash className="w-5 h-5" />
              <span className="text-[10px] font-bold">VERIFIED</span>
            </div>
            <div className="text-xs font-bold text-[#32D583] break-all font-mono">
              2ba27191...12fa
            </div>
            <div className="text-xs text-[#A7ADB8] font-sans">Dataset v1 SHA256 Hash</div>
            <p className="text-[11px] text-[#6B7280] font-sans leading-relaxed pt-1">
              Dataset v1 SHA256 hash verified against frozen benchmark specification.
            </p>
          </div>
          <Link href="/reproducibility" className="pt-2">
            <Button variant="secondary" size="sm" className="w-full">
              Verify Dataset →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
