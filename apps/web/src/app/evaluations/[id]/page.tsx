'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DecisionComparison from '../../../components/evaluation/DecisionComparison';
import EvidenceCard from '../../../components/evaluation/EvidenceCard';
import Timeline from '../../../components/evaluation/Timeline';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

export default function SignatureEvaluationDetailPage() {
  const [showRawTrace, setShowRawTrace] = useState(false);

  const rawTraceJson = JSON.stringify(
    {
      scenario_id: 'scen_1',
      evaluation_id: 1247,
      category: 'temporal_conflict',
      query: 'Should we follow up with Initech regarding Project #1001?',
      expected_answer: 'Yes, legal audit cleared for Initech Project #1001 on 2026-01-14.',
      baseline_rag: {
        decision: 'WAIT',
        status: 'FAILED',
        selected_evidence_id: 'm_1',
        token_count: 248,
        latency_ms: 4330,
      },
      contextos_compact: {
        decision: 'CONTACT',
        status: 'PASSED',
        selected_evidence_ids: ['m_2', 'p_1'],
        token_count: 420,
        latency_ms: 5965,
        temporal_intervals: [
          { entity: 'Initech', attribute: 'legal_status', valid_from: '2026-01-14', status: 'CLEARED' },
        ],
      },
    },
    null,
    2
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Back Link & Header */}
      <div className="border-b border-[#232731] pb-6 space-y-3">
        <Link
          href="/evaluations"
          className="text-xs font-mono text-[#A7ADB8] hover:text-[#F5F7FA] transition-colors"
        >
          ← Evaluations Browser
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#F5F7FA] tracking-tight">Evaluation #1247</h1>
            <Badge variant="success">PASSED ✓</Badge>
            <Badge variant="warning">Temporal Conflict</Badge>
          </div>

          <div className="flex gap-2">
            <Link href="/architecture">
              <Button variant="secondary" size="sm">VIEW CONTEXT GRAPH</Button>
            </Link>
            <Link href="/failures">
              <Button variant="outline" size="sm">REPLAY TIMELINE</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Query */}
      <div className="p-5 rounded-lg bg-[#111318] border border-[#232731] space-y-1">
        <div className="font-mono text-[10px] text-[#6B7280] uppercase font-bold">SCENARIO QUERY</div>
        <div className="text-lg font-semibold text-[#F5F7FA]">
          "Should we follow up with Initech regarding Project #1001?"
        </div>
        <div className="text-xs text-[#A7ADB8] font-mono mt-1">
          Ground Truth Answer: <span className="text-[#32D583] font-bold">"Yes, legal audit cleared for Initech Project #1001 on 2026-01-14 and outreach is authorized."</span>
        </div>
      </div>

      {/* Decision Comparison */}
      <DecisionComparison
        baselineDecision="WAIT"
        baselineExplanation="Selected outdated Day 10 hold notice note due to high BM25 text similarity with 'legal hold'."
        baselineTokens={248}
        baselineLatency="4.33s"
        contextosDecision="CONTACT"
        contextosExplanation="Temporal state resolver identified Day 14 legal clearance as superseding earlier hold notice."
        contextosTokens={420}
        contextosLatency="5.97s"
      />

      {/* Context Evidence Cards */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-4">
        <div className="flex justify-between items-center font-mono text-xs">
          <span className="font-bold text-[#F5F7FA] uppercase tracking-wider">RETRIEVED CONTEXT PROVENANCE</span>
          <span className="text-[#6B7280]">EVIDENCE SOURCE CARDS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EvidenceCard
            source="SLACK"
            timestamp="2026-01-14 14:00:00"
            entity="Initech (comp_4)"
            relevance="High (0.95)"
            content="UPDATE: Legal audit cleared for Initech Project #1001. You are authorized to resume outreach."
            status="WINNING"
          />
          <EvidenceCard
            source="NOTE"
            timestamp="2026-01-10 10:00:00"
            entity="Initech (comp_4)"
            relevance="High (0.91)"
            content="Hold notice: do not contact Initech regarding Project #1001 due to active legal audit."
            status="SUPERSEDED"
          />
          <EvidenceCard
            source="CRM"
            timestamp="2026-01-01 09:00:00"
            entity="John Smith (p_1)"
            relevance="Medium (0.65)"
            content="Account manager: John Smith (VP Sales), Client: Initech, Status: Negotiation."
            status="WINNING"
          />
        </div>
      </div>

      {/* Timeline State Transition */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-4 font-mono text-xs">
        <span className="font-bold text-[#F5F7FA] uppercase tracking-wider block">RECONSTRUCTED STATE TIMELINE</span>

        <Timeline
          events={[
            { date: 'Jan 10', label: 'LEGAL HOLD', source: 'Note m_1', status: 'error' },
            { date: 'Jan 14', label: 'LEGAL CLEARANCE', source: 'Slack m_2', status: 'success' },
            { date: 'CURRENT STATE', label: 'CONTACT PERMITTED', source: 'Valid As Of 2026-01-14', status: 'active' },
          ]}
        />
      </div>

      {/* ContextOS Reasoning & Root Cause Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="p-6 rounded-lg bg-[#111318] border border-[#F97066]/30 space-y-2 font-sans">
          <div className="font-mono text-[10px] font-bold text-[#F97066] uppercase tracking-wider">ROOT CAUSE ANALYSIS</div>
          <div className="font-bold text-[#F97066] font-mono text-sm">TEMPORAL RETRIEVAL FAILURE</div>
          <p className="text-[#A7ADB8] leading-relaxed">
            The Baseline RAG agent selected the earlier 2026-01-10 hold notice note due to high BM25 text similarity with "legal hold". Baseline RAG lacked temporal state resolution and failed to recognize that the 2026-01-14 Slack update superseded the earlier hold notice.
          </p>
        </div>

        <div className="p-6 rounded-lg bg-[#111318] border border-[#32D583]/30 space-y-2 font-sans">
          <div className="font-mono text-[10px] font-bold text-[#32D583] uppercase tracking-wider">CONTEXTOS REASONING</div>
          <div className="font-bold text-[#32D583] font-mono text-sm">TEMPORAL STATE + SOURCE AUTHORITY</div>
          <p className="text-[#A7ADB8] leading-relaxed">
            ContextOS Temporal Resolver calculated validity intervals and identified the Day 14 Slack update as superseding the Day 10 note. Decision-Grade Context Compiler formatted a compact evidence structure with provenance.
          </p>
        </div>
      </div>

      {/* Collapsible Raw Trace Section */}
      <div className="border-t border-[#232731] pt-4">
        <button
          onClick={() => setShowRawTrace(!showRawTrace)}
          className="text-xs font-mono text-[#A7ADB8] hover:text-[#F5F7FA] transition-colors flex items-center gap-2"
        >
          <span>{showRawTrace ? '[-] Hide Raw Benchmark Trace JSON' : '[+] Expand Raw Benchmark Trace JSON'}</span>
        </button>

        {showRawTrace && (
          <pre className="mt-3 p-4 rounded-lg bg-[#0D0F12] border border-[#232731] text-[#32D583] font-mono text-[11px] overflow-x-auto">
            {rawTraceJson}
          </pre>
        )}
      </div>
    </div>
  );
}
