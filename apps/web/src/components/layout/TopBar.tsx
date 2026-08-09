'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Settings } from 'lucide-react';

export default function TopBar() {
  const pathname = usePathname();

  const getBreadcrumb = (path: string) => {
    if (path === '/') return 'Overview';
    if (path.startsWith('/architecture')) return 'Architecture';
    if (path.startsWith('/benchmarks')) return 'Benchmarks';
    if (path === '/evaluations/1247') return 'Evaluations / #1247';
    if (path.startsWith('/evaluations')) return 'Evaluations';
    if (path.startsWith('/failures')) return 'Failures';
    if (path.startsWith('/reproducibility')) return 'Reproducibility';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Console';
  };

  return (
    <header className="h-14 bg-[#0D0F12] border-b border-[#232731] px-8 flex items-center justify-between font-mono text-xs text-[#A7ADB8] shrink-0">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-[#6B7280]">ContextOS</span>
        <span className="text-[#6B7280]">/</span>
        <span className="font-semibold text-[#F5F7FA] font-sans text-sm">
          {getBreadcrumb(pathname)}
        </span>
      </div>

      {/* Right: Dataset & Environment Indicators */}
      <div className="flex items-center gap-6 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-[#6B7280]">Dataset:</span>
          <span className="text-[#F5F7FA]">Dataset v1</span>
          <span className="text-[#32D583] font-bold">✓ VERIFIED</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#32D583]" />
          <span className="text-[#F5F7FA] font-bold">LOCAL API</span>
        </div>

        <div className="flex items-center gap-3 border-l border-[#232731] pl-4">
          <a
            href="https://github.com/Tarunjit45/ContextOS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#A7ADB8] hover:text-[#F5F7FA] transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
          <Link href="/settings" className="text-[#A7ADB8] hover:text-[#F5F7FA] transition-colors">
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
