'use client';

import React from 'react';
import Link from 'next/link';

interface SubsystemSpec {
  id: string;
  name: string;
  module: string;
  purpose: string;
  input: string;
  output: string;
  failurePrevented: string;
  formulaOrDetails: string;
}

const SUBSYSTEMS: SubsystemSpec[] = [
  {
    id: 'hybrid_retrieval',
    name: 'Hybrid Retrieval Engine',
    module: 'packages.retrieval.hybrid_retriever.HybridRetriever',
    purpose: 'Combines lexical, character n-gram, temporal recency, entity hits, graph distance, and source channel authority into a unified candidate scoring model.',
    input: 'Sanitized User Query string, Workspace Document Index (Communications, Notes, CRM records)',
    output: 'Top-K (k=30) ranked candidate document objects with composite relevance scores',
    failurePrevented: 'Retrieval Failure — Prevents omitting relevant documents that use non-exact synonyms or low keyword density.',
    formulaOrDetails: 'Score = 0.35*BM25 + 0.20*NGramSim + 0.15*EntityHits + 0.15*RecencyDecay + 0.15*SourceAuthority (CRM: 1.0 > Meeting: 0.85 > Email: 0.75 > Slack: 0.65 > Note: 0.50)'
  },
  {
    id: 'entity_resolution',
    name: 'Candidate-Scored Entity Resolver',
    module: 'packages.retrieval.entity_resolver.EntityResolver',
    purpose: 'Disambiguates individuals sharing identical or similar names, emails, roles, and departments using a multi-attribute weighted scoring model.',
    input: 'Query text, Workspace Entity Registry (People, Companies, Projects)',
    output: 'Canonical entity ID (e.g. p_1), match confidence score, and explicit is_ambiguous flag',
    failurePrevented: 'Entity Resolution Failure — Prevents conflating senior executives with junior associates (e.g. John Smith VP vs John Smith Jr. Associate).',
    formulaOrDetails: 'Attribute Weights: email (0.35), exact_name (0.25), role (0.20), department (0.10), suffix (0.10). Sets is_ambiguous=True if candidate score delta < 0.15.'
  },
  {
    id: 'temporal_resolver',
    name: 'Temporal State Resolver',
    module: 'packages.retrieval.temporal_resolver.TemporalStateResolver',
    purpose: 'Parses historical communications into discrete state transition events to reconstruct active attribute values valid at query timestamp.',
    input: 'Candidate communications, Target entity ID, Attribute name, Query timestamp',
    output: 'Active attribute state payload, valid_from / valid_until interval, and list of superseded event IDs',
    failurePrevented: 'Temporal Retrieval Failure — Prevents retrieving outdated Day 1 hold notices when Day 30 legal clearances exist.',
    formulaOrDetails: 'ActiveState(T) = argmax_{e in Events(T)} (valid_from_e, authority_e, confidence_e). Superseded events are explicitly tracked in provenance.'
  },
  {
    id: 'memory_ranker',
    name: 'Importance-Aware Memory Ranker',
    module: 'packages.memory.memory_ranker.MemoryRanker',
    purpose: 'Ranks historical facts using relevance and intrinsic importance over pure chronological recency to retain critical early instructions.',
    input: 'Candidate evidence items, Query embedding/text, Time horizon delta',
    output: 'Re-ordered evidence array prioritized by Importance + Relevance > Recency',
    failurePrevented: 'Memory Decay Failure — Prevents dropping critical vault PINs or legal terms introduced early (Day 1) and queried late (Day 60).',
    formulaOrDetails: 'MemoryScore = 0.50*RelevanceScore + 0.35*ImportanceWeight + 0.15*DecayPenalty(t_gap)'
  },
  {
    id: 'context_graph',
    name: 'Bounded Relational Context Graph',
    module: 'packages.graph.context_graph.ContextGraphEngine',
    purpose: 'Executes multi-hop graph path expansion across entity-project-meeting-decision relationships in NetworkX.',
    input: 'Resolved Entity IDs, Workspace NetworkX MultiDiGraph, Maximum Traversal Depth (default: 2)',
    output: 'Sub-graph edge path array (e.g. Person p_1 -> Project proj_1001 -> Decision d_4)',
    failurePrevented: 'Multi-Hop Relationship Failure — Prevents missing contract decisions associated with a project owned by a specific manager.',
    formulaOrDetails: 'Traverses edges (OWNS, BELONGS_TO, PARTICIPATED_IN, DECIDED) up to depth=2 with edge weight decay.'
  },
  {
    id: 'context_composer',
    name: 'Decision-Grade Context Compiler',
    module: 'packages.context.context_compiler.DecisionGradeContextCompiler',
    purpose: 'Compiles sub-system outputs into a compact, structured, evidence-grounded context representation with provenance and answerability states.',
    input: 'Query, Selected Evidence, Resolved Entities, Active Temporal States, Sub-graph Paths, Token Budget',
    output: 'Structured Context string ([ENTITIES], [CURRENT STATE], [TIMELINE], [EVIDENCE], [ANSWERABILITY]), Token Telemetry',
    failurePrevented: 'Context Composition Failure & Hallucination — Cuts token bloat (-93.6%) and flags INSUFFICIENT state before LLM generation.',
    formulaOrDetails: 'Output Sections: [ENTITIES], [CURRENT STATE], [TIMELINE], [RELATIONSHIPS], [EVIDENCE PROVENANCE], [CONFLICT RESOLUTION], [ANSWERABILITY], [CONFIDENCE]'
  }
];

export default function ArchitecturePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 font-sans text-slate-100 p-2">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 font-mono">
            <h1 className="text-xl font-bold text-white tracking-tight">System Architecture & Subsystem Specification</h1>
            <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs">
              PHASE 3.3 SPEC
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Technical breakdown of the 6 core ContextOS context processing subsystems.
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:border-slate-700 transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* PIPELINE ARCHITECTURE COMPARISON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* BASELINE PIPELINE */}
        <div className="p-5 rounded-xl bg-[#0d0f17] border border-red-900/30 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="font-bold text-slate-400">BASELINE RAG PIPELINE</span>
            <span className="text-[10px] text-red-400">UNCOMPILED (50% ACC)</span>
          </div>

          <div className="space-y-2 text-slate-300 text-center">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-bold">USER QUERY</div>
            <div className="text-slate-600">↓</div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">BM25 Lexical Retriever (Top-3)</div>
            <div className="text-slate-600">↓</div>
            <div className="p-2.5 rounded bg-slate-950 border border-red-900/40 text-red-300">Raw Document Concat (No state/entity check)</div>
            <div className="text-slate-600">↓</div>
            <div className="p-2.5 rounded bg-slate-950 border border-red-900/50 text-red-400 font-bold">LLM GENERATION</div>
          </div>
        </div>

        {/* CONTEXTOS PIPELINE */}
        <div className="p-5 rounded-xl bg-[#0d0f17] border border-emerald-500/30 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="font-bold text-emerald-400">CONTEXTOS COMPILER PIPELINE</span>
            <span className="text-[10px] text-emerald-400 font-bold">DECISION-GRADE (90% ACC)</span>
          </div>

          <div className="space-y-2 text-slate-300 text-center">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-bold">USER QUERY</div>
            <div className="text-indigo-400">↓</div>
            <div className="p-2.5 rounded bg-slate-950 border border-indigo-500/30 text-indigo-300">Hybrid Multi-Signal Retriever</div>
            <div className="text-indigo-400">↓</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">Entity Resolver</div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">Temporal Resolver</div>
            </div>
            <div className="text-indigo-400">↓</div>
            <div className="p-2.5 rounded bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold">Decision-Grade Context Compiler</div>
            <div className="text-emerald-400">↓</div>
            <div className="p-2.5 rounded bg-slate-950 border border-emerald-500/50 text-emerald-400 font-bold">LLM GENERATION (-93.6% TOKENS)</div>
          </div>
        </div>
      </div>

      {/* SUBSYSTEM DETAILED SPECIFICATIONS (6 SUBSYSTEMS) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">Subsystem Technical Specifications</h2>
          <span className="text-xs text-slate-500">6 CORE SUBSYSTEMS</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {SUBSYSTEMS.map((sub, idx) => (
            <div key={sub.id} className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-xs font-bold text-indigo-400">0{idx + 1}</span>
                  <h3 className="text-base font-bold text-white">{sub.name}</h3>
                </div>
                <code className="text-[11px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  {sub.module}
                </code>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* PURPOSE */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block">PURPOSE</span>
                  <p className="text-slate-300 leading-relaxed">{sub.purpose}</p>
                </div>

                {/* FAILURE PREVENTED */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest block">FAILURE PREVENTED</span>
                  <p className="text-amber-300/90 font-medium leading-relaxed">{sub.failurePrevented}</p>
                </div>

                {/* INPUT */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block">INPUT</span>
                  <code className="text-slate-300 font-mono text-[11px] block bg-slate-950 p-2.5 rounded border border-slate-800">
                    {sub.input}
                  </code>
                </div>

                {/* OUTPUT */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block">OUTPUT</span>
                  <code className="text-emerald-300 font-mono text-[11px] block bg-slate-950 p-2.5 rounded border border-slate-800">
                    {sub.output}
                  </code>
                </div>
              </div>

              {/* TECHNICAL FORMULA / DETAILS */}
              <div className="pt-2 border-t border-slate-800/60 font-mono text-[11px]">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-1">MATHEMATICAL / ALGORITHMIC SPECIFICATION</span>
                <div className="bg-slate-950 p-3 rounded text-indigo-300 border border-slate-800">
                  {sub.formulaOrDetails}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
