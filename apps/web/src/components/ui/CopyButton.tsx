'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D0F12] border border-[#232731] text-[#A7ADB8] hover:text-[#F5F7FA] transition-colors font-mono text-[10px]"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-[#32D583]" />
          <span className="text-[#32D583] font-bold">COPIED</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>COPY</span>
        </>
      )}
    </button>
  );
}
