'use client';

import React from 'react';
import Link from 'next/link';
import EvidenceCard from '../../../components/evaluation/EvidenceCard';
import Timeline from '../../../components/evaluation/Timeline';

interface EvidenceItem {
  source: string;
  timestamp: string;
  entity: string;
  relevance: string;
  content: string;
  status: 'WINNING' | 'SUPERSEDED' | 'IRRELEVANT';
}

const EVIDENCE_CARDS: EvidenceItem[] = [
  {
    source: 'SLACK',
    timestamp: '2026-01-14 14:00:00',
    entity: 'Initech (comp_4)',
    relevance: 'High (0.95)',
    content: 'UPDATE: Legal audit cleared for Initech Project #1001. You are authorized to resume outreach.',
    status: 'WINNING'
  },
  {
    source: 'NOTE',
    timestamp: '2026-01-10 10:00:00',
    entity: 'Initech (comp_4)',
    relevance: 'High (0.91)',
    content: 'Hold notice: do not contact Initech regarding Project #1001 due to active legal audit.',
    status: 'SUPERSEDED'
  },
  {
    source: 'CRM',
    timestamp: '2026-01-01 09:00:00',
    entity: 'John Smith (p_1)',
    relevance: 'Medium (0.65)',
    content: 'Account manager: John Smith (VP Sales), Client: Initech, Status: Negotiation.',
    status: 'WINNING'
  }
];

export default function SignatureEvaluationPage() {
  return (
    <div className="space-y-8 font-sans">
      {/* Header & Category Badge */}
      <div className="border-b border-[#252A31] pb-6 flex justify-between items-start font-mono">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-[#F4F5F7] tracking-tight">EVALUATION #1247</h1>
            <span className="px-2.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 text-xs font-bold">
              TEMPORAL CONFLICT
            </span>
          </div>
          <p className="text-sm text-[#9BA3AF] mt-1 font-sans">
            "Should we follow up with Initech regarding Project #1001?"
          </p>
        </div>

        <Link
          href="/evaluations"
          className="px-4 py-2 rounded-lg bg-[#15181D] border border-[#252A31] text-xs font-mono text-[#9BA3AF] hover:text-[#F4F5F7] transition-colors"
        >
          ← Evaluations Browser
        </Link>
      </div>

      {/* TWO-COLUMN DECISION COMPARISON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* BASELINE RAG */}
        <div className="p-6 rounded-lg bg-[#111419] border border-[#EF4444]/40 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#9BA3AF] uppercase">BASELINE RAG</span>
            <span className="text-xs font-bold text-[#EF4444] px-2 py-0.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/20">
              FAILED ✕
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] text-[#66707D] uppercase">Agent Decision</div>
            <div className="text-2xl font-bold text-[#EF4444]">WAIT</div>
            <p className="text-xs text-[#9BA3AF] font-sans mt-1">
              Selected outdated Day 10 hold notice note due to BM25 text similarity with "legal hold".
            </p>
          </div>

          <div className="pt-3 border-t border-[#252A31] flex justify-between text-[#9BA3AF]">
            <span>Tokens: 248</span>
            <span>Latency: 4.33s</span>
          </div>
        </div>

        {/* CONTEXTOS COMPACT */}
        <div className="p-6 rounded-lg bg-[#111419] border border-[#22C55E]/50 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#7C5CFC] uppercase">CONTEXTOS COMPACT</span>
            <span className="text-xs font-bold text-[#22C55E] px-2 py-0.5 rounded bg-[#22C55E]/10 border border-[#22C55E]/20">
              PASSED ✓
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] text-[#66707D] uppercase">Agent Decision</div>
            <div className="text-2xl font-bold text-[#22C55E]">CONTACT</div>
            <p className="text-xs text-[#9BA3AF] font-sans mt-1">
              Temporal state resolver identified Day 14 legal clearance as superseding earlier hold notice.
            </p>
          </div>

          <div className="pt-3 border-t border-[#252A31] flex justify-between text-[#9BA3AF]">
            <span>Tokens: 420</span>
            <span>Latency: 5.97s</span>
          </div>
        </div>
      </div>

      {/* CONTEXT TRACE SOURCE CARDS */}
      <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-4">
        <div className="flex justify-between items-center font-mono text-xs">
          <span className="font-bold text-[#F4F5F7] uppercase tracking-wider">CONTEXT TRACE SOURCE CARDS</span>
          <span className="text-[#66707D]">PROVENANCE EVIDENCE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EVIDENCE_CARDS.map((ev, i) => (
            <EvidenceCard
              key={i}
              source={ev.source}
              timestamp={ev.timestamp}
              entity={ev.entity}
              relevance={ev.relevance}
              content={ev.content}
              status={ev.status}
            />
          ))}
        </div>
      </div>

      {/* TIMELINE STATE TRANSITION */}
      <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-4 font-mono text-xs">
        <span className="font-bold text-[#F4F5F7] uppercase tracking-wider block">RECONSTRUCTED STATE TIMELINE</span>

        <Timeline
          events={[
            { date: 'Jan 10', label: 'LEGAL HOLD', source: 'Note m_1', status: 'error' },
            { date: 'Jan 14', label: 'LEGAL CLEARANCE', source: 'Slack m_2', status: 'success' },
            { date: 'CURRENT STATE', label: 'CONTACT PERMITTED', source: 'Valid As Of 2026-01-14', status: 'active' },
          ]}
        />
      </div>

      {/* ROOT CAUSE & WHY CONTEXTOS SUCCEEDED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* ROOT CAUSE */}
        <div className="p-6 rounded-lg bg-[#111419] border border-[#EF4444]/30 space-y-2 font-sans">
          <div className="font-mono text-[10px] font-bold text-[#EF4444] uppercase tracking-wider">ROOT CAUSE ANALYSIS</div>
          <div className="font-bold text-[#EF4444] font-mono text-sm">TEMPORAL RETRIEVAL FAILURE</div>
          <p className="text-[#9BA3AF] leading-relaxed">
            The Baseline RAG agent selected the earlier 2026-01-10 hold notice note due to high BM25 text similarity with "legal hold". Baseline RAG lacked temporal state resolution and failed to recognize that the 2026-01-14 Slack update superseded the earlier hold notice.
          </p>
        </div>

        {/* WHY CONTEXTOS SUCCEEDED */}
        <div className="p-6 rounded-lg bg-[#111419] border border-[#22C55E]/30 space-y-2 font-sans">
          <div className="font-mono text-[10px] font-bold text-[#22C55E] uppercase tracking-wider">WHY CONTEXTOS SUCCEEDED</div>
          <div className="font-bold text-[#22C55E] font-mono text-sm">TEMPORAL STATE + SOURCE AUTHORITY</div>
          <p className="text-[#9BA3AF] leading-relaxed">
            ContextOS Temporal Resolver calculated validity intervals and identified the Day 14 Slack update as superseding the Day 10 note. Decision-Grade Context Compiler formatted a compact evidence structure with provenance.
          </p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 font-mono text-xs pt-2">
        <Link
          href="/architecture"
          className="px-5 py-2.5 rounded-lg bg-[#7C5CFC] hover:bg-[#6b4bf0] text-white font-bold uppercase transition-colors"
        >
          VIEW CONTEXT GRAPH
        </Link>
        <Link
          href="/failures"
          className="px-5 py-2.5 rounded-lg bg-[#15181D] border border-[#252A31] hover:border-[#9BA3AF] text-[#F4F5F7] font-bold uppercase transition-colors"
        >
          REPLAY TIMELINE
        </Link>
      </div>
    </div>
  );
}
