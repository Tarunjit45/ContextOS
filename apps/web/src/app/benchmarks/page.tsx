'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResearchWarning from '../../components/ui/ResearchWarning';
import BenchmarkComparison from '../../components/benchmark/BenchmarkComparison';
import TokenEfficiency from '../../components/research/TokenEfficiency';
import { DataTable } from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { Server, ShieldCheck, Zap } from 'lucide-react';

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
    <div className="space-y-8 font-sans text-[#F5F7FA]">
      {/* Header */}
      <div className="border-b border-[#232731] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold text-[#F5F7FA] tracking-tight">Benchmark Laboratory</h1>
          </div>
          <p className="text-sm text-[#A7ADB8] font-sans">
            Controlled evaluation of agent context architectures.
          </p>
        </div>
        <Link
          href="/"
          className="px-3 py-1.5 rounded-md bg-[#111318] border border-[#232731] text-xs font-mono text-[#A7ADB8] hover:text-[#F5F7FA] transition-colors shrink-0"
        >
          ← Overview
        </Link>
      </div>

      {/* REAL LLM VALIDATION PROMINENT BADGE HEADER */}
      <div className="p-5 rounded-lg bg-[#111318] border border-[#7C5CFC]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono text-xs shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#7C5CFC] text-sm tracking-wider uppercase">REAL LLM VALIDATION</span>
            <span className="px-2 py-0.5 rounded bg-[#7C5CFC]/20 text-[#7C5CFC] font-bold text-[10px] border border-[#7C5CFC]/30">
              Remote Inference
            </span>
          </div>
          <p className="text-[#A7ADB8] font-sans text-xs">
            OpenRouter API Provider: <code className="text-[#F5F7FA]">nvidia/nemotron-3-ultra-550b-a55b:free</code> (n=10 scenarios)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          <span className="px-3 py-1.5 rounded bg-[#171A20] border border-[#232731] text-[#32D583]">Seed: 42</span>
          <span className="px-3 py-1.5 rounded bg-[#171A20] border border-[#232731] text-[#4F8CFF]">n = 10</span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 font-mono text-xs border-b border-[#232731] pb-3">
        <button
          onClick={() => setActiveTab('real')}
          className={`px-4 py-2 rounded-md font-bold uppercase transition-colors ${
            activeTab === 'real'
              ? 'bg-[#7C5CFC] text-white shadow-sm'
              : 'bg-[#111318] text-[#A7ADB8] border border-[#232731] hover:text-[#F5F7FA]'
          }`}
        >
          REAL LLM RESULTS
        </button>
        <button
          onClick={() => setActiveTab('deterministic')}
          className={`px-4 py-2 rounded-md font-bold uppercase transition-colors ${
            activeTab === 'deterministic'
              ? 'bg-[#7C5CFC] text-white shadow-sm'
              : 'bg-[#111318] text-[#A7ADB8] border border-[#232731] hover:text-[#F5F7FA]'
          }`}
        >
          DETERMINISTIC REGRESSION
        </button>
      </div>

      {activeTab === 'real' ? (
        <div className="space-y-8">
          <ResearchWarning message="Low-resource validation (n=10 scenarios via OpenRouter API). This experiment is directional and not statistically sufficient to establish general performance across arbitrary enterprise workloads." />

          {/* Three-Column Comparison */}
          <BenchmarkComparison />

          {/* Token Efficiency */}
          <TokenEfficiency />

          {/* Key Finding */}
          <div className="p-4 rounded-lg bg-[#111318] border border-[#7C5CFC]/30 text-xs font-sans space-y-1">
            <div className="font-bold text-[#7C5CFC] font-mono uppercase text-[11px]">KEY RESEARCH FINDING</div>
            <p className="text-[#A7ADB8] leading-relaxed">
              Full ContextOS exposed a severe context-bloat problem (65,424 tokens at 50% accuracy). Decision-Grade Context Compiler reduced the context payload by 93.6% while reaching 90% accuracy in this n=10 validation.
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#F5F7FA] uppercase tracking-wider">CATEGORY BREAKDOWN</span>
              <span className="text-[#6B7280]">6 CATEGORIES</span>
            </div>

            <DataTable
              columns={[
                { header: 'Category', accessor: (r) => <span className="font-bold text-[#F5F7FA]">{r.cat}</span> },
                { header: 'Count', accessor: (r) => <span className="text-[#A7ADB8]">{r.count}</span> },
                { header: 'Baseline RAG', accessor: (r) => <span className="text-[#F97066]">{r.base}</span> },
                { header: 'ContextOS Full', accessor: (r) => <span className="text-[#F5B942]">{r.full}</span> },
                { header: 'ContextOS Compact', accessor: (r) => <span className="text-[#32D583] font-bold">{r.compact}</span> },
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
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-[#111318] border border-[#232731] text-[#A7ADB8] text-xs font-sans leading-relaxed">
            1,000-scenario deterministic regression benchmark. Used for subsystem validation; not equivalent to live LLM evaluation.
          </div>

          <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#F5F7FA] uppercase tracking-wider">DETERMINISTIC REGRESSION HISTORY</span>
              <span className="text-[#6B7280]">{runs.length} RUNS Persisted</span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-[#6B7280]">Loading benchmark traces...</div>
            ) : (
              <DataTable
                columns={[
                  { header: 'Run ID', accessor: (r) => <span className="text-[#6B7280]">{r.run_id.slice(0, 16)}</span> },
                  { header: 'Agent Name', accessor: (r) => <span className="text-[#F5F7FA] font-bold">{r.agent_name}</span> },
                  { header: 'Accuracy', accessor: (r) => <span className="text-[#32D583] font-bold">{r.overall_accuracy}%</span> },
                  { header: 'Memory Recall', accessor: (r) => <span className="text-[#A7ADB8]">{r.memory_retention}%</span> },
                  { header: 'Entity Acc', accessor: (r) => <span className="text-[#A7ADB8]">{r.entity_disambiguation}%</span> },
                  { header: 'Grounding', accessor: (r) => <span className="text-[#A7ADB8]">{r.evidence_grounding}%</span> },
                  { header: 'Hallucination', accessor: (r) => <span className="text-[#A7ADB8]">{r.hallucination_rate}%</span> },
                  { header: 'P50 Latency', accessor: (r) => <span className="text-[#6B7280]">{r.p50_latency_ms} ms</span> },
                ]}
                data={runs}
                emptyMessage="No benchmark runs recorded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
