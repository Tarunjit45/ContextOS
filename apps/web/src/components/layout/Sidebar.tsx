'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  BarChart3,
  Search,
  AlertOctagon,
  ShieldCheck,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { href: '/', label: 'OVERVIEW', icon: LayoutDashboard },
    { href: '/architecture', label: 'ARCHITECTURE', icon: Layers },
    { href: '/benchmarks', label: 'BENCHMARKS', icon: BarChart3 },
    { href: '/evaluations', label: 'EVALUATIONS', icon: Search },
    { href: '/failures', label: 'FAILURE ANALYSIS', icon: AlertOctagon },
  ];

  const secondaryNav = [
    { href: '/reproducibility', label: 'REPRODUCIBILITY', icon: ShieldCheck },
    { href: '/settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <aside className="w-[250px] bg-[#0D0F12] border-r border-[#252A31] flex flex-col justify-between p-4 shrink-0 font-sans text-xs select-none">
      {/* Top Header & Brand */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="w-6 h-6 rounded bg-[#7C5CFC] flex items-center justify-center text-white font-bold font-mono text-xs shadow-sm">
            C
          </div>
          <div>
            <div className="font-bold text-[#F4F5F7] tracking-widest text-sm font-mono">CONTEXTOS</div>
            <div className="text-[10px] text-[#9BA3AF] font-sans">Agent Memory Evaluation Lab</div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-xs transition-colors ${
                  isActive
                    ? 'bg-[#7C5CFC]/15 text-[#F4F5F7] font-bold border-l-2 border-[#7C5CFC]'
                    : 'text-[#9BA3AF] hover:text-[#F4F5F7] hover:bg-[#15181D]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#7C5CFC]' : 'text-[#66707D]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#1B1F24] my-2" />

        {/* Secondary Navigation */}
        <nav className="space-y-1">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-xs transition-colors ${
                  isActive
                    ? 'bg-[#7C5CFC]/15 text-[#F4F5F7] font-bold border-l-2 border-[#7C5CFC]'
                    : 'text-[#9BA3AF] hover:text-[#F4F5F7] hover:bg-[#15181D]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#7C5CFC]' : 'text-[#66707D]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom System Status */}
      <div className="pt-4 border-t border-[#1B1F24] space-y-2 font-mono text-[11px]">
        <div className="text-[#66707D] text-[10px] font-bold uppercase tracking-wider">SYSTEM</div>
        <div className="flex items-center justify-between text-[#9BA3AF]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span className="text-[#F4F5F7]">LOCAL</span>
          </span>
          <span className="text-[#66707D]">v1.0.0</span>
        </div>
        <div className="flex items-center justify-between text-[#9BA3AF] text-[10px]">
          <span>Dataset v1</span>
          <span className="text-[#22C55E] font-bold">✓ VERIFIED</span>
        </div>
      </div>
    </aside>
  );
}
