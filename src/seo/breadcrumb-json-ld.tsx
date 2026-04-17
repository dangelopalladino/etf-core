import React from 'react';
import { breadcrumbListSchema, type Crumb } from './json-ld';

export interface BreadcrumbJsonLdProps {
  /** Crumbs in order from root → leaf. URLs may be absolute or site-relative. */
  crumbs: Crumb[];
  /** Site origin used to resolve relative crumb URLs. Each consumer site
   *  passes its own `process.env.NEXT_PUBLIC_SITE_URL`. */
  siteUrl?: string;
}

export default function BreadcrumbJsonLd({ crumbs, siteUrl }: BreadcrumbJsonLdProps) {
  const base = (siteUrl ?? '').replace(/\/+$/, '');
  const resolved = crumbs.map((c) => ({
    name: c.name,
    url: c.url.startsWith('http') ? c.url : `${base}${c.url.startsWith('/') ? '' : '/'}${c.url}`,
  }));
  const schema = breadcrumbListSchema(resolved);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
