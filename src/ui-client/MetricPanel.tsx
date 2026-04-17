'use client';

import React from 'react';
import { STATUS_STYLES, type StatusType } from '../tokens/shared';

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
  const valueColor = status ? STATUS_STYLES[status].text : undefined;
  const isInline = layout === 'inline';

  return (
    <div className={`${isInline ? 'flex items-baseline gap-3' : ''} ${className}`}>
      <div className={isInline ? '' : 'mb-1'}>
        <span
          className="font-mono font-bold text-2xl"
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
