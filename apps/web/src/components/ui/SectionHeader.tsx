'use client';

import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'purple' | 'green' | 'amber' | 'blue';
  action?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  badge,
  badgeColor = 'purple',
  action
}: SectionHeaderProps) {
  const badgeClasses = {
    purple: 'bg-[#7C5CFC]/10 text-[#7C5CFC] border-[#7C5CFC]/20',
    green: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    amber: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    blue: 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20',
  }[badgeColor];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#252A31] pb-4 font-mono">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-[#F4F5F7] tracking-tight">{title}</h2>
          {badge && (
            <span className={`px-2.5 py-0.5 rounded border text-[11px] font-bold ${badgeClasses}`}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-[#9BA3AF] font-sans mt-1">{subtitle}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
