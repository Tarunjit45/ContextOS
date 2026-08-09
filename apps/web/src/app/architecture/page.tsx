'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SubsystemDetail {
  id: string;
  name: string;
  module: string;
  purpose: string;
  input: string;
  output: string;
  failureClass: string;
  specification: string;
}

const SUBSYSTEMS: SubsystemDetail[] = [
  {
    id: 'hybrid_retrieval',
    name: 'HYBRID RETRIEVAL',
    module: 'packages.retrieval.hybrid_retriever.HybridRetriever',
    purpose: 'Combines lexical BM25, character n-gram cosine similarity, entity hits, recency decay, and channel authority into a composite candidate score.',
    input: 'Sanitized User Query string, Workspace Document Index',
    output: 'Top-K (k=30) ranked candidate document objects with composite scores',
    failureClass: 'RETRIEVAL_FAILURE',
    specification: 'Score = 0.35*BM25 + 0.20*NGramSim + 0.15*EntityHits + 0.15*RecencyDecay + 0.15*SourceAuthority (CRM: 1.0 > Meeting: 0.85 > Email: 0.75 > Slack: 0.65 > Note: 0.50)'
  },
  {
    id: 'entity_resolution',
    name: 'ENTITY RESOLUTION',
    module: 'packages.retrieval.entity_resolver.EntityResolver',
    purpose: 'Disambiguates individuals sharing identical or similar names, emails, roles, and departments using a multi-attribute candidate scoring model.',
    input: 'Query text, Workspace Entity Registry (People, Companies, Projects)',
    output: 'Canonical entity ID (e.g. p_1), match confidence score, and explicit is_ambiguous flag',
    failureClass: 'ENTITY_RESOLUTION_FAILURE',
    specification: 'Attribute Weights: email (0.35), exact_name (0.25), role (0.20), department (0.10), suffix (0.10). Flags is_ambiguous=True if candidate score delta < 0.15.'
  },
  {
    id: 'temporal_state',
    name: 'TEMPORAL STATE RESOLUTION',
    module: 'packages.retrieval.temporal_resolver.TemporalStateResolver',
    purpose: 'Parses communications into discrete state transition events to reconstruct active attribute values valid at query timestamp.',
    input: 'Candidate communications, Target entity ID, Attribute name, Query timestamp',
    output: 'Active attribute state payload, valid_from / valid_until interval, and superseded event IDs',
    failureClass: 'TEMPORAL_FAILURE',
    specification: 'ActiveState(T) = argmax_{e in Events(T)} (valid_from_e, authority_e, confidence_e). Superseded events are tracked in provenance.'
  },
  {
    id: 'memory_ranking',
    name: 'MEMORY RANKING',
    module: 'packages.memory.memory_ranker.MemoryRanker',
    purpose: 'Ranks historical facts using relevance and intrinsic importance over pure chronological recency to retain critical early instructions.',
    input: 'Candidate evidence items, Query text, Time horizon delta',
    output: 'Re-ordered evidence array prioritized by Importance + Relevance > Recency',
    failureClass: 'MEMORY_FAILURE',
    specification: 'MemoryScore = 0.50*RelevanceScore + 0.35*ImportanceWeight + 0.15*DecayPenalty(t_gap)'
  },
  {
    id: 'context_graph',
    name: 'CONTEXT GRAPH',
    module: 'packages.graph.context_graph.ContextGraphEngine',
    purpose: 'Executes multi-hop graph path expansion across entity-project-meeting-decision relationships in NetworkX.',
    input: 'Resolved Entity IDs, Workspace NetworkX MultiDiGraph, Max Depth (2)',
    output: 'Sub-graph edge path array (e.g. Person p_1 -> Project proj_1001 -> Decision d_4)',
    failureClass: 'RELATIONSHIP_FAILURE',
    specification: 'Traverses edges (OWNS, BELONGS_TO, PARTICIPATED_IN, DECIDED) up to depth=2 with edge weight decay.'
  },
  {
    id: 'context_composer',
    name: 'CONTEXT COMPOSER',
    module: 'packages.context.context_compiler.DecisionGradeContextCompiler',
    purpose: 'Compiles subsystem outputs into a compact, structured, evidence-grounded context representation with provenance and answerability states.',
    input: 'Query, Selected Evidence, Resolved Entities, Active Temporal States, Sub-graph Paths, Token Budget',
    output: 'Structured Context string ([ENTITIES], [CURRENT STATE], [TIMELINE], [EVIDENCE], [ANSWERABILITY]), Token Telemetry',
    failureClass: 'CONTEXT_COMPOSITION_FAILURE & HALLUCINATION',
    specification: 'Output Sections: [ENTITIES], [CURRENT STATE], [TIMELINE], [RELATIONSHIPS], [EVIDENCE PROVENANCE], [CONFLICT RESOLUTION], [ANSWERABILITY], [CONFIDENCE]'
  }
];

export default function ArchitecturePage() {
  const [selectedNode, setSelectedNode] = useState<SubsystemDetail>(SUBSYSTEMS[0]);

  return (
    <div className="space-y-10 font-sans">
      {/* Page Title & Subtitle */}
      <div className="border-b border-[#252A31] pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-[#F4F5F7] tracking-tight">ARCHITECTURE</h1>
          <p className="text-[#9BA3AF] text-sm mt-1">From retrieval to decision-grade context.</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-[#15181D] border border-[#252A31] text-xs font-mono text-[#9BA3AF] hover:text-[#F4F5F7] transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* PIPELINE ARCHITECTURE DIAGRAM (INTERACTIVE NODES) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-[#66707D] font-bold uppercase tracking-wider">PIPELINE DIAGRAM (CLICK NODE TO INSPECT)</span>
          <span className="text-[#7C5CFC]">SELECTED: {selectedNode.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* BASELINE RAG PIPELINE */}
          <div className="p-6 rounded-lg bg-[#111419] border border-[#EF4444]/30 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-[#252A31] pb-3">
              <span className="font-bold text-[#9BA3AF]">BASELINE RAG</span>
              <span className="text-[10px] text-[#EF4444]">UNCOMPILED CONTEXT</span>
            </div>

            <div className="space-y-2 text-center text-[#9BA3AF]">
              <div className="p-3 rounded-lg bg-[#15181D] border border-[#252A31] font-bold text-[#F4F5F7]">QUERY</div>
              <div className="text-[#66707D]">↓</div>
              <div className="p-3 rounded-lg bg-[#15181D] border border-[#252A31]">BM25</div>
              <div className="text-[#66707D]">↓</div>
              <div className="p-3 rounded-lg bg-[#15181D] border border-[#EF4444]/40 text-[#EF4444]">TOP-K EVIDENCE</div>
              <div className="text-[#66707D]">↓</div>
              <div className="p-3 rounded-lg bg-[#15181D] border border-[#EF4444]/50 text-[#EF4444] font-bold">LLM SYSTEM PROMPT</div>
            </div>
          </div>

          {/* CONTEXTOS PIPELINE (INTERACTIVE) */}
          <div className="p-6 rounded-lg bg-[#111419] border border-[#7C5CFC]/40 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-[#252A31] pb-3">
              <span className="font-bold text-[#7C5CFC]">CONTEXTOS COMPILER</span>
              <span className="text-[10px] text-[#22C55E] font-bold">DECISION-GRADE</span>
            </div>

            <div className="space-y-2 text-center">
              <div className="p-3 rounded-lg bg-[#15181D] border border-[#252A31] font-bold text-[#F4F5F7]">QUERY</div>
              <div className="text-[#7C5CFC]">↓</div>

              {SUBSYSTEMS.map((sub) => {
                const isSelected = selectedNode.id === sub.id;
                return (
                  <React.Fragment key={sub.id}>
                    <button
                      onClick={() => setSelectedNode(sub)}
                      className={`w-full p-3 rounded-lg border text-left transition-all font-mono text-xs ${
                        isSelected
                          ? 'bg-[#7C5CFC]/15 border-[#7C5CFC] text-[#F4F5F7] font-bold shadow-sm'
                          : 'bg-[#15181D] border-[#252A31] text-[#9BA3AF] hover:border-[#9BA3AF] hover:text-[#F4F5F7]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{sub.name}</span>
                        {isSelected && <span className="text-[#7C5CFC] text-[10px]">● INSPECTING</span>}
                      </div>
                    </button>
                    <div className="text-[#7C5CFC]">↓</div>
                  </React.Fragment>
                );
              })}

              <div className="p-3 rounded-lg bg-[#15181D] border border-[#22C55E]/50 text-[#22C55E] font-bold">
                LLM SYSTEM PROMPT (-93.6% TOKENS)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NODE INSPECTOR PANEL */}
      <div className="p-6 rounded-lg bg-[#111419] border border-[#7C5CFC]/40 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-[#252A31] pb-3">
          <div className="flex items-center gap-3 font-mono">
            <span className="w-2.5 h-2.5 rounded bg-[#7C5CFC]" />
            <h3 className="text-lg font-semibold text-[#F4F5F7]">{selectedNode.name}</h3>
          </div>
          <code className="text-xs text-[#9BA3AF] font-mono bg-[#15181D] px-2.5 py-1 rounded border border-[#252A31]">
            {selectedNode.module}
          </code>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          {/* PURPOSE */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#66707D] uppercase tracking-widest block">PURPOSE</span>
            <p className="text-[#F4F5F7] leading-relaxed">{selectedNode.purpose}</p>
          </div>

          {/* FAILURE CLASS ADDRESSED */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest block">FAILURE CLASS ADDRESSED</span>
            <p className="text-[#F59E0B] font-mono font-bold">{selectedNode.failureClass}</p>
          </div>

          {/* INPUT */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#66707D] uppercase tracking-widest block">INPUT</span>
            <code className="text-[#9BA3AF] font-mono text-[11px] block bg-[#15181D] p-3 rounded border border-[#252A31]">
              {selectedNode.input}
            </code>
          </div>

          {/* OUTPUT */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#66707D] uppercase tracking-widest block">OUTPUT</span>
            <code className="text-[#22C55E] font-mono text-[11px] block bg-[#15181D] p-3 rounded border border-[#252A31]">
              {selectedNode.output}
            </code>
          </div>
        </div>

        {/* ALGORITHMIC SPECIFICATION */}
        <div className="pt-3 border-t border-[#252A31] font-mono text-xs">
          <span className="text-[#66707D] text-[10px] font-bold uppercase tracking-widest block mb-1">MATHEMATICAL / ALGORITHMIC SPECIFICATION</span>
          <div className="bg-[#15181D] p-3.5 rounded text-[#38BDF8] border border-[#252A31]">
            {selectedNode.specification}
          </div>
        </div>
      </div>
    </div>
  );
}
