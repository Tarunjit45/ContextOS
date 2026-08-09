'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Settings } from 'lucide-react';

export default function TopBar() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === '/') return 'OVERVIEW';
    if (path.startsWith('/architecture')) return 'ARCHITECTURE';
    if (path.startsWith('/benchmarks')) return 'BENCHMARKS';
    if (path === '/evaluations/1247') return 'SIGNATURE EVALUATION #1247';
    if (path.startsWith('/evaluations')) return 'EVALUATIONS BROWSER';
    if (path.startsWith('/failures')) return 'FAILURE ANALYSIS';
    if (path.startsWith('/reproducibility')) return 'REPRODUCIBILITY';
    if (path.startsWith('/settings')) return 'SETTINGS';
    return 'CONTEXTOS CONSOLE';
  };

  return (
    <header className="h-12 bg-[#0D0F12] border-b border-[#252A31] px-6 flex items-center justify-between font-mono text-xs text-[#9BA3AF] shrink-0">
      {/* Current Page Title */}
      <div className="flex items-center gap-3">
        <span className="font-bold text-[#F4F5F7] tracking-wider uppercase text-xs">
          {getPageTitle(pathname)}
        </span>
      </div>

      {/* Right Metadata */}
      <div className="flex items-center gap-6 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-[#66707D]">Dataset:</span>
          <span className="text-[#F4F5F7]">Dataset v1</span>
          <span className="text-[#22C55E] font-bold">✓ VERIFIED</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-[#F4F5F7] font-bold">LOCAL</span>
        </div>

        <div className="flex items-center gap-3 border-l border-[#252A31] pl-4">
          <a
            href="https://github.com/Tarunjit45/ContextOS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9BA3AF] hover:text-[#F4F5F7] transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
          <Link href="/settings" className="text-[#9BA3AF] hover:text-[#F4F5F7] transition-colors">
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
