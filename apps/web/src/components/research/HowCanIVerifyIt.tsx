'use client';

import React from 'react';
import Link from 'next/link';
import CopyButton from '../ui/CopyButton';
import Button from '../ui/Button';

export default function HowCanIVerifyIt() {
  return (
    <div className="space-y-4 font-sans">
      <div className="border-b border-[#232731] pb-3">
        <h2 className="text-xl font-semibold text-[#F5F7FA] tracking-tight">How Can I Verify It?</h2>
        <p className="text-xs text-[#A7ADB8] mt-0.5">
          Follow these three steps to inspect, reproduce, and trace the benchmark yourself.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
        {/* STEP 01 */}
        <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="font-mono text-[#7C5CFC] font-bold text-sm">01 — Inspect</div>
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Inspect Methodology & Limitations</h3>
            <p className="text-[#A7ADB8] leading-relaxed">
              Every benchmark result is documented with its methodology, frozen dataset version, seed 42, and directional limitations.
            </p>
          </div>
          <Link href="/benchmarks" className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              Read Benchmark Methodology →
            </Button>
          </Link>
        </div>

        {/* STEP 02 */}
        <div className="p-6 rounded-lg bg-[#111318] border border-[#7C5CFC]/40 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="font-mono text-[#7C5CFC] font-bold text-sm">02 — Reproduce</div>
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Run Reproduction Commands</h3>
            <p className="text-[#A7ADB8] leading-relaxed">
              Clone the repository and run the validation commands yourself in terminal:
            </p>
            <div className="space-y-2 pt-1 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-[#0D0F12] border border-[#232731] flex justify-between items-center text-[#4F8CFF]">
                <code className="truncate">python cli/contextos.py benchmark validate-dataset</code>
                <CopyButton text="python cli/contextos.py benchmark validate-dataset" />
              </div>
              <div className="p-2.5 rounded bg-[#0D0F12] border border-[#232731] flex justify-between items-center text-[#4F8CFF]">
                <code>python -m pytest -v</code>
                <CopyButton text="python -m pytest -v" />
              </div>
            </div>
          </div>
          <Link href="/reproducibility" className="pt-2">
            <Button variant="primary" size="sm" className="w-full">
              View All Reproduction Steps →
            </Button>
          </Link>
        </div>

        {/* STEP 03 */}
        <div className="p-6 rounded-lg bg-[#111318] border border-[#232731] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="font-mono text-[#7C5CFC] font-bold text-sm">03 — Inspect Traces</div>
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Inspect Forensic Traces</h3>
            <p className="text-[#A7ADB8] leading-relaxed">
              Evaluation traces and representative failures show exactly what evidence was retrieved and why a decision succeeded or failed.
            </p>
          </div>
          <Link href="/evaluations" className="pt-2">
            <Button variant="secondary" size="sm" className="w-full">
              Explore Evaluation Browser →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
