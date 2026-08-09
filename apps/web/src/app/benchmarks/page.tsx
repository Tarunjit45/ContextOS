'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResearchWarning from '../../components/ui/ResearchWarning';
import BenchmarkComparison from '../../components/benchmark/BenchmarkComparison';
import TokenComparison from '../../components/benchmark/TokenComparison';
import { DataTable } from '../../components/ui/DataTable';

interface BenchmarkRun {
  run_id: string;
  timestamp: string;
  agent_name: string;
  scenario_count: number;
  overall_accuracy: number;
  memory_retention: number;
  temporal_reasoning: number;
  entity_disambiguation: number;
  evidence_grounding: number;
  hallucination_rate: number;
  p50_latency_ms: number;
  p95_latency_ms: number;
}

export default function BenchmarksPage() {
  const [activeTab, setActiveTab] = useState<'real' | 'deterministic'>('real');
  const [runs, setRuns] = useState<BenchmarkRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/benchmarks/history')
      .then((res) => res.json())
      .then((data) => {
        const rawRuns: BenchmarkRun[] = data.runs || [];
        const seen = new Set<string>();
        const grouped: BenchmarkRun[] = [];
        for (const r of rawRuns) {
          const key = `${r.agent_name}_${r.scenario_count}_${r.overall_accuracy}`;
          if (!seen.has(key)) {
            seen.add(key);
            grouped.push(r);
          }
        }
        setRuns(grouped);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-10 font-sans text-[#F4F5F7]">
      {/* Header */}
      <div className="border-b border-[#252A31] pb-6 flex items-center justify-between font-mono">
        <div>
          <h1 className="text-3xl font-semibold text-[#F4F5F7] tracking-tight">BENCHMARKS</h1>
          <p className="text-sm text-[#9BA3AF] mt-1 font-sans">
            Controlled evaluation of agent context architectures.
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-[#15181D] border border-[#252A31] text-xs font-mono text-[#9BA3AF] hover:text-[#F4F5F7] transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* REAL LLM VALIDATION SECTION */}
      <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 font-mono">
          <div>
            <div className="text-xs font-bold text-[#7C5CFC] uppercase tracking-wider">REAL LLM VALIDATION</div>
            <div className="text-sm font-bold text-[#F4F5F7] mt-0.5">
              OpenRouter | n = 10 | Seed = 42
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 text-xs font-bold">
            CANONICAL RESULTS
          </span>
        </div>

        <ResearchWarning message="This experiment is directional and not statistically sufficient to establish general performance across arbitrary enterprise workloads." />

        {/* THREE-COLUMN COMPARISON CENTERPIECE */}
        <BenchmarkComparison />

        {/* TOKEN COMPARISON VISUALIZATION BAR */}
        <TokenComparison />

        {/* KEY FINDING */}
        <div className="p-4 rounded-lg bg-[#15181D] border border-[#7C5CFC]/30 text-xs font-sans space-y-1">
          <div className="font-bold text-[#7C5CFC] font-mono uppercase text-[11px]">KEY FINDING</div>
          <p className="text-[#9BA3AF] leading-relaxed">
            Full ContextOS exposed a context-bloat problem. Compact ContextOS reduced the context payload by 93.6% while reaching 90% accuracy in this n=10 validation.
          </p>
        </div>
      </div>

      {/* CATEGORY BREAKDOWN TABLE */}
      <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-4">
        <div className="flex justify-between items-center font-mono">
          <span className="text-xs font-bold text-[#F4F5F7] uppercase tracking-wider">CATEGORY BREAKDOWN</span>
          <span className="text-xs text-[#66707D]">6 CATEGORIES</span>
        </div>

        <DataTable
          columns={[
            { header: 'Category', accessor: (r) => <span className="font-bold text-[#F4F5F7]">{r.cat}</span> },
            { header: 'Count', accessor: (r) => <span className="text-[#9BA3AF]">{r.count}</span> },
            { header: 'Baseline RAG', accessor: (r) => <span className="text-[#EF4444]">{r.base}</span> },
            { header: 'ContextOS Full', accessor: (r) => <span className="text-[#F59E0B]">{r.full}</span> },
            { header: 'ContextOS Compact', accessor: (r) => <span className="text-[#22C55E] font-bold">{r.compact}</span> },
          ]}
          data={[
            { cat: 'Temporal Conflict', count: 2, base: '50% (1/2)', full: '0% (0/2)', compact: '100% (2/2)' },
            { cat: 'Memory Decay', count: 2, base: '100% (2/2)', full: '50% (1/2)', compact: '100% (2/2)' },
            { cat: 'Entity Disambiguation', count: 2, base: '0% (0/2)', full: '0% (0/2)', compact: '50% (1/2)' },
            { cat: 'Multi-Hop Relationship', count: 2, base: '100% (2/2)', full: '100% (2/2)', compact: '100% (2/2)' },
            { cat: 'Contradiction / Conflict', count: 1, base: '0% (0/1)', full: '100% (1/1)', compact: '100% (1/1)' },
            { cat: 'Missing Information', count: 1, base: '0% (0/1)', full: '100% (1/1)', compact: '100% (1/1)' }
          ]}
        />
      </div>

      {/* EXPERIMENT HISTORY (TABBED: REAL LLM vs DETERMINISTIC) */}
      <div className="p-6 rounded-lg bg-[#111419] border border-[#252A31] space-y-4 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-[#252A31] pb-3">
          <span className="text-xs font-bold text-[#F4F5F7] uppercase tracking-wider">EXPERIMENT HISTORY</span>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('real')}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
                activeTab === 'real'
                  ? 'bg-[#7C5CFC] text-white'
                  : 'bg-[#15181D] text-[#9BA3AF] border border-[#252A31] hover:text-[#F4F5F7]'
              }`}
            >
              REAL LLM
            </button>
            <button
              onClick={() => setActiveTab('deterministic')}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
                activeTab === 'deterministic'
                  ? 'bg-[#7C5CFC] text-white'
                  : 'bg-[#15181D] text-[#9BA3AF] border border-[#252A31] hover:text-[#F4F5F7]'
              }`}
            >
              DETERMINISTIC REGRESSION
            </button>
          </div>
        </div>

        {activeTab === 'real' ? (
          <div className="space-y-3 font-sans">
            <div className="text-[#9BA3AF] text-xs">
              Canonical Phase 3 real-LLM validation benchmark execution (<code className="text-[#F4F5F7] font-mono">n=10</code> scenarios via OpenRouter API).
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-lg bg-[#15181D] border border-[#252A31]">
                <div className="text-[#66707D] text-[10px] uppercase">Live Baseline RAG</div>
                <div className="text-[#EF4444] font-bold text-lg mt-1">50% Accuracy</div>
                <div className="text-[#9BA3AF] text-[11px]">Tokens: 2,441</div>
              </div>
              <div className="p-4 rounded-lg bg-[#15181D] border border-[#252A31]">
                <div className="text-[#66707D] text-[10px] uppercase">Live ContextOS Full</div>
                <div className="text-[#F59E0B] font-bold text-lg mt-1">50% Accuracy</div>
                <div className="text-[#9BA3AF] text-[11px]">Tokens: 65,424</div>
              </div>
              <div className="p-4 rounded-lg bg-[#15181D] border border-[#7C5CFC]/40">
                <div className="text-[#7C5CFC] text-[10px] uppercase font-bold">Live ContextOS Compact</div>
                <div className="text-[#22C55E] font-bold text-lg mt-1">90% Accuracy</div>
                <div className="text-[#9BA3AF] text-[11px]">Tokens: 4,204 (-93.6%)</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#15181D] border border-[#252A31] text-[#9BA3AF] text-xs leading-relaxed">
              1,000-scenario deterministic regression benchmark. Used for subsystem validation; not equivalent to live LLM evaluation.
            </div>

            {loading ? (
              <div className="py-4 text-center text-[#66707D]">Loading benchmark traces...</div>
            ) : (
              <DataTable
                columns={[
                  { header: 'Run ID', accessor: (r) => <span className="text-[#66707D]">{r.run_id.slice(0, 16)}</span> },
                  { header: 'Agent Name', accessor: (r) => <span className="text-[#F4F5F7] font-bold">{r.agent_name}</span> },
                  { header: 'Accuracy', accessor: (r) => <span className="text-[#22C55E] font-bold">{r.overall_accuracy}%</span> },
                  { header: 'Memory Recall', accessor: (r) => <span className="text-[#9BA3AF]">{r.memory_retention}%</span> },
                  { header: 'Entity Acc', accessor: (r) => <span className="text-[#9BA3AF]">{r.entity_disambiguation}%</span> },
                  { header: 'Grounding', accessor: (r) => <span className="text-[#9BA3AF]">{r.evidence_grounding}%</span> },
                  { header: 'Hallucination', accessor: (r) => <span className="text-[#9BA3AF]">{r.hallucination_rate}%</span> },
                  { header: 'P50 Latency', accessor: (r) => <span className="text-[#66707D]">{r.p50_latency_ms} ms</span> },
                ]}
                data={runs}
                emptyMessage="No benchmark data available"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
