/**
 * Book sales-page content sourced directly from the source PDFs in
 * `/etfframework/docs/booksAndguides/`. Verbatim from the books themselves.
 *
 * Cover art lives at `public/images/books/{slug}.png` in each consumer repo.
 * PDF delivery is gated by Supabase Storage signed URLs (private bucket `books`).
 */

import type { ProductType } from '../commerce/priceMap';

export type BookSlug =
  | 'motion'
  | 'understanding-the-crash'
  | 'family-playbook'
  | 'family-bundle';

/**
 * Derived from the canonical `ProductType` ledger in `commerce/priceMap.ts` so
 * adding a new book SKU only requires editing that single source of truth.
 * Pre-v1.11.1 this was a duplicate string-literal union — drift risk.
 */
export type BookProductType = Extract<ProductType, `book_${string}`>;

export interface BookContent {
  slug: BookSlug;
  productKey: BookProductType;
  title: string;
  subtitle: string;
  author: string;
  price: number;
  tagline: string;
  description: string[];
  toc: string[];
  excerpt: string;
  pdfPath: string;
  coverSrc: string;
  coverAlt: string;
  seoTitle: string;
  seoDescription: string;
  bundledProductKeys?: Array<
    'book_understanding_the_crash' | 'book_family_playbook'
  >;
}

export const BOOKS: Record<BookSlug, BookContent> = {
  motion: {
    slug: 'motion',
    productKey: 'book_motion',
    title: 'Motion',
    subtitle: 'Take Control of Your Life After Sports — Volume 1',
    author: "D'Angelo Palladino",
    price: 9.99,
    tagline: 'A replacement operating system for the former athlete.',
    description: [
      'The last game ends, and the structure that organized your entire life disappears overnight. The alarm, the teammates, the coaches, the scoreboard — gone. What remains is you, without the context that made you make sense.',
      'Motion is not a motivational book. It is not a therapy workbook. It is not a career-transition guide. It is a replacement operating system for former athletes, built around two integrated systems: the 6 Identities inventory and the Executable Transition Framework (ETF™).',
      'The 6 Identities tells you exactly which of six types you are currently operating in, what internal engine is driving your behavior, and what formation context shaped how you arrived here. The ETF™ takes it from there — eight components that rebuild identity, relationships, community, daily structure, and execution on top of the permanent foundation your athletic career already built.',
    ],
    toc: [
      'Introduction — Nobody Trains You for This Part',
      'Chapter 1 — The ETF™ Model',
      'Chapter 2 — Your 6 Identities Profile',
      'Chapter 3 — Letting Go of the Old Season',
      'Chapter 4 — You Are the CEO of Your Life',
      'Chapter 5 — The Build™',
      'Chapter 6 — Core Code™',
      'Chapter 7 — People',
      'Chapter 8 — Community',
      'Chapter 9 — The Dashboard™',
      'Chapter 10 — The Block List™',
      'Chapter 11 — Process',
      'Chapter 12 — Moves™',
      'Chapter 13 — Pulling It All Together',
      'Chapter 14 — Getting Started',
    ],
    excerpt:
      'Your athletic identity is not something to recover from. It is not a phase to move through. It is not a wound to heal or a crutch to discard. It is The Foundation™ — neurologically, psychologically, and behaviorally baked into who you are after two or more decades of competition. The ETF™ takes everything that was built through competition and puts it to work building a life — deliberately, structurally, and with the same standard of excellence the sport demanded.',
    pdfPath: 'motion/MotionVolume1.pdf',
    coverSrc: '/images/books/motion.png',
    coverAlt: 'Motion — Take Control of Your Life After Sports cover',
    seoTitle: 'Motion — A Replacement Operating System for Former Athletes',
    seoDescription:
      "The Executable Transition Framework (ETF™) in book form. Eight components, 90-day cycles, and the structural path forward for life after sport. By D'Angelo Palladino.",
  },

  'understanding-the-crash': {
    slug: 'understanding-the-crash',
    productKey: 'book_understanding_the_crash',
    title: 'Understanding the Crash',
    subtitle:
      'A Deep Guide for Families — Why Your Athlete Is Going Through This and What Is Happening Inside',
    author: "D'Angelo Palladino",
    price: 12.99,
    tagline:
      'Neuroscience, psychology, and identity foreclosure — translated for families.',
    description: [
      "Your athlete's brain was rewired by competition. This is not a metaphor — it is neuroscience. A brain that spends 10, 15, or 20 years inside a high-intensity competitive system physically reorganizes itself around the demands of that system. When the competition stops, the brain goes through real neurochemical withdrawal.",
      'Understanding the Crash is a deep education guide for parents, partners, siblings, and family members. It teaches you to understand — not to treat, not to fix, not to coach. What you learn here is for your understanding only. Use it to recognize what you are seeing. Use it to stop accidentally making things worse. Use it to know when professional support is needed.',
      'The book walks through the biology nobody explains to families, the psychology underneath identity foreclosure and athletic grief, why different athletes crash differently, the specific behaviors you are seeing and what they actually mean, and the boundaries every family member must hold.',
    ],
    toc: [
      'Before You Read This — What This Guide Is and Is Not',
      'Part One — The Biology Nobody Explains to Families',
      'Part Two — The Psychology Underneath',
      'Part Three — Why Different Athletes Crash Differently',
      'Part Four — What You Are Seeing and What It Actually Means',
      'Part Five — The Boundaries You Must Hold',
      'Part Six — The Science in Plain Language (Reference Section)',
    ],
    excerpt:
      'Understanding the neurochemistry changes what you see. When your athlete is lying on the couch at 2 PM unable to explain why they cannot get up — that is not laziness. That is a dopamine system that is no longer producing enough motivational signal to make action feel worthwhile. The engine is still there. The fuel system is recalibrating. None of this excuses harmful behavior. It explains it. And explanation is the first step toward the right response — which is healthy replacement, not shame.',
    pdfPath: 'understanding-the-crash/UnderstandingtheCrashFamilyGuide.pdf',
    coverSrc: '/images/books/understanding-the-crash.png',
    coverAlt: 'Understanding the Crash — A Deep Guide for Families cover',
    seoTitle: "Understanding the Crash — A Deep Guide for Your Athlete's Family",
    seoDescription:
      'The neuroscience and psychology of athlete transition, translated for families. Recognize what you are seeing, stop making it worse, and know when professional support is needed.',
  },

  'family-playbook': {
    slug: 'family-playbook',
    productKey: 'book_family_playbook',
    title: 'The Family Playbook',
    subtitle:
      'How to Support Your Athlete Through the Transition Nobody Trains Them For',
    author: "D'Angelo Palladino",
    price: 12.99,
    tagline:
      'The practical guide for parents, partners, siblings, and anyone who loves a former athlete.',
    description: [
      'You already know something is wrong. Maybe they came home from their last season and something shifted. Maybe they got quieter. Maybe they got louder — filling every day with noise and activity that does not seem to be building toward anything. Maybe they seem fine on the surface and you cannot point to anything specific — just a feeling.',
      'What you are seeing is the most underserved transition in sports — and you are one of the most important people in determining whether they build through it or drift through it. The Family Playbook is the practical companion to Understanding the Crash: what to do, what to stop doing, and what your athlete needs from you at each stage.',
      'Organized by the six 6 Identities types, by age group, by level of play, and by the ten things every family member needs to know, the Playbook gives you a conversation guide, boundary scripts, and the specific moves that support your athlete without overstepping.',
    ],
    toc: [
      'Introduction — You Already Know Something Is Wrong',
      'Part One — What Is Actually Happening',
      'Part Two — By Age Group: What Changes and What Does Not',
      'Part Three — By Level of Play',
      'Part Four — The Ten Things Every Family Member Needs to Know',
      'Part Five — The Conversation Guide',
      'Part Six — What the 6 Identities Inventory Tells You',
    ],
    excerpt:
      "The transition is not a career change. It is a complete life reconstruction. And it requires a system that addresses all five areas — not just the one that is most visible from the outside. A job addresses one of the five systems. It does not address the identity collapse, the community loss, the neurochemical withdrawal, or the fundamental question of 'who am I if I am not an athlete?'",
    pdfPath: 'family-playbook/TheFamilyPlaybook6Identities.pdf',
    coverSrc: '/images/books/family-playbook.png',
    coverAlt: 'The Family Playbook cover',
    seoTitle:
      'The Family Playbook — How to Support Your Former Athlete Through Transition',
    seoDescription:
      'Pattern-specific, age-specific, level-of-play-specific guidance for families of former athletes. A companion to Understanding the Crash.',
  },

  'family-bundle': {
    slug: 'family-bundle',
    productKey: 'book_family_bundle',
    title: 'Family Bundle',
    subtitle:
      'Understanding the Crash + The Family Playbook — Save on the complete family set',
    author: "D'Angelo Palladino",
    price: 19.99,
    tagline:
      'Both family guides together — the understanding and the playbook.',
    description: [
      'Buy both family guides together and save $5.99 versus buying separately. Understanding the Crash gives you the biology, psychology, and identity-foreclosure framework that explains what is happening inside your athlete. The Family Playbook gives you what to do with that understanding — the conversations, the boundaries, and the pattern-specific moves.',
      'Together, the two books cover everything a parent, partner, sibling, or close family member needs to support a former athlete through transition: the science behind the crash, the five systems that just went offline, the six transition types and how each one shows up at home, and a complete conversation guide for the hardest questions you will need to ask.',
      'Both books are delivered as individual PDFs. Your purchase entitles you to both downloads from your purchase confirmation page.',
    ],
    toc: [
      'Book 1 — Understanding the Crash (Neuroscience, psychology, and identity foreclosure)',
      'Book 2 — The Family Playbook (What to do, what to stop doing, by pattern and age group)',
      'Bonus — Shared 6 Identities pattern reference (included in both)',
    ],
    excerpt:
      'You are not responsible for fixing this. You are responsible for not pretending it is not happening. Understanding the Crash teaches you what to recognize; The Family Playbook teaches you what to do about it. Together, they give you the full structural picture — without asking you to become a therapist or a coach.',
    pdfPath: 'family-bundle/',
    coverSrc: '/images/books/family-bundle.png',
    coverAlt: 'Family Bundle — Understanding the Crash + The Family Playbook cover',
    seoTitle: 'Family Bundle — Understanding the Crash + The Family Playbook',
    seoDescription:
      'Both 6 Identities family guides together. Understand what is happening inside your athlete, and know what to do about it. Save $5.99 vs. buying separately.',
    bundledProductKeys: ['book_understanding_the_crash', 'book_family_playbook'],
  },
};

export const BOOK_SLUGS: BookSlug[] = [
  'motion',
  'understanding-the-crash',
  'family-playbook',
  'family-bundle',
];

export function getBookBySlug(slug: string): BookContent | null {
  return (BOOKS as Record<string, BookContent>)[slug] ?? null;
}

export const BOOK_PRODUCT_NAMES: Record<string, string> = {
  book_motion: 'Motion — Volume 1',
  book_understanding_the_crash: 'Understanding the Crash',
  book_family_playbook: 'The Family Playbook',
  book_family_bundle: 'Family Bundle (Understanding the Crash + The Family Playbook)',
};

// `BOOK_PRODUCT_TYPES` lives in `commerce/priceMap.ts` (canonical Stripe ledger).
// Re-exported here for content-side consumers that prefer to import from
// `@dangelopalladino/etf-core/content`. Pre-v1.11.1 this was a duplicate Set
// instance — reference-distinct from the priceMap one, breaking identity checks.
export { BOOK_PRODUCT_TYPES } from '../commerce/priceMap';
