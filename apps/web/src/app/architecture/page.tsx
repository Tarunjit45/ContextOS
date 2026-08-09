'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NodeInspector, { SubsystemDetail } from '../../components/architecture/NodeInspector';

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
    name: 'TEMPORAL STATE RESOLVER',
    module: 'packages.retrieval.temporal_resolver.TemporalStateResolver',
    purpose: 'Parses communications into discrete state transition events to reconstruct active attribute values valid at query timestamp.',
    input: 'Candidate communications, Target entity ID, Attribute name, Query timestamp',
    output: 'Active attribute state payload, valid_from / valid_until interval, and superseded event IDs',
    failureClass: 'TEMPORAL_RETRIEVAL_FAILURE',
    specification: 'ActiveState(T) = argmax_{e in Events(T)} (valid_from_e, authority_e, confidence_e). Superseded events tracked in provenance.'
  },
  {
    id: 'memory_ranking',
    name: 'MEMORY RANKING',
    module: 'packages.memory.memory_ranker.MemoryRanker',
    purpose: 'Ranks historical facts using relevance and intrinsic importance over pure chronological recency to retain critical early instructions.',
    input: 'Candidate evidence items, Query text, Time horizon delta',
    output: 'Re-ordered evidence array prioritized by Importance + Relevance > Recency',
    failureClass: 'MEMORY_DECAY_FAILURE',
    specification: 'MemoryScore = 0.50*RelevanceScore + 0.35*ImportanceWeight + 0.15*DecayPenalty(t_gap)'
  },
  {
    id: 'context_graph',
    name: 'CONTEXT GRAPH',
    module: 'packages.graph.context_graph.ContextGraphEngine',
    purpose: 'Executes multi-hop graph path expansion across entity-project-meeting-decision relationships in NetworkX.',
    input: 'Resolved Entity IDs, Workspace NetworkX MultiDiGraph, Max Depth (2)',
    output: 'Sub-graph edge path array (e.g. Person p_1 -> Project proj_1001 -> Decision d_4)',
    failureClass: 'MULTI_HOP_RELATIONSHIP_FAILURE',
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
  const [selectedNode, setSelectedNode] = useState<SubsystemDetail>(SUBSYSTEMS[2]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-[#232731] pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-[#F5F7FA] tracking-tight">ARCHITECTURE</h1>
          <p className="text-[#A7ADB8] text-sm mt-1">From retrieval to decision-grade context compilation.</p>
        </div>
        <Link
          href="/"
          className="px-3 py-1.5 rounded-md bg-[#111318] border border-[#232731] text-xs font-mono text-[#A7ADB8] hover:text-[#F5F7FA] transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* PIPELINE ARCHITECTURE (DOMINANT VIEW) */}
      <div className="space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between text-[#6B7280]">
          <span className="font-bold uppercase tracking-wider">CONTEXT COMPILATION PIPELINE (CLICK NODE TO INSPECT)</span>
          <span className="text-[#7C5CFC]">SELECTED: {selectedNode.name}</span>
        </div>

        <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-3 text-center">
          <div className="p-3 rounded-md bg-[#171A20] border border-[#232731] font-bold text-[#F5F7FA] max-w-sm mx-auto">
            User Query
          </div>
          <div className="text-[#7C5CFC] font-bold">↓</div>

          {SUBSYSTEMS.map((sub) => {
            const isSelected = selectedNode.id === sub.id;
            return (
              <React.Fragment key={sub.id}>
                <button
                  onClick={() => setSelectedNode(sub)}
                  className={`w-full max-w-xl p-3.5 rounded-md border text-left transition-all font-mono text-xs mx-auto block ${
                    isSelected
                      ? 'bg-[#7C5CFC]/15 border-[#7C5CFC] text-[#F5F7FA] font-bold shadow-sm'
                      : 'bg-[#171A20] border-[#232731] text-[#A7ADB8] hover:border-[#A7ADB8] hover:text-[#F5F7FA]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{sub.name}</span>
                    {isSelected ? (
                      <span className="text-[#7C5CFC] text-[10px]">● INSPECTING</span>
                    ) : (
                      <span className="text-[#6B7280] text-[10px]">{sub.failureClass}</span>
                    )}
                  </div>
                </button>
                <div className="text-[#7C5CFC] font-bold">↓</div>
              </React.Fragment>
            );
          })}

          <div className="p-3.5 rounded-md bg-[#171A20] border border-[#32D583]/50 text-[#32D583] font-bold max-w-sm mx-auto">
            LLM System Prompt (-93.6% Tokens)
          </div>
        </div>
      </div>

      {/* SELECTED COMPONENT INSPECTOR */}
      <NodeInspector node={selectedNode} />
    </div>
  );
}
