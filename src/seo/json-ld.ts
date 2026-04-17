// JSON-LD factories — schema.org payloads for embedding via
// <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />

const CONTEXT = 'https://schema.org';

export type Crumb = { name: string; url: string };

export type FaqItem = { question: string; answer: string };

export interface PersonOpts {
  name: string;
  url: string;
  image?: string;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
  hasCredential?: string[];
  knowsAbout?: string[];
  affiliation?: { name: string; url: string };
}

export interface OrganizationOpts {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  foundingDate?: string;
  contactPoint?: { email?: string; contactType?: string };
}

export interface ArticleOpts {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorName: string;
  authorUrl?: string;
  publisherName: string;
  publisherUrl: string;
}

export interface ScholarlyArticleOpts {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  publisher?: string;
  doi?: string;
  citation?: Array<{
    authorName: string;
    headline: string;
    datePublished: string;
    publisher?: string;
    doi?: string;
  }>;
}

export interface SoftwareApplicationOpts {
  name: string;
  url: string;
  description: string;
  applicationCategory?: string;
  operatingSystem?: string;
  priceCurrency?: string;
  price?: string;
}

export function breadcrumbListSchema(crumbs: Crumb[]) {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function personSchema(opts: PersonOpts) {
  const base: Record<string, unknown> = {
    '@context': CONTEXT,
    '@type': 'Person',
    name: opts.name,
    url: opts.url,
  };
  if (opts.image) base.image = opts.image;
  if (opts.jobTitle) base.jobTitle = opts.jobTitle;
  if (opts.description) base.description = opts.description;
  if (opts.sameAs?.length) base.sameAs = opts.sameAs;
  if (opts.knowsAbout?.length) base.knowsAbout = opts.knowsAbout;
  if (opts.hasCredential?.length) {
    base.hasCredential = opts.hasCredential.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'credential',
      name: c,
    }));
  }
  if (opts.affiliation) {
    base.affiliation = {
      '@type': 'Organization',
      name: opts.affiliation.name,
      url: opts.affiliation.url,
    };
  }
  return base;
}

export function organizationSchema(opts: OrganizationOpts) {
  const base: Record<string, unknown> = {
    '@context': CONTEXT,
    '@type': 'Organization',
    name: opts.name,
    url: opts.url,
  };
  if (opts.logo) base.logo = opts.logo;
  if (opts.sameAs?.length) base.sameAs = opts.sameAs;
  if (opts.foundingDate) base.foundingDate = opts.foundingDate;
  if (opts.contactPoint) {
    base.contactPoint = { '@type': 'ContactPoint', ...opts.contactPoint };
  }
  return base;
}

export function articleSchema(opts: ArticleOpts) {
  const base: Record<string, unknown> = {
    '@context': CONTEXT,
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      '@type': 'Person',
      name: opts.authorName,
      ...(opts.authorUrl ? { url: opts.authorUrl } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: opts.publisherName,
      url: opts.publisherUrl,
    },
  };
  if (opts.image) base.image = opts.image;
  return base;
}

export function scholarlyArticleSchema(opts: ScholarlyArticleOpts) {
  const base: Record<string, unknown> = {
    '@context': CONTEXT,
    '@type': 'ScholarlyArticle',
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      '@type': 'Person',
      name: opts.authorName,
      ...(opts.authorUrl ? { url: opts.authorUrl } : {}),
    },
  };
  if (opts.publisher) base.publisher = { '@type': 'Organization', name: opts.publisher };
  if (opts.doi) base.identifier = { '@type': 'PropertyValue', propertyID: 'doi', value: opts.doi };
  if (opts.citation?.length) {
    base.citation = opts.citation.map((c) => ({
      '@type': 'ScholarlyArticle',
      author: { '@type': 'Person', name: c.authorName },
      headline: c.headline,
      datePublished: c.datePublished,
      ...(c.publisher ? { publisher: { '@type': 'Organization', name: c.publisher } } : {}),
      ...(c.doi
        ? { identifier: { '@type': 'PropertyValue', propertyID: 'doi', value: c.doi } }
        : {}),
    }));
  }
  return base;
}

export function softwareApplicationSchema(opts: SoftwareApplicationOpts) {
  return {
    '@context': CONTEXT,
    '@type': 'SoftwareApplication',
    name: opts.name,
    url: opts.url,
    description: opts.description,
    applicationCategory: opts.applicationCategory ?? 'HealthApplication',
    operatingSystem: opts.operatingSystem ?? 'Web',
    offers: {
      '@type': 'Offer',
      price: opts.price ?? '0',
      priceCurrency: opts.priceCurrency ?? 'USD',
    },
  };
}
