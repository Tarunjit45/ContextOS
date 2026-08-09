import React from 'react';
import '../index.css';
import Link from 'next/link';

export const metadata = {
  title: 'ContextOS — Agent Memory & Context Evaluation Platform',
  description: 'Local-first developer platform for stress-testing AI agent memory & context.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08090d] text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="h-12 bg-[#0d0f17] border-b border-slate-800/80 px-6 flex items-center justify-between font-mono text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-widest uppercase">CONTEXTOS</span>
            <span className="text-[10px] text-slate-500">| Agent Memory Evaluation Laboratory</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-bold tracking-wider uppercase text-[10px]">● LOCAL</span>
          </div>
        </header>

        {/* Main Body Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <aside className="w-60 bg-[#0d0f17] border-r border-slate-800/80 flex flex-col justify-between p-3 shrink-0 font-mono text-xs">
            <nav className="space-y-1">
              {[
                { href: '/', label: 'OVERVIEW' },
                { href: '/architecture', label: 'ARCHITECTURE' },
                { href: '/benchmarks', label: 'BENCHMARKS' },
                { href: '/evaluations/1247', label: 'EVALUATION #1247', signature: true },
                { href: '/failures', label: 'FAILURES EXPLORER' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors ${
                    item.signature ? 'text-blue-400 font-bold bg-blue-950/20 border border-blue-800/30' : ''
                  }`}
                >
                  <span>{item.label}</span>
                  {item.signature && (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-blue-600 text-white font-bold">
                      DEMO
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
              <Link href="/settings" className="hover:text-slate-300 transition-colors">
                Settings
              </Link>
            </div>
          </aside>

          {/* Main Workspace Area */}
          <main className="flex-1 overflow-y-auto bg-[#08090d] p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
