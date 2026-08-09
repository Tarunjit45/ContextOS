'use client';

import React from 'react';
import Link from 'next/link';
import ResearchWarning from '../components/ui/ResearchWarning';

export default function OverviewPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="border-b border-[#252A31] pb-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 font-mono text-xs mb-1">
              <span className="w-2 h-2 rounded-full bg-[#7C5CFC]" />
              <span className="text-[#7C5CFC] font-bold tracking-widest uppercase">CONTEXTOS</span>
              <span className="text-[#66707D]">| Agent Memory Evaluation Lab</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#F4F5F7] tracking-tight">
              Evaluate how retrieval and context composition affect agent decisions.
            </h1>
          </div>

          <div className="flex items-center gap-3 font-mono shrink-0">
            <Link
              href="/benchmarks"
              className="px-4 py-2 rounded-lg bg-[#7C5CFC] hover:bg-[#6b4bf0] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              RUN BENCHMARK
            </Link>
            <Link
              href="/evaluations/1247"
              className="px-4 py-2 rounded-lg bg-[#15181D] border border-[#252A31] hover:border-[#7C5CFC]/50 text-[#F4F5F7] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              VIEW EVALUATION
            </Link>
            <Link
              href="/architecture"
              className="px-4 py-2 rounded-lg bg-[#111419] border border-[#252A31] hover:border-[#9BA3AF] text-[#9BA3AF] hover:text-[#F4F5F7] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              VIEW ARCHITECTURE
            </Link>
          </div>
        </div>

        <p className="text-[#9BA3AF] text-sm max-w-3xl leading-relaxed font-sans">
          ContextOS evaluates failure modes that conventional RAG systems can miss, including temporal state overrides, memory decay, entity ambiguity, contradictions across channels, and prompt bloat context composition.
        </p>
      </div>

      {/* COMPACT ARCHITECTURE PIPELINE NODES */}
      <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-4">
        <div className="flex justify-between items-center font-mono">
          <span className="text-xs font-bold text-[#F4F5F7] uppercase tracking-wider">CONTEXT COMPILER PIPELINE</span>
          <span className="text-[11px] text-[#66707D]">8 CONNECTED STAGES</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-center font-mono text-xs">
          {[
            { title: 'QUERY', desc: 'Input Query' },
            { title: 'HYBRID RETRIEVAL', desc: 'BM25 + Recency' },
            { title: 'ENTITY RESOLUTION', desc: 'Role Scoring' },
            { title: 'TEMPORAL STATE', desc: 'Valid Intervals' },
            { title: 'MEMORY RANKING', desc: 'Importance' },
            { title: 'CONTEXT GRAPH', desc: 'NetworkX Paths' },
            { title: 'CONTEXT COMPOSITION', desc: 'Budget Guard' },
            { title: 'LLM', desc: 'Compact Output' }
          ].map((stage, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#15181D] border border-[#252A31] flex flex-col justify-between space-y-1">
              <span className="text-[10px] text-[#7C5CFC] font-bold">0{idx + 1}</span>
              <span className="text-[11px] font-bold text-[#F4F5F7]">{stage.title}</span>
              <span className="text-[9px] text-[#66707D]">{stage.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RESEARCH SNAPSHOT (n=10) */}
      <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-5">
        <div className="flex justify-between items-center font-mono">
          <span className="text-xs font-bold text-[#F4F5F7] uppercase tracking-wider">RESEARCH SNAPSHOT</span>
          <span className="text-xs text-[#22C55E] font-bold bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
            OpenRouter API (n=10)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-lg bg-[#15181D] border border-[#22C55E]/30 space-y-1">
            <div className="text-3xl font-bold text-[#22C55E]">90%</div>
            <div className="text-xs text-[#9BA3AF] font-sans">ContextOS Compact accuracy</div>
          </div>

          <div className="p-5 rounded-lg bg-[#15181D] border border-[#EF4444]/30 space-y-1">
            <div className="text-3xl font-bold text-[#EF4444]">50%</div>
            <div className="text-xs text-[#9BA3AF] font-sans">Baseline RAG accuracy</div>
          </div>

          <div className="p-5 rounded-lg bg-[#15181D] border border-[#7C5CFC]/30 space-y-1">
            <div className="text-3xl font-bold text-[#7C5CFC]">93.6%</div>
            <div className="text-xs text-[#9BA3AF] font-sans">Input-token reduction vs ContextOS Full</div>
          </div>

          <div className="p-5 rounded-lg bg-[#15181D] border border-[#252A31] space-y-1">
            <div className="text-3xl font-bold text-[#F4F5F7]">n=10</div>
            <div className="text-xs text-[#9BA3AF] font-sans">Real LLM validation sample</div>
          </div>
        </div>

        <ResearchWarning message="Low-resource validation. Not statistically sufficient for generalization across arbitrary enterprise workloads." />
      </div>

      {/* WHY CONTEXTOS? THREE CARDS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#F4F5F7]">Why ContextOS?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-2">
            <div className="text-xs font-bold font-mono text-[#7C5CFC] uppercase tracking-wider">TEMPORAL STATE</div>
            <h3 className="text-base font-semibold text-[#F4F5F7]">Resolve Changing Information</h3>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              Track validity intervals to prioritize recent legal clearances or policy updates over outdated Day 1 hold notices.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-2">
            <div className="text-xs font-bold font-mono text-[#7C5CFC] uppercase tracking-wider">ENTITY RESOLUTION</div>
            <div className="text-base font-semibold text-[#F4F5F7]">Disambiguate Similar Entities</div>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              Distinguish individuals sharing names across channels (e.g. John Smith VP Sales vs John Smith Jr. Sales Associate).
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-2">
            <div className="text-xs font-bold font-mono text-[#7C5CFC] uppercase tracking-wider">CONTEXT COMPOSITION</div>
            <div className="text-base font-semibold text-[#F4F5F7]">Compact Decision Context</div>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              Convert large retrieved context dumps into decision-relevant structured evidence, cutting token bloat by 93.6%.
            </p>
          </div>
        </div>
      </div>

      {/* LATEST EVALUATION TRACE */}
      <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-4">
        <div className="flex justify-between items-center font-mono">
          <span className="text-xs font-bold text-[#F4F5F7] uppercase tracking-wider">REPRESENTATIVE EVALUATION TRACE</span>
          <Link href="/evaluations/1247" className="text-xs text-[#7C5CFC] hover:underline font-bold">
            Inspect Full Trace #1247 →
          </Link>
        </div>

        <Link
          href="/evaluations/1247"
          className="p-4 rounded-lg bg-[#15181D] border border-[#252A31] hover:border-[#7C5CFC]/50 block space-y-3 transition-colors group"
        >
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#7C5CFC] font-bold group-hover:underline">#1247</span>
            <span className="px-2 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 text-[10px]">
              TEMPORAL CONFLICT
            </span>
          </div>

          <div className="text-sm font-semibold text-[#F4F5F7]">
            "Should we follow up with Initech regarding Project #1001?"
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono border-t border-[#252A31] pt-3">
            <div>
              <span className="text-[#66707D] block text-[10px]">BASELINE RAG:</span>
              <span className="text-[#EF4444] font-bold">WAIT ✕ (Selected Day 10 Hold)</span>
            </div>
            <div>
              <span className="text-[#66707D] block text-[10px]">CONTEXTOS COMPACT:</span>
              <span className="text-[#22C55E] font-bold">CONTACT ✓ (Day 14 Clearance)</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
