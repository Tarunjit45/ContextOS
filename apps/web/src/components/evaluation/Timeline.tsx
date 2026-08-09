'use client';

import React from 'react';

interface TimelineEvent {
  date: string;
  label: string;
  source: string;
  status: 'error' | 'success' | 'active';
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="p-5 rounded-lg bg-[#15181D] border border-[#252A31] flex flex-col md:flex-row justify-around items-center gap-4 text-center font-mono text-xs">
      {events.map((ev, idx) => (
        <React.Fragment key={idx}>
          <div className="space-y-1">
            <div className="text-[#66707D] text-[10px]">{ev.date}</div>
            <div
              className={`font-bold text-sm ${
                ev.status === 'error'
                  ? 'text-[#EF4444]'
                  : ev.status === 'success' || ev.status === 'active'
                  ? 'text-[#22C55E]'
                  : 'text-[#F4F5F7]'
              }`}
            >
              {ev.label}
            </div>
            <div className="text-[#66707D] text-[10px]">{ev.source}</div>
          </div>
          {idx < events.length - 1 && (
            <div className="text-[#7C5CFC] font-bold text-base">↓</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
