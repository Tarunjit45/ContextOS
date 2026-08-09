'use client';

import React from 'react';
import Link from 'next/link';
import Badge from '../../components/ui/Badge';

export default function SettingsPage() {
  return (
    <div className="space-y-8 font-sans text-[#F5F7FA]">
      {/* Header */}
      <div className="border-b border-[#232731] pb-6 flex justify-between items-start font-mono">
        <div>
          <h1 className="text-2xl font-semibold text-[#F5F7FA] tracking-tight">Settings</h1>
          <p className="text-sm text-[#A7ADB8] mt-1 font-sans">
            Environment indicators and benchmark execution configuration.
          </p>
        </div>
        <Link
          href="/"
          className="px-3 py-1.5 rounded-md bg-[#111318] border border-[#232731] text-xs text-[#A7ADB8] hover:text-[#F5F7FA] transition-colors font-mono"
        >
          ← Overview
        </Link>
      </div>

      {/* Simple Settings Section */}
      <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-6">
        <div className="flex justify-between items-center font-mono text-xs">
          <span className="font-bold text-[#F5F7FA] uppercase tracking-wider">EVALUATION & ENVIRONMENT CONFIGURATION</span>
          <Badge variant="success">LOCAL API ONLINE</Badge>
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-md bg-[#171A20] border border-[#232731] flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <div className="text-[#A7ADB8] text-[11px]">LLM Provider</div>
              <div className="font-bold text-[#F5F7FA] text-sm font-sans mt-0.5">OpenRouter / Ollama / OpenAI / Mock</div>
            </div>
            <span className="text-[#7C5CFC] font-bold text-xs bg-[#7C5CFC]/10 px-2.5 py-1 rounded border border-[#7C5CFC]/20">
              openrouter/free
            </span>
          </div>

          <div className="p-4 rounded-md bg-[#171A20] border border-[#232731] flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <div className="text-[#A7ADB8] text-[11px]">Context Composition Mode</div>
              <div className="font-bold text-[#F5F7FA] text-sm font-sans mt-0.5">Decision-Grade Context Compiler</div>
            </div>
            <span className="text-[#32D583] font-bold text-xs bg-[#32D583]/10 px-2.5 py-1 rounded border border-[#32D583]/20">
              COMPACT MODE (-93.6%)
            </span>
          </div>

          <div className="p-4 rounded-md bg-[#171A20] border border-[#232731] flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <div className="text-[#A7ADB8] text-[11px]">Generation & Safety Limits</div>
              <div className="font-bold text-[#F5F7FA] text-sm font-sans mt-0.5">Temperature: 0.0 | Max Tokens: 512 | Cost Guard: $5.00</div>
            </div>
            <span className="text-[#4F8CFF] font-bold text-xs bg-[#4F8CFF]/10 px-2.5 py-1 rounded border border-[#4F8CFF]/20">
              FROZEN CONTROL
            </span>
          </div>

          <div className="p-4 rounded-md bg-[#171A20] border border-[#232731] flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <div className="text-[#A7ADB8] text-[11px]">Dataset v1 Hash Guard</div>
              <div className="font-bold text-[#F5F7FA] text-sm font-sans mt-0.5">Seed 42 (1,000 unique scenarios)</div>
            </div>
            <code className="text-[#32D583] font-mono text-[11px] bg-[#0D0F12] px-2.5 py-1 rounded border border-[#232731]">
              2ba27191...12fa
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
