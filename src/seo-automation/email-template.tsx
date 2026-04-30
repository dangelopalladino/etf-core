import 'server-only';
import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { Brand, SeoDraft } from './types';
import { SIX_ID_COLORS } from '../tokens/6id';
import { ETF_COLORS } from '../tokens/etfframework';

interface BrandPalette {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  primary: string;
  primaryText: string;
  border: string;
}

function paletteFor(brand: Brand): BrandPalette {
  if (brand === 'etf') {
    return {
      bg: ETF_COLORS.warmWhite,
      surface: ETF_COLORS.white,
      text: ETF_COLORS.charcoal,
      muted: ETF_COLORS.gray,
      primary: ETF_COLORS.forest,
      primaryText: '#FFFFFF',
      border: ETF_COLORS.stone,
    };
  }
  return {
    bg: SIX_ID_COLORS.bgPage,
    surface: SIX_ID_COLORS.bgSurface,
    text: SIX_ID_COLORS.fgBody,
    muted: SIX_ID_COLORS.fgMuted,
    primary: SIX_ID_COLORS.action,
    primaryText: '#FFFFFF',
    border: SIX_ID_COLORS.borderSoft,
  };
}

export interface ApprovalEmailProps {
  brand: Brand;
  draft: SeoDraft;
  approveUrl: string;
  reviseUrl: string;
  rejectUrl: string;
  expiresAt: string;
}

export function ApprovalEmail({
  brand,
  draft,
  approveUrl,
  reviseUrl,
  rejectUrl,
  expiresAt,
}: ApprovalEmailProps): React.ReactElement {
  const p = paletteFor(brand);
  const brandName = brand === 'etf' ? 'ETF Framework' : '6 Identities';

  return (
    <Html>
      <Head />
      <Preview>{`Review draft: ${draft.title}`}</Preview>
      <Body style={{ backgroundColor: p.bg, fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
          <Text
            style={{
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: p.muted,
              margin: 0,
            }}
          >
            {brandName} · SEO draft review
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: p.text,
              margin: '8px 0 16px',
              lineHeight: 1.25,
            }}
          >
            {draft.title}
          </Text>
          <Text style={{ fontSize: 15, color: p.muted, lineHeight: 1.6, margin: '0 0 24px' }}>
            {draft.metaDescription}
          </Text>

          <Section
            style={{
              backgroundColor: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 13, color: p.muted, margin: '0 0 4px' }}>Slug</Text>
            <Text style={{ fontSize: 14, color: p.text, margin: '0 0 12px', fontFamily: 'monospace' }}>
              /{draft.slug}
            </Text>
            <Text style={{ fontSize: 13, color: p.muted, margin: '0 0 4px' }}>
              Citations
            </Text>
            <Text style={{ fontSize: 14, color: p.text, margin: 0 }}>
              {draft.citations.length} cited · {draft.sources.length} sources
            </Text>
          </Section>

          <Section style={{ textAlign: 'center', marginBottom: 16 }}>
            <Button
              href={approveUrl}
              aria-label="Approve draft"
              style={{
                backgroundColor: p.primary,
                color: p.primaryText,
                padding: '12px 28px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Approve
            </Button>
          </Section>
          <Section style={{ textAlign: 'center', marginBottom: 16 }}>
            <Button
              href={reviseUrl}
              aria-label="Request revision"
              style={{
                backgroundColor: p.surface,
                color: p.primary,
                padding: '11px 27px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 15,
                border: `1px solid ${p.primary}`,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Request revision
            </Button>
          </Section>
          <Section style={{ textAlign: 'center', marginBottom: 24 }}>
            <Button
              href={rejectUrl}
              aria-label="Reject draft"
              style={{
                backgroundColor: 'transparent',
                color: p.muted,
                padding: '11px 27px',
                borderRadius: 999,
                fontWeight: 500,
                fontSize: 14,
                textDecoration: 'underline',
                display: 'inline-block',
              }}
            >
              Reject
            </Button>
          </Section>

          <Hr style={{ borderColor: p.border, margin: '24px 0' }} />
          <Text style={{ fontSize: 12, color: p.muted, lineHeight: 1.6, margin: 0 }}>
            Links expire {expiresAt}. Each link is single-purpose; once an action is
            recorded, the others stop working.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
