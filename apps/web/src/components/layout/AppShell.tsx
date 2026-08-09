'use client';

import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#08090B] text-[#F5F7FA] font-sans antialiased min-h-screen flex flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#08090B] p-8 lg:px-10 lg:py-8 flex justify-center">
          <div className="w-full max-w-[1400px] space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
