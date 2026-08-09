'use client';

import React from 'react';
import { AlertCircle, Cpu, CheckCircle } from 'lucide-react';

export default function SimpleHowItWorks() {
  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between font-mono text-xs border-b border-[#232731] pb-3">
        <span className="font-bold text-[#F5F7FA] uppercase tracking-wider">HOW CONTEXTOS WORKS (IN 3 SIMPLE STEPS)</span>
        <span className="text-[#A7ADB8]">SUPER EASY EXPLANATION</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
        {/* STEP 1 */}
        <div className="p-5 rounded-lg bg-[#111318] border border-[#232731] space-y-2.5">
          <div className="flex items-center gap-2 text-[#F97066]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-bold font-mono uppercase text-[11px]">STEP 1: THE PROBLEM</span>
          </div>
          <h3 className="text-sm font-semibold text-[#F5F7FA]">Traditional RAG Gets Confused</h3>
          <p className="text-[#A7ADB8] leading-relaxed">
            Standard AI search pulls old files (like an outdated Day 1 hold notice) or confuses two people with the same name.
          </p>
        </div>

        {/* STEP 2 */}
        <div className="p-5 rounded-lg bg-[#111318] border border-[#7C5CFC]/40 space-y-2.5">
          <div className="flex items-center gap-2 text-[#7C5CFC]">
            <Cpu className="w-4 h-4 shrink-0" />
            <span className="font-bold font-mono uppercase text-[11px]">STEP 2: THE FIX</span>
          </div>
          <h3 className="text-sm font-semibold text-[#F5F7FA]">ContextOS Cleans & Compiles</h3>
          <p className="text-[#A7ADB8] leading-relaxed">
            ContextOS checks timestamps, disambiguates names, and strips out 93.6% of useless word bloat before sending it to the AI.
          </p>
        </div>

        {/* STEP 3 */}
        <div className="p-5 rounded-lg bg-[#111318] border border-[#32D583]/40 space-y-2.5">
          <div className="flex items-center gap-2 text-[#32D583]">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="font-bold font-mono uppercase text-[11px]">STEP 3: THE RESULT</span>
          </div>
          <h3 className="text-sm font-semibold text-[#F5F7FA]">Correct Decisions Every Time</h3>
          <p className="text-[#A7ADB8] leading-relaxed">
            The AI gets decision-ready facts and makes the correct call (90% accuracy vs 50% baseline) at a fraction of the cost.
          </p>
        </div>
      </div>
    </div>
  );
}
