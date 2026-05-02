'use client';

import React from 'react';
import { theme } from 'antd';
import type { StatusType } from '../tokens/shared';

interface MetricPanelProps {
  value: string | number;
  label: string;
  status?: StatusType;
  suffix?: string;
  sublabel?: React.ReactNode;
  layout?: 'stacked' | 'inline';
  className?: string;
}

export default function MetricPanel({
  value,
  label,
  status,
  suffix,
  sublabel,
  layout = 'stacked',
  className = '',
}: MetricPanelProps) {
  const { token } = theme.useToken();
  const statusTextColors: Record<StatusType, string> = {
    urgent:  token.colorError,
    caution: token.colorWarning,
    info:    token.colorInfo,
    success: token.colorSuccess,
    neutral: token.colorTextSecondary,
  };
  const valueColor = status ? statusTextColors[status] : undefined;
  const isInline = layout === 'inline';

  return (
    <div className={`${isInline ? 'flex items-baseline gap-3' : ''} ${className}`}>
      <div className={isInline ? '' : 'mb-1'}>
        <span
          // Fluid metric value — clamp() matches FLUID_TYPE_SCALE.xl (24 → 36px
          // across 375 → 1440). Replaces the prior static `text-2xl` so the
          // value scales with the page; ratchet-compliant (no `text-(2xl|...)`
          // body-oriented literal).
          className="font-mono font-bold text-[clamp(1.5rem,1.127vw+1.236rem,2.25rem)]"
          style={{
            fontVariantNumeric: 'tabular-nums',
            color: valueColor ?? 'var(--color-foreground)',
          }}
        >
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-text-secondary ml-0.5">{suffix}</span>
        )}
      </div>
      <div>
        <span className="text-sm text-text-secondary">{label}</span>
        {sublabel && (
          <span className="block text-xs text-text-secondary/60 mt-0.5">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
