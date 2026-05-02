'use client';

import React from 'react';
import Script from 'next/script';

export interface GA4LoaderProps {
  measurementId: string;
  /** Override default linker domains. */
  linkerDomains?: string[];
}

/**
 * Single GA4 loader for both consumer sites.
 *
 * Cross-domain linker is baked in so a session begun on one domain continues
 * on the other (Phase 11 D4 / §4.D.2). Both sites must mount this with the
 * SAME `measurementId` (canonical: `G-7KJYNQJZ43`) — drift is caught by
 * `scripts/check-env-parity.ts`.
 */
export function GA4Loader({ measurementId, linkerDomains }: GA4LoaderProps): React.ReactElement | null {
  if (!measurementId) return null;
  const domains = JSON.stringify(
    linkerDomains ?? ['6identities.com', 'etfframework.com'],
  );
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('set', 'linker', { domains: ${domains}, accept_incoming: true });
        gtag('config', '${measurementId}', { send_page_view: true });
      `}</Script>
    </>
  );
}
