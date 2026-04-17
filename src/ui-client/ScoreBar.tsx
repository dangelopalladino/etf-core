'use client';

import React from 'react';
import { getScoreColor } from '../tokens/shared';

interface ScoreBarProps {
  score: number;
  maxScore: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  trackColor?: string;
  animated?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
} as const;

export default function ScoreBar({
  score,
  maxScore,
  size = 'md',
  color,
  trackColor,
  animated = true,
  className = '',
}: ScoreBarProps) {
  const pct = maxScore > 0 ? Math.min(Math.max(score / maxScore, 0), 1) * 100 : 0;
  const fillColor = color ?? getScoreColor(score);

  return (
    <div
      className={`${SIZE_MAP[size]} rounded-full overflow-hidden ${className}`}
      style={{ backgroundColor: trackColor ?? 'var(--color-border-subtle)' }}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={maxScore}
    >
      <div
        className={`h-full rounded-full ${animated ? 'transition-[width] duration-700 ease-out' : ''}`}
        style={{
          width: `${pct}%`,
          backgroundColor: fillColor,
        }}
      />
    </div>
  );
}
