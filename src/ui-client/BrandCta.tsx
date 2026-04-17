'use client';

import React from 'react';
import Link from 'next/link';
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

export default function BrandCta({
  primary,
  secondary,
  size = 'large',
  align = 'left',
  buttonType = 'primary',
  onPrimaryClick,
  onSecondaryClick,
}: BrandCtaProps) {
  return (
    <Space size={12} wrap className={align === 'center' ? 'justify-center' : 'justify-start'}>
      <Link href={primary.href} onClick={onPrimaryClick}>
        <Button
          type={buttonType}
          size={size}
          shape="round"
          icon={<ArrowRightOutlined />}
          iconPlacement="end"
        >
          {primary.text}
        </Button>
      </Link>

      {secondary && (
        <Link href={secondary.href} onClick={onSecondaryClick}>
          <Button
            type="default"
            size={size}
            shape="round"
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
          >
            {secondary.text}
          </Button>
        </Link>
      )}
    </Space>
  );
}
