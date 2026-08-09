import React from 'react';
import '../index.css';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';

export const metadata = {
  title: 'ContextOS — Agent Memory & Context Evaluation Laboratory',
  description: 'Local-first developer platform for evaluating agent memory and operational context.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08090B] text-[#F4F5F7] font-sans antialiased selection:bg-[#7C5CFC] selection:text-white min-h-screen flex flex-col">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-[#08090B] p-6 lg:p-8 flex justify-center">
            <div className="w-full max-w-[1400px]">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
