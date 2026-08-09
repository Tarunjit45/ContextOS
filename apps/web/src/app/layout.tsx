import React from 'react';
import '../index.css';
import AppShell from '../components/layout/AppShell';

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
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
