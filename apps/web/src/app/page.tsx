'use client';

import React from 'react';
import Link from 'next/link';
import PipelineDiagram from '../components/architecture/PipelineDiagram';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import InteractiveDemoPlayground from '../components/research/InteractiveDemoPlayground';
import TryYourOwnContext from '../components/research/TryYourOwnContext';
import SimpleHowItWorks from '../components/research/SimpleHowItWorks';
import EvidenceSection from '../components/research/EvidenceSection';
import HowCanIVerifyIt from '../components/research/HowCanIVerifyIt';
import TrustBoundaryPanel from '../components/research/TrustBoundaryPanel';
import ReproducibilityCTA from '../components/research/ReproducibilityCTA';

export default function OverviewPage() {
  return (
    <div className="space-y-12 font-sans pb-12">
      {/* 1. HERO */}
      <div className="border-b border-[#232731] pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#7C5CFC]" />
            <span className="text-[#7C5CFC] font-bold tracking-wider uppercase">CONTEXTOS</span>
            <span className="text-[#6B7280]">| Context Compilation for AI Agents</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#F5F7FA] tracking-tight max-w-4xl leading-tight">
            Turn messy memory into decision-ready context.
          </h1>
          <p className="text-[#A7ADB8] text-sm max-w-3xl leading-relaxed">
            ContextOS evaluates structural failure modes that conventional RAG systems miss, including temporal state overrides, memory decay, entity ambiguity, and prompt bloat context composition.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#demo-playground">
              <Button variant="primary">TRY THE DEMO ↓</Button>
            </a>
            <a href="#try-your-own">
              <Button variant="secondary">TRY YOUR OWN CONTEXT ↓</Button>
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/benchmarks">
            <Button variant="outline">BENCHMARKS</Button>
          </Link>
          <Link href="/architecture">
            <Button variant="outline">ARCHITECTURE</Button>
          </Link>
        </div>
      </div>

      {/* 2. RESEARCH STATUS BAR */}
      <div className="p-4 rounded-lg bg-[#111318] border border-[#232731] flex flex-col md:flex-row justify-between items-start md:items-center gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-[#7C5CFC] uppercase tracking-wider">RESEARCH STATUS</span>
          <span className="text-[#6B7280]">|</span>
          <span className="text-[#F5F7FA]">Phase 3.2 (Low-Resource Real-LLM Validation)</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <Badge variant="success">Dataset v1 ✓</Badge>
          <Badge variant="success">133 tests ✓</Badge>
          <Badge variant="warning">n=10 real LLM ⚠</Badge>
          <Badge variant="purple">Statistical generalization: NOT ESTABLISHED</Badge>
        </div>
      </div>

      {/* 3. INTERACTIVE DEMO PLAYGROUND */}
      <div id="demo-playground">
        <InteractiveDemoPlayground />
      </div>

      {/* 4. TRY YOUR OWN CONTEXT */}
      <TryYourOwnContext />

      {/* 5. EVIDENCE, NOT JUST A DEMO */}
      <EvidenceSection />

      {/* 6. THE RESEARCH FINDING */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#7C5CFC]/30 space-y-4 font-mono text-xs">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#7C5CFC] uppercase tracking-wider">CANONICAL RESEARCH FINDING</span>
          <span className="text-[#A7ADB8]">OpenRouter API (n=10, Seed 42)</span>
        </div>

        <div className="space-y-3 font-sans">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#F97066]">Baseline RAG</span>
              <span className="text-[#F97066] font-bold">50% Accuracy (5/10) | 2,441 tokens</span>
            </div>
            <div className="w-full bg-[#0D0F12] h-3 rounded overflow-hidden border border-[#232731]">
              <div className="bg-[#F97066] h-full w-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#F5B942]">ContextOS Full (Context Bloat)</span>
              <span className="text-[#F5B942] font-bold">50% Accuracy (5/10) | 65,424 tokens</span>
            </div>
            <div className="w-full bg-[#0D0F12] h-3 rounded overflow-hidden border border-[#232731]">
              <div className="bg-[#F5B942] h-full w-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#32D583]">ContextOS Compact (Decision-Grade)</span>
              <span className="text-[#32D583] font-bold">90% Accuracy (9/10) | 4,204 tokens (-93.6% vs Full)</span>
            </div>
            <div className="w-full bg-[#0D0F12] h-3 rounded overflow-hidden border border-[#232731]">
              <div className="bg-[#32D583] h-full w-[90%]" />
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded bg-[#0D0F12] border border-[#232731] text-[#A7ADB8] text-xs font-sans leading-relaxed">
          Full ContextOS exposed a severe context-bloat problem (65,424 tokens at 50% accuracy). Decision-Grade Context Compiler reduced the context payload by 93.6% while reaching 90% accuracy in this n=10 validation.
        </div>
      </div>

      {/* 7. HOW CONTEXTOS WORKS */}
      <SimpleHowItWorks />

      {/* 8. ARCHITECTURE PIPELINE */}
      <PipelineDiagram />

      {/* 9. WHAT IT PROVES / DOESN'T PROVE */}
      <TrustBoundaryPanel />

      {/* 10. HOW CAN I VERIFY IT? */}
      <HowCanIVerifyIt />

      {/* 11. FINAL REPRODUCIBILITY & GITHUB CTA */}
      <ReproducibilityCTA />
    </div>
  );
}
