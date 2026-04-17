'use client';

import React from 'react';
import SectionHeader from './SectionHeader';
import BrandCta from './BrandCta';

interface CtaSectionProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref?: string;
  variant?: 'dark' | 'light' | 'minimal';
  watermark?: React.ReactNode;
  onPrimaryClick?: () => void;
}

const VARIANT_CLASSES = {
  dark: 'text-center p-8 sm:p-12 md:p-24 rounded-3xl relative overflow-hidden shadow-md mb-16 bg-primary',
  light: 'text-center bg-surface-ground border border-border p-8 sm:p-16 md:p-24 rounded-3xl relative overflow-hidden shadow-sm mb-16',
  minimal: 'text-center pt-12 sm:pt-16 pb-6 sm:pb-8 border-t border-border bg-surface-ground rounded-2xl mb-16 px-4 sm:px-6',
} as const;

export default function CtaSection({
  title,
  subtitle,
  buttonText,
  buttonHref = '/assessment',
  variant = 'dark',
  watermark,
  onPrimaryClick,
}: CtaSectionProps) {
  const isDark = variant === 'dark';
  const isMinimal = variant === 'minimal';

  return (
    <section className={VARIANT_CLASSES[variant]}>
      {watermark && !isMinimal && (
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
          {watermark}
        </div>
      )}

      <div className="relative z-10 max-w-2xl mx-auto">
        <SectionHeader
          title={title}
          titleLevel={2}
          subtitle={subtitle}
          align="center"
          className={isDark ? '[&_h2]:!text-white [&_p]:!text-white/75' : ''}
          actions={
            <BrandCta
              primary={{ text: buttonText, href: buttonHref }}
              align="center"
              buttonType={isDark ? 'default' : 'primary'}
              onPrimaryClick={onPrimaryClick}
            />
          }
        />
      </div>
    </section>
  );
}
