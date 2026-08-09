'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FailureCase {
  id: string;
  category_key: string;
  category_name: string;
  query: string;
  expected_answer: string;
  baseline_decision: string;
  baseline_answer: string;
  baseline_passed: boolean;
  contextos_decision: string;
  contextos_answer: string;
  contextos_passed: boolean;
  evidence_selected: string[];
  evidence_superseded: string[];
  root_cause_stage: string;
  root_cause_explanation: string;
}

const FAILURE_CATEGORIES = [
  { id: 'temporal', name: 'Temporal Retrieval Failure', count: 200 },
  { id: 'entity', name: 'Entity Resolution Failure', count: 200 },
  { id: 'multihop', name: 'Multi-Hop Relationship Failure', count: 200 },
  { id: 'memory', name: 'Memory Failure', count: 150 },
  { id: 'conflict', name: 'Contradiction / Conflict', count: 150 },
  { id: 'composition', name: 'Context Composition Failure', count: 100 },
  { id: 'hallucination', name: 'Hallucination / Missing Information', count: 100 }
];

const REPRESENTATIVE_CASES: FailureCase[] = [
  {
    id: 'scen_1',
    category_key: 'temporal',
    category_name: 'Temporal Retrieval Failure',
    query: 'Is outreach to Initech regarding Project #1001 currently authorized as of 2026-01-14?',
    expected_answer: 'Yes, legal audit cleared for Initech Project #1001 on 2026-01-14 and outreach is authorized.',
    baseline_decision: 'PROHIBITED (HOLD ACTIVE)',
    baseline_answer: 'No, outreach is currently prohibited due to active legal audit hold.',
    baseline_passed: false,
    contextos_decision: 'AUTHORIZED (CLEARANCE VALID)',
    contextos_answer: 'Yes, outreach to Initech regarding Project #1001 is authorized as legal audit cleared on 2026-01-14.',
    contextos_passed: true,
    evidence_selected: ['[SLACK 2026-01-14 | ID: m_2] UPDATE: Legal audit cleared for Initech Project #1001.'],
    evidence_superseded: ['[NOTE 2026-01-10 | ID: m_1] Hold notice: do not contact Initech due to legal audit.'],
    root_cause_stage: 'STAGE 3: TEMPORAL_FAILURE',
    root_cause_explanation: 'Baseline BM25 selected the earlier hold notice note due to high lexical similarity with "legal hold". ContextOS Temporal State Resolver correctly identified the Day 14 Slack update as superseding the Day 10 hold notice.'
  },
  {
    id: 'scen_201',
    category_key: 'entity',
    category_name: 'Entity Resolution Failure',
    query: 'Which John Smith holds the role of VP Sales in Executive Sales for Project #1001?',
    expected_answer: 'John Smith (john.smith@acme.com) is the VP of Sales in Executive Sales, whereas John Smith Jr. (john.jr@acme.com) is the Sales Associate.',
    baseline_decision: 'CONFLATED ROLES',
    baseline_answer: 'John Smith is in the Sales department.',
    baseline_passed: false,
    contextos_decision: 'DISAMBIGUATED (p_1 MATCH)',
    contextos_answer: 'John Smith (john.smith@acme.com, VP Sales) is the senior executive in Executive Sales.',
    contextos_passed: true,
    evidence_selected: ['[CRM | ID: p_1] John Smith, john.smith@acme.com, VP Sales, Dept: Executive Sales'],
    evidence_superseded: ['[EMAIL | ID: p_2] John Smith Jr., john.jr@acme.com, Sales Associate, Dept: Field Sales'],
    root_cause_stage: 'STAGE 4: ENTITY_RESOLUTION_FAILURE',
    root_cause_explanation: 'Baseline RAG retrieved documents for both John Smith individuals without role scoring. ContextOS Candidate-Scored Entity Resolver matched VP Sales and Executive Sales attributes with delta score > 0.15.'
  },
  {
    id: 'scen_401',
    category_key: 'multihop',
    category_name: 'Multi-Hop Relationship Failure',
    query: 'What ARR contract value was finalized in the meeting for Project #1001?',
    expected_answer: 'John Smith finalized a $150k ARR contract for Project #1001 with David Wilson.',
    baseline_decision: 'CONTRACT VALUE MISSING',
    baseline_answer: 'Project #1001 status is active.',
    baseline_passed: false,
    contextos_decision: '$150k ARR CONTRACT EXTRACTED',
    contextos_answer: 'John Smith finalized a $150k ARR contract for Project #1001 with David Wilson in the sync meeting.',
    contextos_passed: true,
    evidence_selected: ['[MEETING NOTE 2026-01-14 | ID: m_hop_1] Met with David Wilson and finalized $150k ARR contract for Project #1001.'],
    evidence_superseded: [],
    root_cause_stage: 'STAGE 5: RELATIONSHIP_FAILURE',
    root_cause_explanation: 'Baseline BM25 retrieved general project metadata without linking meeting participant notes. ContextOS Bounded Relational Context Graph traversed Person p_1 -> Project proj_1001 -> Meeting m_hop_1.'
  },
  {
    id: 'scen_601',
    category_key: 'memory',
    category_name: 'Memory Failure',
    query: 'What is the security bypass code for Acme Server Vault #101 stored on 2026-01-01?',
    expected_answer: 'The security bypass code for Acme Server Vault #101 is 1007-AB.',
    baseline_decision: 'UNAVAILABLE IN TOP-K',
    baseline_answer: 'Security bypass code is unavailable in top retrieved context.',
    baseline_passed: false,
    contextos_decision: 'PIN 1007-AB RETAINED',
    contextos_answer: 'The security bypass code for Acme Server Vault #101 is 1007-AB.',
    contextos_passed: true,
    evidence_selected: ['[NOTE 2026-01-01 | ID: m_mem_1] The security bypass code for Acme Server Vault #101 is 1007-AB.'],
    evidence_superseded: [],
    root_cause_stage: 'STAGE 2: MEMORY_FAILURE',
    root_cause_explanation: 'Baseline RAG dropped early Day 1 notes due to recency bias from noise messages. ContextOS Importance-Aware Memory Ranker enforced Importance + Relevance > Recency.'
  },
  {
    id: 'scen_751',
    category_key: 'conflict',
    category_name: 'Contradiction / Conflict',
    query: 'Is Project #1001 approved by finance as of 2026-01-14?',
    expected_answer: 'Yes, finance approved Project #1001 at $150k on 2026-01-14.',
    baseline_decision: 'REJECTED (OLD EMAIL)',
    baseline_answer: 'Initial quote for Project #1001 was rejected due to budget caps.',
    baseline_passed: false,
    contextos_decision: 'RESOLVED (SLACK APPROVAL)',
    contextos_answer: 'Yes, finance approved Project #1001 at $150k on 2026-01-14 as confirmed in Slack.',
    contextos_passed: true,
    evidence_selected: ['[SLACK 2026-01-14 | ID: m_2] RESOLVED: Budget approved by finance for Project #1001 at $150k.'],
    evidence_superseded: ['[EMAIL 2026-01-01 | ID: m_1] Initial quote for Project #1001 was rejected due to budget caps.'],
    root_cause_stage: 'STAGE 6: CONTEXT_COMPOSITION_FAILURE',
    root_cause_explanation: 'Baseline RAG selected the earlier rejection email. ContextOS Decision-Grade Context Compiler applied source authority rules and superseding state resolution.'
  },
  {
    id: 'scen_2',
    category_key: 'composition',
    category_name: 'Context Composition Failure',
    query: 'What is the current legal hold status for Acme Corp?',
    expected_answer: 'Legal hold cleared on 2026-03-04.',
    baseline_decision: 'HOLD ACTIVE',
    baseline_answer: 'Legal hold is active.',
    baseline_passed: false,
    contextos_decision: 'LEGAL HOLD CLEARED',
    contextos_answer: 'The legal hold for Acme Corp was cleared on 2026-03-04.',
    contextos_passed: true,
    evidence_selected: ['[STATE | ID: s_1] outreach_status: allowed (Valid 2026-03-04)'],
    evidence_superseded: [],
    root_cause_stage: 'STAGE 6: CONTEXT_COMPOSITION_FAILURE',
    root_cause_explanation: 'ContextOS Full mode supplied 65,424 tokens of raw uncompiled context, causing model context bloat. ContextOS Compact mode reduced tokens by 93.6% to 4,204 tokens, restoring accuracy.'
  },
  {
    id: 'scen_901',
    category_key: 'hallucination',
    category_name: 'Hallucination / Missing Information',
    query: 'What is the unannounced Q1 confidential discount percentage promised to Acme Corp for Project #1001?',
    expected_answer: 'I do not have enough information in the workspace context to answer this.',
    baseline_decision: 'FABRICATED 20%',
    baseline_answer: 'The unannounced Q1 discount percentage is 20% in cash and stock.',
    baseline_passed: false,
    contextos_decision: 'DECLINED (INSUFFICIENT)',
    contextos_answer: 'I do not have enough information in the workspace context to answer this.',
    contextos_passed: true,
    evidence_selected: [],
    evidence_superseded: [],
    root_cause_stage: 'STAGE 7: HALLUCINATION',
    root_cause_explanation: 'Baseline RAG forced an answer over irrelevant evidence. ContextOS Decision-Grade Context Compiler assigned INSUFFICIENT answerability state before LLM generation.'
  }
];

export default function FailuresPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCases = selectedCategory === 'all'
    ? REPRESENTATIVE_CASES
    : REPRESENTATIVE_CASES.filter(c => c.category_key === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans text-slate-100 p-2">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6 flex items-center justify-between font-mono">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight">Forensic Context Failure Explorer</h1>
            <span className="px-2.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs">
              7 DIAGNOSTIC CLASSES
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Inspect canonical benchmark failure modes, baseline RAG errors, and ContextOS context resolution.
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* CATEGORY FILTER CARDS (7 CATEGORIES) */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-slate-300">Filter by Diagnostic Category</span>
          <span>Showing {filteredCases.length} Representative Scenarios</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded border transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            All Failures (7)
          </button>
          {FAILURE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded border transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                  : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* REPRESENTATIVE FAILURE CASES LIST */}
      <div className="space-y-6">
        {filteredCases.map((c) => (
          <div key={c.id} className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-3 font-mono">
                <code className="text-xs font-bold text-indigo-400">{c.id}</code>
                <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300">
                  {c.category_name}
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold">
                {c.root_cause_stage}
              </span>
            </div>

            {/* QUERY & GROUND TRUTH */}
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block">QUERY</span>
              <div className="text-sm font-bold text-white leading-snug">{c.query}</div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Expected: <span className="text-emerald-400 font-bold">{c.expected_answer}</span>
              </div>
            </div>

            {/* SIDE-BY-SIDE BASELINE vs CONTEXTOS COMPARISON */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              {/* BASELINE RAG */}
              <div className="p-4 rounded bg-slate-950 border border-red-900/40 space-y-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="font-bold text-slate-400">BASELINE RAG RESULT</span>
                  <span className="text-red-400 font-bold">❌ FAILED</span>
                </div>
                <div className="font-bold text-red-300 font-mono text-[11px]">{c.baseline_decision}</div>
                <div className="text-slate-400 text-[11px]">"{c.baseline_answer}"</div>
              </div>

              {/* CONTEXTOS COMPACT */}
              <div className="p-4 rounded bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="font-bold text-emerald-400">CONTEXTOS COMPACT RESULT</span>
                  <span className="text-emerald-400 font-bold">✓ PASSED</span>
                </div>
                <div className="font-bold text-emerald-300 font-mono text-[11px]">{c.contextos_decision}</div>
                <div className="text-slate-300 text-[11px]">"{c.contextos_answer}"</div>
              </div>
            </div>

            {/* EVIDENCE TRACE */}
            {(c.evidence_selected.length > 0 || c.evidence_superseded.length > 0) && (
              <div className="space-y-2 text-xs font-mono">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">EVIDENCE PROVENANCE TRACE</span>
                <div className="space-y-1">
                  {c.evidence_selected.map((ev, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950 border border-emerald-500/30 text-emerald-300 text-[11px]">
                      Selected: {ev}
                    </div>
                  ))}
                  {c.evidence_superseded.map((ev, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-500 text-[11px]">
                      Superseded: {ev}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROOT CAUSE DIAGNOSIS */}
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">TECHNICAL ROOT CAUSE ANALYSIS</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">{c.root_cause_explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
