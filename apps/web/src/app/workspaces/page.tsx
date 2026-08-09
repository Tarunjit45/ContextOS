'use client';

import React from 'react';

export default function WorkspacesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white">Simulated Organization — Acme Corporation</h1>
        <p className="text-xs text-slate-400 mt-1">Entity directory and multi-source context environment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="p-5 rounded-xl bg-[#0d0f17] border border-slate-800 space-y-3">
          <div className="text-blue-400 font-bold uppercase tracking-wider text-[11px]">People (4)</div>
          <div className="space-y-2 text-slate-300">
            <div className="p-2 bg-[#08090d] rounded border border-slate-800">
              <div className="font-bold text-white">John Smith</div>
              <div className="text-slate-500 text-[10px]">VP Sales • john@acme.com</div>
            </div>
            <div className="p-2 bg-[#08090d] rounded border border-slate-800">
              <div className="font-bold text-white">Sarah Chen</div>
              <div className="text-slate-500 text-[10px]">CTO • sarah@acme.com</div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0d0f17] border border-slate-800 space-y-3">
          <div className="text-purple-400 font-bold uppercase tracking-wider text-[11px]">Companies (3)</div>
          <div className="space-y-2 text-slate-300">
            <div className="p-2 bg-[#08090d] rounded border border-slate-800">
              <div className="font-bold text-white">Acme Corporation</div>
              <div className="text-slate-500 text-[10px]">Primary Host Domain • acme.com</div>
            </div>
            <div className="p-2 bg-[#08090d] rounded border border-slate-800">
              <div className="font-bold text-white">Globex Industries</div>
              <div className="text-slate-500 text-[10px]">Enterprise Account • globex.com</div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0d0f17] border border-slate-800 space-y-3">
          <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">Projects & Deals (3)</div>
          <div className="space-y-2 text-slate-300">
            <div className="p-2 bg-[#08090d] rounded border border-slate-800">
              <div className="font-bold text-white">Enterprise Deal #104</div>
              <div className="text-slate-500 text-[10px]">Owner: John Smith • Status: Negotiation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
