import React from 'react';

export interface StatProps {
  children: React.ReactNode;
  className?: string;
}

export interface StatValueProps {
  children: React.ReactNode;
  className?: string;
}

export interface StatLabelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Stat — semantic value+label container. Composes via children.
 *
 * @remarks
 * Layout at 320px (base): renders `<dl>` with `flex flex-col gap-1`,
 * `text-left` (caller can override). No fixed dimensions; long values wrap
 * via `tabular-nums` + `overflow-wrap: anywhere` on StatValue. Scales
 * proportionally — value font caps via brand type scale (default 32px at
 * base, 40px at md:, 48px at lg:). Label is `text-[12px]` at base, `text-[13px]`
 * at md:.
 *
 * ARIA: <dl> is a description-list; <dd> (StatValue) holds the value and <dt>
 * (StatLabel) the term. Note dd-before-dt is intentional: visually, value
 * leads label, but a description list permits any order of the pair within a
 * group.
 *
 * Composition:
 *   <Stat>
 *     <StatValue>9,283</StatValue>
 *     <StatLabel>Active members</StatLabel>
 *   </Stat>
 */
export function Stat({ children, className = '' }: StatProps) {
  return (
    <dl className={`flex flex-col gap-1 m-0 ${className}`.trim()}>
      {children}
    </dl>
  );
}

export function StatValue({ children, className = '' }: StatValueProps) {
  return (
    <dd
      className={`text-[32px] md:text-[40px] lg:text-[48px] font-bold leading-[1.1] tabular-nums [overflow-wrap:anywhere] m-0 ${className}`.trim()}
    >
      {children}
    </dd>
  );
}

export function StatLabel({ children, className = '' }: StatLabelProps) {
  return (
    <dt
      className={`text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.08em] text-text-secondary m-0 ${className}`.trim()}
    >
      {children}
    </dt>
  );
}

export default Stat;
