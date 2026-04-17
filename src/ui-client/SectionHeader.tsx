'use client';

import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

const VARIANT_CONFIG = {
  editorial: {
    eyebrow: 'text-sm font-semibold uppercase tracking-[0.1em] text-accent block mb-4',
    title: '',
    titleForceLevel: null as (1 | 2 | 3 | null),
    subtitle: 'text-lg leading-relaxed text-text-secondary max-w-[560px]',
    wrapper: 'mb-8',
  },
  hero: {
    eyebrow: 'text-sm font-semibold uppercase tracking-[0.1em] text-accent block mb-4',
    title: '!text-[30px] md:!text-[36px] lg:!text-[44px] !tracking-[-0.02em] lg:!tracking-[-0.03em] !leading-[1.15]',
    titleForceLevel: 1 as (1 | 2 | 3 | null),
    subtitle: 'text-xl leading-relaxed text-text-secondary max-w-[640px]',
    wrapper: 'mb-10',
  },
  breakdown: {
    eyebrow: 'text-xs font-bold uppercase tracking-[0.12em] text-accent pl-5 border-l-[3px] border-accent block mb-3',
    title: '!text-[24px] md:!text-[30px] !leading-[1.2]',
    titleForceLevel: null as (1 | 2 | 3 | null),
    subtitle: 'text-base leading-relaxed text-text-secondary max-w-[560px]',
    wrapper: 'mb-6',
  },
  compact: {
    eyebrow: null,
    title: '!text-[20px] md:!text-[24px] !leading-[1.25]',
    titleForceLevel: null as (1 | 2 | 3 | null),
    subtitle: 'text-sm leading-relaxed text-text-secondary max-w-[480px]',
    wrapper: 'mb-4',
  },
} as const;

type SectionHeaderVariant = keyof typeof VARIANT_CONFIG;

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleLevel?: 1 | 2 | 3;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  variant?: SectionHeaderVariant;
  actions?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  titleLevel = 2,
  subtitle,
  align = 'left',
  variant = 'editorial',
  actions,
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  const config = VARIANT_CONFIG[variant];
  const level = config.titleForceLevel ?? titleLevel;

  return (
    <div className={`${isCenter ? 'text-center' : ''} ${className}`.trim()}>
      {eyebrow && config.eyebrow && (
        <Text className={config.eyebrow}>{eyebrow}</Text>
      )}

      <Title
        level={level}
        className={`text-primary leading-snug mb-6 ${config.title}`}
      >
        {title}
      </Title>

      {subtitle && (
        <Paragraph
          className={`${config.subtitle} ${isCenter ? 'mx-auto' : ''} ${actions ? 'mb-8' : ''}`}
        >
          {subtitle}
        </Paragraph>
      )}

      {actions && (
        <div className={isCenter ? 'flex justify-center' : ''}>{actions}</div>
      )}
    </div>
  );
}
