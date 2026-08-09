'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import EvaluationRow, { EvaluationRowData } from '../../components/evaluation/EvaluationRow';

const EVALUATION_ITEMS: EvaluationRowData[] = [
  {
    id: '1247',
    query: 'Should we follow up with Initech regarding Project #1001?',
    category: 'temporal',
    categoryLabel: 'Temporal Conflict',
    contextosResult: 'CONTACT ✓',
    status: 'PASSED',
    latency: '5.97s',
    tokens: 420,
  },
  {
    id: '1246',
    query: 'Which John Smith holds the role of VP Sales in Executive Sales?',
    category: 'entity',
    categoryLabel: 'Entity Resolution',
    contextosResult: 'DISAMBIGUATED ✓',
    status: 'PASSED',
    latency: '4.12s',
    tokens: 380,
  },
  {
    id: '1245',
    query: 'What ARR contract value was finalized in the meeting for Project #1001?',
    category: 'multihop',
    categoryLabel: 'Multi-Hop Relationship',
    contextosResult: '$150k ARR ✓',
    status: 'PASSED',
    latency: '4.85s',
    tokens: 450,
  },
  {
    id: '1244',
    query: 'What is the security bypass code for Acme Server Vault #101?',
    category: 'memory',
    categoryLabel: 'Memory Decay',
    contextosResult: '1007-AB ✓',
    status: 'PASSED',
    latency: '3.90s',
    tokens: 310,
  },
  {
    id: '1243',
    query: 'Is Project #1001 approved by finance as of 2026-01-14?',
    category: 'contradiction',
    categoryLabel: 'Contradiction',
    contextosResult: 'APPROVED ✓',
    status: 'PASSED',
    latency: '4.20s',
    tokens: 395,
  },
  {
    id: '1242',
    query: 'What is the unannounced Q1 discount percentage promised to Acme?',
    category: 'missing',
    categoryLabel: 'Missing Info',
    contextosResult: 'INSUFFICIENT ✓',
    status: 'PASSED',
    latency: '3.50s',
    tokens: 280,
  }
];

export default function EvaluationsBrowserPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = EVALUATION_ITEMS.filter((item) => {
    const matchesCategory = filter === 'all' || item.category === filter;
    const matchesSearch = search === '' || item.query.toLowerCase().includes(search.toLowerCase()) || item.id.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="border-b border-[#232731] pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-[#F5F7FA] tracking-tight">Evaluations</h1>
          <p className="text-[#A7ADB8] text-sm mt-1">Diagnostic evaluation trace browser.</p>
        </div>
        <Link
          href="/"
          className="px-3 py-1.5 rounded-md bg-[#111318] border border-[#232731] text-xs font-mono text-[#A7ADB8] hover:text-[#F5F7FA] transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 font-mono text-xs">
        <input
          type="text"
          placeholder="Search evaluations by ID or query text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-md bg-[#111318] border border-[#232731] text-[#F5F7FA] placeholder-[#6B7280] focus:outline-none focus:border-[#7C5CFC]"
        />

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'temporal', label: 'Temporal' },
            { id: 'memory', label: 'Memory' },
            { id: 'entity', label: 'Entity' },
            { id: 'contradiction', label: 'Contradiction' },
            { id: 'multihop', label: 'Multi-Hop' },
            { id: 'missing', label: 'Missing Info' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md border transition-colors ${
                filter === tab.id
                  ? 'bg-[#7C5CFC] border-[#7C5CFC] text-white font-bold'
                  : 'bg-[#111318] border-[#232731] text-[#A7ADB8] hover:border-[#A7ADB8] hover:text-[#F5F7FA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Evaluation Rows List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[#6B7280] bg-[#111318] rounded-md border border-[#232731]">
            No evaluations match your search filter.
          </div>
        ) : (
          filtered.map((item) => <EvaluationRow key={item.id} data={item} />)
        )}
      </div>
    </div>
  );
}
