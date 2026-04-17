'use client';

import React from 'react';
import { STATUS_STYLES, type StatusType } from '../tokens/shared';

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  variant?: 'pill' | 'subtle';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export default function StatusBadge({
  status,
  children,
  variant = 'pill',
  size = 'md',
  dot = false,
}: StatusBadgeProps) {
  const colors = STATUS_STYLES[status];
  const isSm = size === 'sm';

  if (variant === 'subtle') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 ${isSm ? 'text-xs' : 'text-sm'} font-semibold`}
        style={{ color: colors.text }}
      >
        {dot && (
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: colors.text }}
          />
        )}
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${isSm ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'} font-semibold rounded-full`}
      style={{
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      {dot && (
        <span
          className="inline-block w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: colors.text }}
        />
      )}
      {children}
    </span>
  );
}
