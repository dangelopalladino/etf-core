import React from 'react';

/**
 * Server-safe typography for components where AntD Typography cannot be
 * imported (it requires 'use client'). Heading sizes mirror HEADING_SCALE in
 * `@dangelopalladino/etf-core/tokens/shared` — single source of truth.
 */

interface ServerHeadingProps {
  level?: 1 | 2 | 3 | 4;
  weight?: 'bold' | 'semibold';
  children: React.ReactNode;
  className?: string;
}

const HEADING_SIZES: Record<number, string> = {
  1: 'text-[30px] md:text-[36px] lg:text-[44px] tracking-[-0.02em] lg:tracking-[-0.03em] leading-[1.15] mb-6',
  2: 'text-[24px] md:text-[30px] leading-[1.2] mb-6',
  3: 'text-[20px] md:text-[24px] leading-[1.25] mb-4',
  4: 'text-[16px] md:text-[20px] leading-[1.3] mb-3',
};

export function ServerHeading({ level = 2, weight = 'bold', children, className = '' }: ServerHeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  const base = `font-serif ${weight === 'bold' ? 'font-bold' : 'font-semibold'} text-primary`;
  return <Tag className={`${base} ${HEADING_SIZES[level]} ${className}`.trim()}>{children}</Tag>;
}

interface ServerTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span';
  variant?: 'body' | 'secondary' | 'muted' | 'eyebrow' | 'caption';
}

export function ServerText({ children, className = '', as: Tag = 'p', variant = 'body' }: ServerTextProps) {
  const variants: Record<string, string> = {
    body: 'text-base md:text-lg leading-relaxed text-text-secondary',
    secondary: 'text-sm leading-relaxed text-text-secondary/70',
    muted: 'text-sm text-text-secondary/50',
    eyebrow: 'text-sm font-semibold uppercase tracking-[0.1em] text-accent',
    caption: 'text-xs leading-relaxed text-text-secondary/60',
  };
  return <Tag className={`${variants[variant]} ${className}`.trim()}>{children}</Tag>;
}
