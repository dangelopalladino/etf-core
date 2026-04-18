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
  onPrimaryClick,
  onSecondaryClick,
}: BrandCtaProps) {
  const router = useRouter();
  return (
    <Space size={12} wrap className={align === 'center' ? 'justify-center' : 'justify-start'}>
      <Button
        type={buttonType}
        size={size}
        shape="round"
        icon={<ArrowRightOutlined />}
        iconPlacement="end"
        onClick={(e) => {
          onPrimaryClick?.();
          if (!e.defaultPrevented) router.push(primary.href);
        }}
      >
        {primary.text}
      </Button>

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
