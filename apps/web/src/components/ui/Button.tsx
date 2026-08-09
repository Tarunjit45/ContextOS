'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'rounded-md font-mono font-bold uppercase transition-colors inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-[#7C5CFC] hover:bg-[#6b4bf0] text-white shadow-sm',
    secondary: 'bg-[#111318] border border-[#232731] hover:border-[#7C5CFC]/50 text-[#F5F7FA]',
    outline: 'bg-transparent border border-[#232731] hover:border-[#A7ADB8] text-[#A7ADB8] hover:text-[#F5F7FA]',
    ghost: 'bg-transparent text-[#A7ADB8] hover:text-[#F5F7FA] hover:bg-[#171A20]',
  }[variant];

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[11px]',
    md: 'px-4 py-2 text-xs tracking-wider',
    lg: 'px-5 py-2.5 text-xs tracking-wider',
  }[size];

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
