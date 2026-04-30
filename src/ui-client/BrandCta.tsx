'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Space } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { ArrowRightOutlined } from '@ant-design/icons';

interface BrandCtaProps {
  primary: { text: string; href: string };
  secondary?: { text: string; href: string };
  size?: SizeType;
  align?: 'left' | 'center';
  buttonType?: 'primary' | 'default';
  /**
   * Visual weight of the primary CTA.
   * - `standard` (default) — filled rounded button (existing behavior, unchanged).
   * - `editorial` — primary renders as an inline arrow-suffixed text link in
   *   the brand color, no button chrome. Secondary still renders normally.
   *
   * Added in v1.6.0.
   */
  weight?: 'standard' | 'editorial';
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

/**
 * BrandCta — renders a primary button and optional secondary button.
 *
 * Uses router.push for client-side navigation rather than wrapping the button
 * in <Link>, which would nest <a><button></button></a> — invalid HTML and
 * two tab stops for AT users.
 */
export default function BrandCta({
  primary,
  secondary,
  size = 'large',
  align = 'left',
  buttonType = 'primary',
  weight = 'standard',
  onPrimaryClick,
  onSecondaryClick,
}: BrandCtaProps) {
  const router = useRouter();

  const handlePrimaryClick = (e: React.MouseEvent) => {
    onPrimaryClick?.();
    if (!e.defaultPrevented) router.push(primary.href);
  };

  return (
    <Space size={12} wrap className={align === 'center' ? 'justify-center' : 'justify-start'}>
      {weight === 'editorial' ? (
        <a
          href={primary.href}
          onClick={(e) => {
            e.preventDefault();
            handlePrimaryClick(e);
          }}
          className="inline-flex items-center gap-2 text-primary font-semibold underline underline-offset-4 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {primary.text}
          <ArrowRightOutlined aria-hidden />
        </a>
      ) : (
        <Button
          type={buttonType}
          size={size}
          shape="round"
          icon={<ArrowRightOutlined />}
          iconPlacement="end"
          onClick={handlePrimaryClick}
        >
          {primary.text}
        </Button>
      )}

      {secondary && (
        <Button
          type="default"
          size={size}
          shape="round"
          icon={<ArrowRightOutlined />}
          iconPlacement="end"
          onClick={(e) => {
            onSecondaryClick?.();
            if (!e.defaultPrevented) router.push(secondary.href);
          }}
        >
          {secondary.text}
        </Button>
      )}
    </Space>
  );
}
