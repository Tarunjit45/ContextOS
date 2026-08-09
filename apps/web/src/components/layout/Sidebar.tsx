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

  const groups = [
    {
      title: 'RESEARCH',
      items: [
        { href: '/', label: 'Overview', icon: LayoutDashboard },
        { href: '/architecture', label: 'Architecture', icon: Layers },
        { href: '/benchmarks', label: 'Benchmarks', icon: BarChart3 },
      ],
    },
    {
      title: 'EVALUATION',
      items: [
        { href: '/evaluations', label: 'Evaluations', icon: Search },
        { href: '/failures', label: 'Failures', icon: AlertOctagon },
      ],
    },
    {
      title: 'REPRODUCTION',
      items: [
        { href: '/reproducibility', label: 'Reproducibility', icon: ShieldCheck },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { href: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-[250px] bg-[#0D0F12] border-r border-[#232731] flex flex-col justify-between p-5 shrink-0 font-sans text-xs select-none">
      {/* Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#7C5CFC] flex items-center justify-center text-white font-bold font-mono text-xs shadow-sm">
            C
          </div>
          <div>
            <div className="font-bold text-[#F5F7FA] tracking-wider text-sm font-mono">CONTEXTOS</div>
            <div className="text-[10px] text-[#A7ADB8]">Agent Memory Research Lab</div>
          </div>
        </div>

        {/* Grouped Navigation */}
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold text-[#6B7280] uppercase tracking-wider px-2">
                {group.title}
              </div>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md font-sans text-xs transition-colors ${
                        isActive
                          ? 'bg-[#7C5CFC]/10 text-[#F5F7FA] font-medium border-l-2 border-[#7C5CFC]'
                          : 'text-[#A7ADB8] hover:text-[#F5F7FA] hover:bg-[#171A20]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#7C5CFC]' : 'text-[#6B7280]'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* System Status Footer */}
      <div className="pt-4 border-t border-[#232731] space-y-2 font-mono text-[11px]">
        <div className="flex items-center justify-between text-[#A7ADB8]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#32D583]" />
            <span className="text-[#F5F7FA] font-bold">LOCAL</span>
          </span>
          <span className="text-[#32D583]">API ●</span>
        </div>
        <div className="flex items-center justify-between text-[#A7ADB8] text-[10px]">
          <span>Dataset v1</span>
          <span className="text-[#32D583] font-bold">✓ VERIFIED</span>
        </div>
      </div>
    </aside>
  );
}
