'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FailureSummary from '../../components/failures/FailureSummary';
import FailureDistribution from '../../components/failures/FailureDistribution';
import FailureCard from '../../components/failures/FailureCard';

interface FailureClassDetail {
  id: string;
  key: string;
  name: string;
  count: number;
  explanation: string;
  cases: Array<{
    id: string;
    query: string;
    expected: string;
    baseline: string;
    contextos: string;
    rootCause: string;
  }>;
}

const FAILURE_CLASSES: FailureClassDetail[] = [
  {
    id: 'temporal',
    key: 'TEMPORAL RETRIEVAL',
    name: 'Temporal Retrieval Failure',
    count: 200,
    explanation: 'Selected outdated Day 1 hold notices over Day 30 legal clearances due to BM25 text similarity with query words.',
    cases: [
      {
        id: 'scen_1',
        query: 'Is outreach to Initech regarding Project #1001 currently authorized as of 2026-01-14?',
        expected: 'Yes, legal audit cleared for Initech Project #1001 on 2026-01-14.',
        baseline: 'PROHIBITED ✕ (Selected Day 10 hold note)',
        contextos: 'AUTHORIZED ✓ (Day 14 clearance valid)',
        rootCause: 'Baseline BM25 selected the earlier hold notice note. ContextOS Temporal Resolver identified Day 14 Slack update as superseding.'
      }
    ]
  },
  {
    id: 'memory',
    key: 'MEMORY DECAY',
    name: 'Memory Decay Failure',
    count: 150,
    explanation: 'Dropped crucial vault PINs or credentials introduced early (Day 1) and queried late (Day 60) due to recency decay bias.',
    cases: [
      {
        id: 'scen_601',
        query: 'What is the security bypass code for Acme Server Vault #101 stored on 2026-01-01?',
        expected: 'The security bypass code for Acme Server Vault #101 is 1007-AB.',
        baseline: 'UNAVAILABLE ✕ (Dropped from top-K)',
        contextos: '1007-AB RETAINED ✓',
        rootCause: 'Baseline RAG dropped early Day 1 notes due to recency bias. ContextOS Memory Ranker enforced Importance + Relevance > Recency.'
      }
    ]
  },
  {
    id: 'entity',
    key: 'ENTITY RESOLUTION',
    name: 'Entity Resolution Failure',
    count: 200,
    explanation: 'Conflated individuals sharing similar names, roles, or departments across disparate communications.',
    cases: [
      {
        id: 'scen_201',
        query: 'Which John Smith holds the role of VP Sales in Executive Sales for Project #1001?',
        expected: 'John Smith (john.smith@acme.com) is the VP of Sales in Executive Sales.',
        baseline: 'CONFLATED ROLES ✕',
        contextos: 'DISAMBIGUATED (p_1 MATCH) ✓',
        rootCause: 'Baseline RAG retrieved documents for both John Smith individuals without role scoring. ContextOS Entity Resolver matched VP Sales and Executive Sales attributes.'
      }
    ]
  },
  {
    id: 'multihop',
    key: 'MULTI-HOP RELATIONSHIP',
    name: 'Multi-Hop Relationship Failure',
    count: 200,
    explanation: 'Failed multi-step graph path connections linking entity owners to project decisions and meeting syncs.',
    cases: [
      {
        id: 'scen_401',
        query: 'What ARR contract value was finalized in the meeting for Project #1001?',
        expected: 'John Smith finalized a $150k ARR contract for Project #1001 with David Wilson.',
        baseline: 'CONTRACT VALUE MISSING ✕',
        contextos: '$150k ARR EXTRACTED ✓',
        rootCause: 'Baseline BM25 retrieved general project metadata without linking meeting participant notes. ContextOS Context Graph traversed Person -> Project -> Meeting.'
      }
    ]
  },
  {
    id: 'conflict',
    key: 'CONTRADICTION / CONFLICT',
    name: 'Channel Contradiction',
    count: 150,
    explanation: 'Selected informal email quotes over formal CRM finance approvals due to lack of source authority ranking.',
    cases: [
      {
        id: 'scen_751',
        query: 'Is Project #1001 approved by finance as of 2026-01-14?',
        expected: 'Yes, finance approved Project #1001 at $150k on 2026-01-14.',
        baseline: 'REJECTED ✕ (Selected early email)',
        contextos: 'APPROVED ✓ (Slack resolution)',
        rootCause: 'Baseline RAG selected the earlier rejection email. ContextOS Context Compiler applied source authority rules and superseding state resolution.'
      }
    ]
  },
  {
    id: 'composition',
    key: 'CONTEXT COMPOSITION',
    name: 'Context Composition Failure',
    count: 100,
    explanation: 'Raw context bloat (65k+ tokens) overloaded LLM context windows, causing response degradation or truncation.',
    cases: [
      {
        id: 'scen_2',
        query: 'What is the current legal hold status for Acme Corp?',
        expected: 'Legal hold cleared on 2026-03-04.',
        baseline: 'HOLD ACTIVE ✕',
        contextos: 'LEGAL HOLD CLEARED ✓ (-93.6% tokens)',
        rootCause: 'ContextOS Full mode supplied 65,424 tokens of raw uncompiled context. ContextOS Compact mode reduced tokens by 93.6% to 4,204 tokens.'
      }
    ]
  },
  {
    id: 'hallucination',
    key: 'HALLUCINATION',
    name: 'Ungrounded Hallucination',
    count: 100,
    explanation: 'Invented non-existent acquisition terms or discount rates when workspace context was absent.',
    cases: [
      {
        id: 'scen_901',
        query: 'What is the unannounced Q1 confidential discount percentage promised to Acme Corp for Project #1001?',
        expected: 'I do not have enough information in the workspace context to answer this.',
        baseline: 'FABRICATED 20% ✕',
        contextos: 'DECLINED (INSUFFICIENT) ✓',
        rootCause: 'Baseline RAG forced an answer over irrelevant evidence. ContextOS Context Compiler assigned INSUFFICIENT answerability state before LLM generation.'
      }
    ]
  }
];

export default function FailureAnalysisPage() {
  const [selectedClass, setSelectedClass] = useState<FailureClassDetail>(FAILURE_CLASSES[0]);

  return (
    <div className="space-y-8 font-sans text-[#F5F7FA]">
      {/* Header */}
      <div className="border-b border-[#232731] pb-6 flex justify-between items-start font-mono">
        <div>
          <h1 className="text-2xl font-semibold text-[#F5F7FA] tracking-tight">Failure Analysis</h1>
          <p className="text-sm text-[#A7ADB8] mt-1 font-sans">
            Where agent context pipelines break.
          </p>
        </div>
        <Link
          href="/"
          className="px-3 py-1.5 rounded-md bg-[#111318] border border-[#232731] text-xs text-[#A7ADB8] hover:text-[#F5F7FA] transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* Top Metrics */}
      <FailureSummary />

      {/* Failure Distribution */}
      <FailureDistribution />

      {/* Failure Classes Grid */}
      <div className="space-y-4 font-mono text-xs">
        <div className="text-[#6B7280] font-bold uppercase tracking-wider">DIAGNOSTIC FAILURE CLASSES</div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FAILURE_CLASSES.map((fc) => (
            <FailureCard
              key={fc.id}
              keyTag={fc.key}
              name={fc.name}
              count={fc.count}
              explanation={fc.explanation}
              isSelected={selectedClass.id === fc.id}
              onClick={() => setSelectedClass(fc)}
            />
          ))}
        </div>
      </div>

      {/* Selected Failure Class Case Study */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#7C5CFC]/40 space-y-6">
        <div className="flex justify-between items-center border-b border-[#232731] pb-4 font-mono text-xs">
          <div>
            <span className="text-[#7C5CFC] font-bold">REPRESENTATIVE CASES: {selectedClass.name}</span>
            <div className="text-[#A7ADB8] font-sans text-xs mt-0.5">{selectedClass.explanation}</div>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#F97066]/10 text-[#F97066] border border-[#F97066]/20 font-bold">
            HUMAN-READABLE DIAGNOSIS
          </span>
        </div>

        <div className="space-y-6 font-mono text-xs">
          {selectedClass.cases.map((c) => (
            <div key={c.id} className="p-5 rounded-lg bg-[#171A20] border border-[#232731] space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#7C5CFC]">{c.id}</span>
                <span className="text-[#A7ADB8]">{selectedClass.key}</span>
              </div>

              <div className="space-y-1 font-sans">
                <span className="font-mono text-[10px] text-[#6B7280] uppercase font-bold block">SCENARIO QUERY</span>
                <div className="text-base font-semibold text-[#F5F7FA]">"{c.query}"</div>
                <div className="text-xs text-[#A7ADB8] font-mono mt-1">
                  Expected: <span className="text-[#32D583] font-bold">{c.expected}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded bg-[#111318] border border-[#F97066]/40 space-y-1">
                  <div className="text-[#F97066] font-bold text-[11px]">OBSERVED BASELINE RESULT</div>
                  <div className="text-[#F97066]">{c.baseline}</div>
                </div>

                <div className="p-3.5 rounded bg-[#111318] border border-[#32D583]/40 space-y-1">
                  <div className="text-[#32D583] font-bold text-[11px]">CONTEXTOS COMPACT RESULT</div>
                  <div className="text-[#32D583]">{c.contextos}</div>
                </div>
              </div>

              <div className="p-3.5 rounded bg-[#111318] border border-[#232731] text-xs font-sans space-y-1">
                <span className="font-mono text-[10px] font-bold text-[#7C5CFC] uppercase block">DIAGNOSTIC ROOT CAUSE</span>
                <p className="text-[#A7ADB8] text-xs leading-relaxed">{c.rootCause}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
