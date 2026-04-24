'use client';

import React from 'react';
import { theme } from 'antd';
import type { StatusType } from '../tokens/shared';

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
  const { token } = theme.useToken();
  const colors = {
    urgent:  { bg: token.colorErrorBg,    border: token.colorErrorBorder,   text: token.colorError },
    caution: { bg: token.colorWarningBg,  border: token.colorWarningBorder, text: token.colorWarning },
    info:    { bg: token.colorInfoBg,     border: token.colorInfoBorder,    text: token.colorInfo },
    success: { bg: token.colorSuccessBg,  border: token.colorSuccessBorder, text: token.colorSuccess },
    neutral: { bg: token.colorFillTertiary, border: token.colorBorderSecondary, text: token.colorTextSecondary },
  }[status];
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
