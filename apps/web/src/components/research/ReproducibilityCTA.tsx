'use client';

import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import CopyButton from '../ui/CopyButton';
import { ExternalLink, Terminal, GitBranch } from 'lucide-react';

export default function ReproducibilityCTA() {
  return (
    <div className="p-8 rounded-xl bg-[#111318] border border-[#232731] space-y-6 text-center font-sans">
      <div className="max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold text-[#F5F7FA] tracking-tight">Don't Take Our Word For It</h2>
        <p className="text-sm text-[#A7ADB8] leading-relaxed">
          ContextOS is open-source. Inspect the implementation, reproduce the benchmark, and examine the evaluation traces yourself.
        </p>
      </div>

      <div className="p-4 rounded-lg bg-[#0D0F12] border border-[#232731] max-w-xl mx-auto flex items-center justify-between font-mono text-xs text-[#4F8CFF]">
        <div className="flex items-center gap-2 truncate">
          <Terminal className="w-4 h-4 text-[#7C5CFC] shrink-0" />
          <span className="truncate">git clone https://github.com/Tarunjit45/ContextOS.git</span>
        </div>
        <CopyButton text="git clone https://github.com/Tarunjit45/ContextOS.git" />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4">
        <a
          href="https://github.com/Tarunjit45/ContextOS"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            View on GitHub
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </a>

        <Link href="/reproducibility">
          <Button variant="secondary">Reproduce Benchmark</Button>
        </Link>

        <Link href="/evaluations">
          <Button variant="outline">Explore Evaluation Traces</Button>
        </Link>
      </div>
    </div>
  );
}
