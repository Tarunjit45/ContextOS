'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface EvaluationItem {
  id: string;
  scenario_id: string;
  query: string;
  category: string;
  category_label: string;
  baseline_result: string;
  baseline_passed: boolean;
  contextos_result: string;
  contextos_passed: boolean;
}

const EVALUATION_ITEMS: EvaluationItem[] = [
  {
    id: '1247',
    scenario_id: 'scen_1',
    query: 'Should we follow up with Initech regarding Project #1001?',
    category: 'temporal',
    category_label: 'TEMPORAL CONFLICT',
    baseline_result: 'WAIT ✕',
    baseline_passed: false,
    contextos_result: 'CONTACT ✓',
    contextos_passed: true,
  },
  {
    id: '1246',
    scenario_id: 'scen_201',
    query: 'Which John Smith holds the role of VP Sales in Executive Sales?',
    category: 'entity',
    category_label: 'ENTITY DISAMBIGUATION',
    baseline_result: 'CONFLATED ✕',
    baseline_passed: false,
    contextos_result: 'DISAMBIGUATED ✓',
    contextos_passed: true,
  },
  {
    id: '1245',
    scenario_id: 'scen_401',
    query: 'What ARR contract value was finalized in the meeting for Project #1001?',
    category: 'multihop',
    category_label: 'MULTI-HOP RELATIONSHIP',
    baseline_result: 'MISSING ✕',
    baseline_passed: false,
    contextos_result: '$150k ARR ✓',
    contextos_passed: true,
  },
  {
    id: '1244',
    scenario_id: 'scen_601',
    query: 'What is the security bypass code for Acme Server Vault #101?',
    category: 'memory',
    category_label: 'MEMORY DECAY',
    baseline_result: 'UNAVAILABLE ✕',
    baseline_passed: false,
    contextos_result: '1007-AB ✓',
    contextos_passed: true,
  },
  {
    id: '1243',
    scenario_id: 'scen_751',
    query: 'Is Project #1001 approved by finance as of 2026-01-14?',
    category: 'conflict',
    category_label: 'CONTRADICTION',
    baseline_result: 'REJECTED ✕',
    baseline_passed: false,
    contextos_result: 'APPROVED ✓',
    contextos_passed: true,
  },
  {
    id: '1242',
    scenario_id: 'scen_901',
    query: 'What is the unannounced Q1 discount percentage promised to Acme?',
    category: 'hallucination',
    category_label: 'HALLUCINATION',
    baseline_result: 'FABRICATED 20% ✕',
    baseline_passed: false,
    contextos_result: 'INSUFFICIENT ✓',
    contextos_passed: true,
  }
];

export default function EvaluationsBrowserPage() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? EVALUATION_ITEMS
    : EVALUATION_ITEMS.filter(item => item.category === filter);

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="border-b border-[#252A31] pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-[#F4F5F7] tracking-tight">EVALUATIONS</h1>
          <p className="text-[#9BA3AF] text-sm mt-1">Diagnostic evaluation trace browser.</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-[#15181D] border border-[#252A31] text-xs font-mono text-[#9BA3AF] hover:text-[#F4F5F7] transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {[
          { id: 'all', label: 'All' },
          { id: 'temporal', label: 'Temporal' },
          { id: 'memory', label: 'Memory' },
          { id: 'entity', label: 'Entity' },
          { id: 'conflict', label: 'Contradiction' },
          { id: 'multihop', label: 'Multi-Hop' },
          { id: 'hallucination', label: 'Hallucination' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              filter === tab.id
                ? 'bg-[#7C5CFC] border-[#7C5CFC] text-white font-bold'
                : 'bg-[#111419] border-[#252A31] text-[#9BA3AF] hover:border-[#9BA3AF] hover:text-[#F4F5F7]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Evaluation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="font-bold text-[#7C5CFC]">#{item.id}</span>
                <span className="px-2 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 text-[10px]">
                  {item.category_label}
                </span>
              </div>

              <h3 className="text-base font-semibold text-[#F4F5F7] leading-snug">
                "{item.query}"
              </h3>
            </div>

            <div className="space-y-3 border-t border-[#252A31] pt-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#66707D] text-[10px] uppercase block">Baseline Result</span>
                  <span className="text-[#EF4444] font-bold">{item.baseline_result}</span>
                </div>
                <div>
                  <span className="text-[#66707D] text-[10px] uppercase block">ContextOS Result</span>
                  <span className="text-[#22C55E] font-bold">{item.contextos_result}</span>
                </div>
              </div>

              <Link
                href={`/evaluations/${item.id}`}
                className="w-full py-2 rounded bg-[#15181D] border border-[#252A31] hover:border-[#7C5CFC] text-center font-bold text-[#F4F5F7] block transition-colors"
              >
                INSPECT TRACE →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
