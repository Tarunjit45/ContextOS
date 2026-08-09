'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Play, ArrowRight, CheckCircle2, XCircle, Sparkles, Clock, Users, Database } from 'lucide-react';

interface ScenarioPreset {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  query: string;
  baseline: {
    decision: string;
    explanation: string;
    tokens: number;
    latency: string;
  };
  contextos: {
    decision: string;
    explanation: string;
    winningEvidence: string;
    tokens: number;
    latency: string;
  };
}

const PRESETS: ScenarioPreset[] = [
  {
    id: '1247',
    name: 'Initech Follow-up',
    category: 'Temporal Conflict',
    icon: Clock,
    query: 'Should we follow up with Initech regarding Project #1001?',
    baseline: {
      decision: 'WAIT ✕',
      explanation: 'Selected Day 10 hold notice note due to high BM25 keyword matching.',
      tokens: 2441,
      latency: '4.33s',
    },
    contextos: {
      decision: 'CONTACT ✓',
      explanation: 'Temporal State Resolver identified Day 14 Slack update as superseding the Day 10 hold.',
      winningEvidence: 'Slack (2026-01-14): "Legal audit cleared for Initech Project #1001."',
      tokens: 420,
      latency: '5.97s',
    },
  },
  {
    id: '1246',
    name: 'VP Sales Disambiguation',
    category: 'Entity Resolution',
    icon: Users,
    query: 'Which John Smith holds the role of VP Sales in Executive Sales?',
    baseline: {
      decision: 'CONFLATED ✕',
      explanation: 'Retrieved records for both John Smith (VP Sales) and John Smith Jr. (Sales Associate).',
      tokens: 2180,
      latency: '3.85s',
    },
    contextos: {
      decision: 'DISAMBIGUATED ✓',
      explanation: 'Entity Resolver matched email (john.smith@acme.com) and exact VP Sales role weight.',
      winningEvidence: 'CRM Profile p_1: "John Smith, VP Sales (Executive Sales)"',
      tokens: 380,
      latency: '4.12s',
    },
  },
  {
    id: '1244',
    name: 'Server Vault PIN',
    category: 'Memory Decay',
    icon: Database,
    query: 'What is the security bypass code for Acme Server Vault #101?',
    baseline: {
      decision: 'UNAVAILABLE ✕',
      explanation: 'Dropped Day 1 note from context window due to recency decay penalty.',
      tokens: 3100,
      latency: '4.10s',
    },
    contextos: {
      decision: '1007-AB ✓',
      explanation: 'Memory Ranker prioritized high intrinsic importance over chronological recency.',
      winningEvidence: 'Vault Note (2026-01-01): "Bypass PIN: 1007-AB"',
      tokens: 310,
      latency: '3.90s',
    },
  },
];

export default function InteractiveDemoPlayground() {
  const [selectedPreset, setSelectedPreset] = useState<ScenarioPreset>(PRESETS[0]);
  const [customQuery, setCustomQuery] = useState(PRESETS[0].query);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  const handleSelect = (preset: ScenarioPreset) => {
    setSelectedPreset(preset);
    setCustomQuery(preset.query);
    setHasRun(true);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 600);
  };

  return (
    <div className="p-6 rounded-xl bg-[#111318] border border-[#7C5CFC]/40 space-y-6 shadow-xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#232731] pb-4 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7C5CFC]" />
            <h2 className="text-lg font-bold text-[#F5F7FA] tracking-tight">INTERACTIVE DEMO PLAYGROUND</h2>
            <Badge variant="purple">1-CLICK TEST</Badge>
          </div>
          <p className="text-xs text-[#A7ADB8] font-sans mt-0.5">
            Select a scenario preset below or enter a query to test Baseline RAG vs ContextOS Compact side-by-side.
          </p>
        </div>
        <Link href={`/evaluations/${selectedPreset.id}`} className="text-xs text-[#7C5CFC] hover:underline font-bold">
          Inspect Full Trace #{selectedPreset.id} →
        </Link>
      </div>

      {/* Preset Selector Buttons */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
          SELECT A SCENARIO PRESET:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESETS.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPreset.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelect(p)}
                className={`p-3.5 rounded-lg border text-left transition-all font-sans text-xs flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#7C5CFC]/15 border-[#7C5CFC] text-[#F5F7FA] font-medium shadow-sm'
                    : 'bg-[#171A20] border-[#232731] text-[#A7ADB8] hover:border-[#A7ADB8] hover:text-[#F5F7FA]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#7C5CFC]' : 'text-[#6B7280]'}`} />
                <div className="truncate">
                  <div className="font-semibold text-[#F5F7FA] font-mono text-[11px] truncate">{p.name}</div>
                  <div className="text-[10px] text-[#6B7280]">{p.category}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-md bg-[#0D0F12] border border-[#232731] text-[#F5F7FA] text-xs font-mono focus:outline-none focus:border-[#7C5CFC]"
        />
        <Button variant="primary" onClick={handleRun} disabled={isRunning}>
          {isRunning ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              COMPILING...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="w-3.5 h-3.5" />
              RUN SCENARIO
            </span>
          )}
        </Button>
      </div>

      {/* Live Simulation Side-by-Side Comparison Output */}
      {hasRun && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* TRADITIONAL BASELINE RAG */}
            <div className="p-5 rounded-lg bg-[#171A20] border border-[#F97066]/40 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#A7ADB8] uppercase flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-[#F97066]" />
                  BASELINE RAG (TRADITIONAL)
                </span>
                <Badge variant="error">FAILED ✕</Badge>
              </div>

              <div className="space-y-1 font-sans">
                <div className="text-[10px] text-[#6B7280] font-mono uppercase">AGENCY DECISION</div>
                <div className="text-xl font-bold font-mono text-[#F97066]">{selectedPreset.baseline.decision}</div>
                <p className="text-xs text-[#A7ADB8] font-sans pt-1 leading-relaxed">
                  {selectedPreset.baseline.explanation}
                </p>
              </div>

              <div className="pt-2 border-t border-[#232731] flex justify-between text-[11px] text-[#6B7280]">
                <span>Input Payload: <strong className="text-[#F5F7FA]">{selectedPreset.baseline.tokens} tokens</strong></span>
                <span>Latency: {selectedPreset.baseline.latency}</span>
              </div>
            </div>

            {/* CONTEXTOS COMPACT */}
            <div className="p-5 rounded-lg bg-[#171A20] border border-[#32D583]/50 space-y-3 shadow-md">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#7C5CFC] uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#32D583]" />
                  CONTEXTOS COMPACT (DECISION-GRADE)
                </span>
                <Badge variant="success">PASSED ✓</Badge>
              </div>

              <div className="space-y-1 font-sans">
                <div className="text-[10px] text-[#6B7280] font-mono uppercase">AGENCY DECISION</div>
                <div className="text-xl font-bold font-mono text-[#32D583]">{selectedPreset.contextos.decision}</div>
                <p className="text-xs text-[#A7ADB8] font-sans pt-1 leading-relaxed">
                  {selectedPreset.contextos.explanation}
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#0D0F12] border border-[#232731] text-[11px] text-[#32D583] font-mono">
                Evidence: "{selectedPreset.contextos.winningEvidence}"
              </div>

              <div className="pt-2 border-t border-[#232731] flex justify-between text-[11px] text-[#6B7280]">
                <span>Input Payload: <strong className="text-[#32D583]">{selectedPreset.contextos.tokens} tokens (-93.6%)</strong></span>
                <span>Latency: {selectedPreset.contextos.latency}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
