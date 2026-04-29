import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NoticeCard } from '../src/ui-server/NoticeCard';
import { EmptyState } from '../src/ui-server/EmptyState';
import { IconBadge } from '../src/ui-server/IconBadge';
import { Stat, StatValue, StatLabel } from '../src/ui-server/Stat';
import { Hero } from '../src/ui-server/Hero';
import { LoadingState } from '../src/ui-client/LoadingState';
import { SkeletonCard } from '../src/ui-client/SkeletonCard';
import { LockedGate } from '../src/ui-client/LockedGate';

describe('NoticeCard ARIA', () => {
  it('urgent tone → role=alert + aria-live=assertive', () => {
    const { container } = render(
      <NoticeCard tone="urgent" title="Boom">Body</NoticeCard>
    );
    const region = container.querySelector('[role="alert"]');
    expect(region).toBeTruthy();
    expect(region!.getAttribute('aria-live')).toBe('assertive');
  });

  it('caution tone → role=alert + aria-live=assertive', () => {
    const { container } = render(<NoticeCard tone="caution" title="Heads up" />);
    const region = container.querySelector('[role="alert"]');
    expect(region).toBeTruthy();
    expect(region!.getAttribute('aria-live')).toBe('assertive');
  });

  it('info / success / neutral / locked / loading → role=status + aria-live=polite', () => {
    for (const tone of ['info', 'success', 'neutral', 'locked', 'loading'] as const) {
      const { container } = render(<NoticeCard tone={tone} title={`t-${tone}`} />);
      const region = container.querySelector('[role="status"]');
      expect(region, `tone=${tone}`).toBeTruthy();
      expect(region!.getAttribute('aria-live')).toBe('polite');
    }
  });

  it('aria-labelledby references the title id', () => {
    const { container } = render(<NoticeCard title="Hello" />);
    const region = container.querySelector('[aria-labelledby]')!;
    const id = region.getAttribute('aria-labelledby')!;
    const heading = container.querySelector(`[id="${id}"]`);
    expect(heading?.tagName).toBe('H3');
    expect(heading?.textContent).toBe('Hello');
  });

  it('icon slot is aria-hidden so SR users do not hear duplicate semantic', () => {
    const { container } = render(
      <NoticeCard title="t" icon={<svg data-testid="i" />} />
    );
    const wrapper = container.querySelector('[aria-hidden="true"]');
    expect(wrapper).toBeTruthy();
  });
});

describe('EmptyState ARIA', () => {
  it('renders <section> with aria-labelledby referencing the title heading', () => {
    const { container } = render(<EmptyState title="Nothing here" />);
    const section = container.querySelector('section[aria-labelledby]')!;
    const id = section.getAttribute('aria-labelledby')!;
    const heading = container.querySelector(`[id="${id}"]`);
    expect(heading?.tagName).toBe('H2');
    expect(heading?.textContent).toBe('Nothing here');
  });

  it('illustration slot wraps in aria-hidden when provided', () => {
    const { container } = render(
      <EmptyState title="t" illustration={<div data-testid="art" />} />
    );
    const hidden = container.querySelector('[aria-hidden="true"]');
    expect(hidden).toBeTruthy();
    expect(hidden!.contains(container.querySelector('[data-testid="art"]'))).toBe(true);
  });

  it('does not inject a fallback action when none is provided', () => {
    const { container } = render(<EmptyState title="t" />);
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
  });
});

describe('IconBadge ARIA', () => {
  it('with label → role=img + aria-label; inner icon aria-hidden', () => {
    const { container } = render(
      <IconBadge icon={<svg data-testid="i" />} label="Verified practitioner" />
    );
    const role = container.querySelector('[role="img"]');
    expect(role).toBeTruthy();
    expect(role!.getAttribute('aria-label')).toBe('Verified practitioner');
    const inner = container.querySelector('[aria-hidden="true"]');
    expect(inner).toBeTruthy();
  });

  it('without label → entire span aria-hidden (decorative)', () => {
    const { container } = render(<IconBadge icon={<svg />} />);
    const outer = container.firstElementChild!;
    expect(outer.getAttribute('aria-hidden')).toBe('true');
    expect(outer.getAttribute('role')).toBeNull();
  });
});

describe('Stat semantics', () => {
  it('renders dl/dd/dt structure', () => {
    const { container } = render(
      <Stat>
        <StatValue>9,283</StatValue>
        <StatLabel>Active members</StatLabel>
      </Stat>
    );
    expect(container.querySelector('dl')).toBeTruthy();
    expect(container.querySelector('dd')?.textContent).toBe('9,283');
    expect(container.querySelector('dt')?.textContent).toBe('Active members');
  });

  it('StatValue applies tabular-nums + overflow-wrap for long values', () => {
    const { container } = render(<Stat><StatValue>123,456,789,012</StatValue></Stat>);
    const dd = container.querySelector('dd')!;
    expect(dd.className).toContain('tabular-nums');
    expect(dd.className).toContain('overflow-wrap:anywhere');
  });
});

describe('Hero structure', () => {
  it('renders <header> with title as h1 by default; eyebrow is <p>', () => {
    const { container } = render(
      <Hero eyebrow="Briefing" title="The thing" subtitle="More" />
    );
    expect(container.querySelector('header')).toBeTruthy();
    expect(container.querySelector('h1')?.textContent).toBe('The thing');
    // Eyebrow should be <p>, NOT a heading element.
    const eyebrow = Array.from(container.querySelectorAll('p')).find(p => p.textContent === 'Briefing');
    expect(eyebrow).toBeTruthy();
    expect(eyebrow?.tagName).toBe('P');
  });

  it('level=2 renders h2 instead of h1', () => {
    const { container } = render(<Hero level={2} title="T" />);
    expect(container.querySelector('h2')?.textContent).toBe('T');
    expect(container.querySelector('h1')).toBeNull();
  });
});

describe('LoadingState ARIA', () => {
  it('outer wrapper is role=status + aria-live=polite + aria-busy=true', () => {
    const { container } = render(<LoadingState />);
    const region = container.querySelector('[role="status"]')!;
    expect(region).toBeTruthy();
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-busy')).toBe('true');
  });

  it('spinner SVG is aria-hidden', () => {
    const { container } = render(<LoadingState />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('empty label still emits sr-only "Loading" announcement', () => {
    const { container } = render(<LoadingState label="" />);
    const sr = container.querySelector('.sr-only');
    expect(sr?.textContent).toBe('Loading');
  });

  it('motion-reduce class is present on the spinner', () => {
    const { container } = render(<LoadingState />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('class')).toMatch(/motion-reduce:animate-none/);
  });
});

describe('SkeletonCard ARIA + reduced-motion', () => {
  it('entire skeleton is aria-hidden (decorative)', () => {
    const { container } = render(<SkeletonCard withMedia />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('media slot uses aspect-ratio (not a fixed pixel height)', () => {
    const { container } = render(<SkeletonCard withMedia mediaAspect="4/3" />);
    const media = container.querySelector('.motion-safe\\:animate-pulse') as HTMLElement | null;
    expect(media).toBeTruthy();
    // First .motion-safe:animate-pulse is the media slot when withMedia=true.
    expect(media!.style.aspectRatio).toBe('4/3');
    expect(media!.style.height).toBe('');
  });

  it('shimmer is gated via motion-safe so reduced-motion users see static tint', () => {
    const { container } = render(<SkeletonCard lines={2} />);
    const lines = container.querySelectorAll('[class*="motion-safe:animate-pulse"]');
    expect(lines.length).toBeGreaterThan(0);
  });
});

describe('LockedGate keyboard + ARIA', () => {
  it('panel is role=dialog + aria-modal + aria-labelledby on the title', () => {
    const { container } = render(
      <LockedGate title="Locked feature">
        <div>gated</div>
      </LockedGate>
    );
    const dialog = container.querySelector('[role="dialog"]')!;
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const id = dialog.getAttribute('aria-labelledby')!;
    expect(container.querySelector(`[id="${id}"]`)?.textContent).toBe('Locked feature');
  });

  it('gated children are wrapped with aria-hidden + inert (no blur-tease)', () => {
    const { container } = render(
      <LockedGate title="t">
        <div data-testid="gated">gated</div>
      </LockedGate>
    );
    const gated = container.querySelector('[data-testid="gated"]')!.parentElement!;
    expect(gated.getAttribute('aria-hidden')).toBe('true');
    // `inert` is reflected as an attribute (empty string when present).
    expect(gated.hasAttribute('inert')).toBe(true);
    // No blur class — blur-tease is forbidden.
    expect(gated.className).not.toMatch(/blur/);
  });

  it('focus moves to first focusable element in the panel on mount', () => {
    render(
      <LockedGate title="t" unlockAction={<button>Unlock</button>}>
        <div>gated</div>
      </LockedGate>
    );
    const btn = screen.getByRole('button', { name: 'Unlock' });
    expect(document.activeElement).toBe(btn);
  });

  it('Esc fires onDismiss only when dismissible', () => {
    const onDismiss = vi.fn();
    const { rerender } = render(
      <LockedGate title="t" dismissible={false} onDismiss={onDismiss}>
        <div>x</div>
      </LockedGate>
    );
    const dialog = document.querySelector('[role="dialog"]')!;
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onDismiss).not.toHaveBeenCalled();

    rerender(
      <LockedGate title="t" dismissible onDismiss={onDismiss}>
        <div>x</div>
      </LockedGate>
    );
    fireEvent.keyDown(document.querySelector('[role="dialog"]')!, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('Tab cycles within the panel (focus trap)', async () => {
    const user = userEvent.setup();
    render(
      <LockedGate
        title="t"
        unlockAction={
          <>
            <button>One</button>
            <button>Two</button>
          </>
        }
      >
        <div>gated</div>
      </LockedGate>
    );
    const one = screen.getByRole('button', { name: 'One' });
    const two = screen.getByRole('button', { name: 'Two' });
    expect(document.activeElement).toBe(one);
    await user.tab();
    expect(document.activeElement).toBe(two);
    await user.tab();
    expect(document.activeElement).toBe(one); // wraps
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(two); // wraps backward
  });

  it('focus restores to previously-focused element on unmount', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'open';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const { unmount } = render(
      <LockedGate title="t" unlockAction={<button>Unlock</button>}>
        <div>g</div>
      </LockedGate>
    );
    expect(document.activeElement).not.toBe(trigger);
    act(() => {
      unmount();
    });
    expect(document.activeElement).toBe(trigger);
    document.body.removeChild(trigger);
  });
});

// vi global is provided by vitest globals: true
declare const vi: typeof import('vitest').vi;
