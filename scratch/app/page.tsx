import {
  Eyebrow,
  Kicker,
  NoticeCard,
  EmptyState,
  IconBadge,
  Stat,
  StatValue,
  StatLabel,
  Stack,
  Cluster,
  Hero,
  Card,
} from '../../src/ui-server';
import { LoadingState, SkeletonCard, LockedGate } from '../../src/ui-client';
import { BrandProvider } from '../../src/brand/BrandProvider';
import type { Brand } from '../../src/tokens/shared';

const BRANDS: Brand[] = ['shared', 'etf', '6id'];

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} data-primitive={id} className="mb-10 border-b border-[#E5DDD4] pb-8">
    <h2 className="text-[18px] font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{children}</div>
  </section>
);

const BrandPanel = ({ brand, children }: { brand: Brand; children: React.ReactNode }) => (
  <BrandProvider brand={brand}>
    <div data-brand={brand} className="border border-[#E5DDD4] rounded-[8px] p-3 bg-white/60">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B6560] mb-3">brand: {brand}</div>
      {children}
    </div>
  </BrandProvider>
);

const SwordIcon = (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 4l6 6-9 9H5v-6l9-9z" />
  </svg>
);

export default function HarnessPage() {
  return (
    <main className="max-w-[1280px] mx-auto p-6">
      <header className="mb-10">
        <h1 className="text-[28px] font-bold m-0">etf-core v1.5 — visual harness</h1>
        <p className="text-[14px] text-[#6B6560] mt-2 m-0">
          Every primitive rendered in three brand contexts. Capture at 320 / 375 / 768 / 1280 viewport widths.
        </p>
      </header>

      <Section id="eyebrow" title="Eyebrow">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <Eyebrow>Practitioner Brief</Eyebrow>
          </BrandPanel>
        ))}
      </Section>

      <Section id="kicker" title="Kicker">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <Kicker>Section 03 — Method</Kicker>
          </BrandPanel>
        ))}
      </Section>

      <Section id="noticecard" title="NoticeCard (5 tones)">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <Stack gap={3}>
              <NoticeCard tone="urgent" title="Urgent — action required">
                Body copy explaining the urgent state.
              </NoticeCard>
              <NoticeCard tone="caution" title="Caution">Worth attention.</NoticeCard>
              <NoticeCard tone="info" title="Info">For your awareness.</NoticeCard>
              <NoticeCard tone="success" title="Success">Operation complete.</NoticeCard>
              <NoticeCard tone="neutral" title="Neutral note" />
            </Stack>
          </BrandPanel>
        ))}
      </Section>

      <Section id="emptystate" title="EmptyState">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <EmptyState
              title="No reports yet"
              body="When you generate your first report it will appear here."
              action={
                <button className="text-[14px] font-semibold underline">Create one</button>
              }
            />
          </BrandPanel>
        ))}
      </Section>

      <Section id="iconbadge" title="IconBadge (sm / md / lg, 3 tones)">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <Cluster gap={3}>
              <IconBadge icon={SwordIcon} tone="info" size="sm" label="Info" />
              <IconBadge icon={SwordIcon} tone="success" size="md" label="Success" />
              <IconBadge icon={SwordIcon} tone="caution" size="lg" label="Caution" />
              <IconBadge icon={SwordIcon} tone="neutral" size="md" />
            </Cluster>
          </BrandPanel>
        ))}
      </Section>

      <Section id="stat" title="Stat / StatValue / StatLabel">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <Cluster gap={6}>
              <Stat>
                <StatValue>9,283</StatValue>
                <StatLabel>Active members</StatLabel>
              </Stat>
              <Stat>
                <StatValue>123,456,789</StatValue>
                <StatLabel>Long value</StatLabel>
              </Stat>
            </Cluster>
          </BrandPanel>
        ))}
      </Section>

      <Section id="stack" title="Stack + Cluster">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <Stack gap={3} gapMd={5}>
              <div className="rounded-[6px] bg-[#FAF5EE] border border-[#E5DDD4] p-2">A</div>
              <div className="rounded-[6px] bg-[#FAF5EE] border border-[#E5DDD4] p-2">B</div>
              <Cluster gap={2}>
                <span className="px-2 py-1 rounded-[4px] bg-[#FAF5EE] border border-[#E5DDD4]">x</span>
                <span className="px-2 py-1 rounded-[4px] bg-[#FAF5EE] border border-[#E5DDD4]">y</span>
                <span className="px-2 py-1 rounded-[4px] bg-[#FAF5EE] border border-[#E5DDD4]">z</span>
              </Cluster>
            </Stack>
          </BrandPanel>
        ))}
      </Section>

      <Section id="hero" title="Hero (stacked + split)">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <Hero
              eyebrow="Briefing"
              title="The thing you came here for"
              subtitle="A short description that scales fluidly from base to lg."
              primary={<button className="px-4 py-2 rounded-full bg-[#2D7A7B] text-white text-[14px]">Primary</button>}
              secondary={<button className="px-4 py-2 rounded-full border border-[#E5DDD4] text-[14px]">Secondary</button>}
            />
          </BrandPanel>
        ))}
      </Section>

      <Section id="card" title="Card (4 padding ramps)">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <Stack gap={3}>
              <Card padding={3} radius="md">
                <p className="m-0 text-[14px]">padding=3 (12px → md:24px)</p>
              </Card>
              <Card padding={4} radius="lg">
                <p className="m-0 text-[14px]">padding=4 (16px → md:24px)</p>
              </Card>
              <Card padding={6} radius="xl" tone="raised">
                <p className="m-0 text-[14px]">padding=6, raised, radius=xl ({b === 'etf' ? '10' : '20'}px)</p>
              </Card>
            </Stack>
          </BrandPanel>
        ))}
      </Section>

      <Section id="loadingstate" title="LoadingState">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <Cluster gap={4}>
              <LoadingState size="sm" />
              <LoadingState size="md" label="Working" />
              <LoadingState size="lg" label="Generating report" />
            </Cluster>
          </BrandPanel>
        ))}
      </Section>

      <Section id="skeletoncard" title="SkeletonCard">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <Stack gap={3}>
              <SkeletonCard lines={3} />
              <SkeletonCard withMedia lines={2} mediaAspect="16/9" />
            </Stack>
          </BrandPanel>
        ))}
      </Section>

      <Section id="lockedgate" title="LockedGate">
        {BRANDS.map((b) => (
          <BrandPanel key={b} brand={b}>
            <div style={{ minHeight: 240 }}>
              <LockedGate
                title="Premium feature"
                body="Subscribe to access the full report."
                unlockAction={
                  <button className="px-4 py-2 rounded-full bg-[#2D7A7B] text-white text-[14px]">
                    Unlock
                  </button>
                }
              >
                <div className="p-6">
                  <h3 className="text-[16px] font-bold m-0">Hidden content</h3>
                  <p className="text-[13px] text-[#6B6560] mt-2 m-0">
                    This text is wrapped in inert and aria-hidden.
                  </p>
                </div>
              </LockedGate>
            </div>
          </BrandPanel>
        ))}
      </Section>
    </main>
  );
}
