'use client';

import React from 'react';
import Link from 'next/link';
import ResearchWarning from '../components/ui/ResearchWarning';
import PipelineDiagram from '../components/architecture/PipelineDiagram';
import MetricCard from '../components/ui/MetricCard';
import Button from '../components/ui/Button';

export default function OverviewPage() {
  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="border-b border-[#232731] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 font-mono text-xs mb-1">
            <span className="w-2 h-2 rounded-full bg-[#7C5CFC]" />
            <span className="text-[#7C5CFC] font-bold tracking-wider uppercase">CONTEXTOS</span>
            <span className="text-[#6B7280]">| Agent Memory Evaluation Laboratory</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#F5F7FA] tracking-tight">
            Evaluate how retrieval and context composition affect agent decisions.
          </h1>
          <p className="text-[#A7ADB8] text-sm mt-1 max-w-3xl leading-relaxed">
            ContextOS evaluates structural failure modes that conventional RAG systems miss, including temporal state overrides, memory decay, entity ambiguity, and prompt bloat context composition.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/benchmarks">
            <Button variant="primary">RUN BENCHMARK</Button>
          </Link>
          <Link href="/evaluations/1247">
            <Button variant="secondary">VIEW EVALUATION</Button>
          </Link>
          <Link href="/architecture">
            <Button variant="outline">VIEW ARCHITECTURE</Button>
          </Link>
        </div>
      </div>

      {/* Research Status Banner */}
      <ResearchWarning message="Low-resource validation (n=10 scenarios). Not statistically sufficient to establish general performance across arbitrary enterprise workloads." />

      {/* Key Research Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard value="90%" label="ContextOS Compact Accuracy" variant="success" />
        <MetricCard value="93.6%" label="Input-Token Reduction" variant="accent" sublabel="vs ContextOS Full" />
        <MetricCard value="0%" label="Hallucination Rate" variant="success" />
        <MetricCard value="133" label="Subsystem Unit Tests" variant="default" sublabel="Passing" />
      </div>

      {/* Research Finding */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#7C5CFC]/30 space-y-4 font-mono text-xs">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#7C5CFC] uppercase tracking-wider">CANONICAL RESEARCH FINDING</span>
          <span className="text-[#A7ADB8]">OpenRouter API (n=10, Seed 42)</span>
        </div>

        <div className="space-y-3 font-sans">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#F97066]">Baseline RAG</span>
              <span className="text-[#F97066] font-bold">50% Accuracy (2,441 tokens)</span>
            </div>
            <div className="w-full bg-[#0D0F12] h-3 rounded overflow-hidden border border-[#232731]">
              <div className="bg-[#F97066] h-full w-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#32D583]">ContextOS Compact</span>
              <span className="text-[#32D583] font-bold">90% Accuracy (4,204 tokens)</span>
            </div>
            <div className="w-full bg-[#0D0F12] h-3 rounded overflow-hidden border border-[#232731]">
              <div className="bg-[#32D583] h-full w-[90%]" />
            </div>
          </div>
        </div>

        <div className="p-3 rounded bg-[#0D0F12] border border-[#232731] text-[#A7ADB8] text-xs font-sans">
          Full ContextOS exposed a severe context-bloat problem (65,424 tokens at 50% accuracy). Decision-Grade Context Compiler reduced the context payload by 93.6% while reaching 90% accuracy.
        </div>
      </div>

      {/* Architecture Preview */}
      <PipelineDiagram />

      {/* Recent Representative Evaluation */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-4">
        <div className="flex justify-between items-center font-mono">
          <span className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">REPRESENTATIVE EVALUATION TRACE</span>
          <Link href="/evaluations/1247" className="text-xs text-[#7C5CFC] hover:underline font-bold">
            Inspect Full Trace #1247 →
          </Link>
        </div>

        <Link
          href="/evaluations/1247"
          className="p-4 rounded-lg bg-[#171A20] border border-[#232731] hover:border-[#7C5CFC]/50 block space-y-3 transition-colors group"
        >
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#7C5CFC] font-bold group-hover:underline">#1247</span>
            <span className="px-2 py-0.5 rounded bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/20 text-[10px]">
              TEMPORAL CONFLICT
            </span>
          </div>

          <div className="text-sm font-semibold text-[#F5F7FA]">
            "Should we follow up with Initech regarding Project #1001?"
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono border-t border-[#232731] pt-3">
            <div>
              <span className="text-[#6B7280] block text-[10px]">BASELINE RAG:</span>
              <span className="text-[#F97066] font-bold">WAIT ✕ (Selected Day 10 Hold)</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[10px]">CONTEXTOS COMPACT:</span>
              <span className="text-[#32D583] font-bold">CONTACT ✓ (Day 14 Clearance)</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
