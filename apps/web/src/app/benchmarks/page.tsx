'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResearchWarning from '../../components/ui/ResearchWarning';

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* BASELINE RAG */}
          <div className="p-6 rounded-lg bg-[#15181D] border border-[#EF4444]/30 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#9BA3AF] uppercase">BASELINE RAG</span>
              <span className="text-[10px] text-[#66707D]">CONTROL</span>
            </div>

            <div>
              <div className="text-3xl font-bold text-[#EF4444]">50%</div>
              <div className="text-xs text-[#9BA3AF] mt-1">Accuracy (5/10 scenarios passed)</div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#252A31]">
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Input Tokens:</span>
                <span className="text-[#F4F5F7] font-bold">2,441</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Hallucination:</span>
                <span className="text-[#EF4444] font-bold">10%</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>P50 Latency:</span>
                <span className="text-[#F4F5F7]">4.33s</span>
              </div>
            </div>
          </div>

          {/* CONTEXTOS FULL */}
          <div className="p-6 rounded-lg bg-[#15181D] border border-[#F59E0B]/30 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#F59E0B] uppercase">CONTEXTOS FULL</span>
              <span className="text-[10px] text-[#F59E0B]/80">CONTEXT BLOAT</span>
            </div>

            <div>
              <div className="text-3xl font-bold text-[#F59E0B]">50%</div>
              <div className="text-xs text-[#9BA3AF] mt-1">Accuracy (5/10 scenarios passed)</div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#252A31]">
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Input Tokens:</span>
                <span className="text-[#F59E0B] font-bold">65,424</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Hallucination:</span>
                <span className="text-[#22C55E] font-bold">0%</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>P50 Latency:</span>
                <span className="text-[#F4F5F7]">3.80s</span>
              </div>
            </div>
          </div>

          {/* CONTEXTOS COMPACT (EMPHASIZED WITH PURPLE) */}
          <div className="p-6 rounded-lg bg-[#15181D] border-2 border-[#7C5CFC] space-y-4 shadow-lg shadow-[#7C5CFC]/10">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#7C5CFC] uppercase">CONTEXTOS COMPACT</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#7C5CFC]/20 text-[#7C5CFC] font-bold">DECISION-GRADE</span>
            </div>

            <div>
              <div className="text-3xl font-bold text-[#7C5CFC]">90%</div>
              <div className="text-xs text-[#9BA3AF] mt-1">Accuracy (9/10 scenarios passed)</div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#252A31]">
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Input Tokens:</span>
                <span className="text-[#22C55E] font-bold">4,204</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>Hallucination:</span>
                <span className="text-[#22C55E] font-bold">0%</span>
              </div>
              <div className="flex justify-between text-[#9BA3AF]">
                <span>P50 Latency:</span>
                <span className="text-[#F4F5F7]">5.97s</span>
              </div>
            </div>
          </div>
        </div>

        {/* TOKEN COMPARISON VISUALIZATION BAR */}
        <div className="p-5 rounded-lg bg-[#15181D] border border-[#252A31] space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#F4F5F7] uppercase">INPUT TOKEN PAYLOAD COMPARISON</span>
            <span className="text-[#7C5CFC] font-bold">93.6% TOKEN REDUCTION</span>
          </div>

          <div className="space-y-3">
            {/* FULL */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#F59E0B]">CONTEXTOS FULL</span>
                <span className="text-[#F59E0B] font-bold">65,424 tokens</span>
              </div>
              <div className="w-full bg-[#0D0F12] h-4 rounded overflow-hidden border border-[#252A31]">
                <div className="bg-[#F59E0B] h-full w-full" />
              </div>
            </div>

            {/* COMPACT */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#22C55E]">CONTEXTOS COMPACT</span>
                <span className="text-[#22C55E] font-bold">4,204 tokens (-93.6%)</span>
              </div>
              <div className="w-full bg-[#0D0F12] h-4 rounded overflow-hidden border border-[#252A31]">
                <div className="bg-[#22C55E] h-full w-[6.4%]" />
              </div>
            </div>
          </div>
        </div>

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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#252A31] text-[#66707D] uppercase tracking-wider">
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 px-4">Count</th>
                <th className="pb-3 px-4">Baseline RAG</th>
                <th className="pb-3 px-4">ContextOS Full</th>
                <th className="pb-3 pl-4">ContextOS Compact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252A31]/60">
              {[
                { cat: 'Temporal Conflict', count: 2, base: '50% (1/2)', full: '0% (0/2)', compact: '100% (2/2)' },
                { cat: 'Memory Decay', count: 2, base: '100% (2/2)', full: '50% (1/2)', compact: '100% (2/2)' },
                { cat: 'Entity Disambiguation', count: 2, base: '0% (0/2)', full: '0% (0/2)', compact: '50% (1/2)' },
                { cat: 'Multi-Hop Relationship', count: 2, base: '100% (2/2)', full: '100% (2/2)', compact: '100% (2/2)' },
                { cat: 'Contradiction / Conflict', count: 1, base: '0% (0/1)', full: '100% (1/1)', compact: '100% (1/1)' },
                { cat: 'Missing Information', count: 1, base: '0% (0/1)', full: '100% (1/1)', compact: '100% (1/1)' }
              ].map((r, i) => (
                <tr key={i} className="hover:bg-[#15181D] transition-colors">
                  <td className="py-3 pr-4 text-[#F4F5F7] font-bold">{r.cat}</td>
                  <td className="py-3 px-4 text-[#9BA3AF]">{r.count}</td>
                  <td className="py-3 px-4 text-[#EF4444]">{r.base}</td>
                  <td className="py-3 px-4 text-[#F59E0B]">{r.full}</td>
                  <td className="py-3 pl-4 text-[#22C55E] font-bold">{r.compact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <div className="p-3 rounded.lg bg-[#15181D] border border-[#252A31] text-[#9BA3AF] text-xs leading-relaxed">
              1,000-scenario deterministic regression benchmark. Used for subsystem validation; not equivalent to live LLM evaluation.
            </div>

            {loading ? (
              <div className="py-4 text-center text-[#66707D]">Loading benchmark traces...</div>
            ) : runs.length === 0 ? (
              <div className="py-4 text-center text-[#66707D]">No data available</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#252A31] text-[#66707D] uppercase tracking-wider">
                      <th className="pb-3 pr-4">Run ID</th>
                      <th className="pb-3 px-4">Agent Name</th>
                      <th className="pb-3 px-4">Accuracy</th>
                      <th className="pb-3 px-4">Memory Recall</th>
                      <th className="pb-3 px-4">Entity Acc</th>
                      <th className="pb-3 px-4">Grounding</th>
                      <th className="pb-3 px-4">Hallucination</th>
                      <th className="pb-3 pl-4">P50 Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#252A31]/60">
                    {runs.map((r) => (
                      <tr key={r.run_id} className="hover:bg-[#15181D] transition-colors">
                        <td className="py-3 pr-4 text-[#66707D]">{r.run_id.slice(0, 16)}</td>
                        <td className="py-3 px-4 text-[#F4F5F7] font-bold">{r.agent_name}</td>
                        <td className="py-3 px-4 text-[#22C55E] font-bold">{r.overall_accuracy}%</td>
                        <td className="py-3 px-4 text-[#9BA3AF]">{r.memory_retention}%</td>
                        <td className="py-3 px-4 text-[#9BA3AF]">{r.entity_disambiguation}%</td>
                        <td className="py-3 px-4 text-[#9BA3AF]">{r.evidence_grounding}%</td>
                        <td className="py-3 px-4 text-[#9BA3AF]">{r.hallucination_rate}%</td>
                        <td className="py-3 pl-4 text-[#66707D]">{r.p50_latency_ms} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
