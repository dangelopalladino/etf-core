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
  /**
   * Size for the primary CTA button. Defaults to `'large'` because CtaSection
   * is itself a hero/conversion surface and the larger button is editorially
   * intentional here. Set to `'middle'` for tighter compositions.
   *
   * Pinned explicitly so the section does not silently track future
   * `BrandCta` default changes.
   */
  ctaSize?: 'middle' | 'large';
}

// Radius caps at rounded-[20px] per DESIGN.md (eslint.config.mjs bans
// rounded-3xl). Padding ramps mobile-first via fluid clamp(): 24px → 64px
// across 375 → 1440 viewports (preserves prior endpoints; smooths the
// intermediate steps that previously laddered at sm: / md:).
const VARIANT_CLASSES = {
  dark: 'text-center p-[clamp(1.5rem,3.756vw+0.620rem,4rem)] rounded-[20px] relative overflow-hidden shadow-md mb-[clamp(3rem,1.502vw+2.648rem,4rem)] bg-primary',
  light: 'text-center bg-surface-ground border border-border p-[clamp(1.5rem,3.756vw+0.620rem,4rem)] rounded-[20px] relative overflow-hidden shadow-sm mb-[clamp(3rem,1.502vw+2.648rem,4rem)]',
  minimal: 'text-center py-[clamp(2rem,5vw,4rem)] border-t border-border bg-surface-ground rounded-2xl mb-[clamp(3rem,1.502vw+2.648rem,4rem)] px-[clamp(1rem,0.751vw+0.824rem,1.5rem)]',
} as const;

export default function CtaSection({
  title,
  subtitle,
  buttonText,
  buttonHref = '/assessment',
  variant = 'dark',
  watermark,
  onPrimaryClick,
  ctaSize = 'large',
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
              size={ctaSize}
              buttonType={isDark ? 'default' : 'primary'}
              onPrimaryClick={onPrimaryClick}
            />
          }
        />
      </div>
    </section>
  );
}
