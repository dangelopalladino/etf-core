import React from 'react';
import { KICKER_CLASS, STAT_NUMBER_CLASS } from '../tokens/shared';

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
 * via `tabular-nums` + `overflow-wrap: anywhere` on StatValue. Value type
 * comes from `STAT_NUMBER_CLASS` (32 → 48px fluid clamp across 375 → 1440);
 * label uses `KICKER_CLASS` (12 → 14px fluid). Replaced the prior
 * `text-[Npx] md:text-[Mpx] lg:text-[Kpx]` breakpoint ladder in v1.11.0.
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
      className={`${STAT_NUMBER_CLASS} [overflow-wrap:anywhere] m-0 ${className}`.trim()}
    >
      {children}
    </dd>
  );
}

export function StatLabel({ children, className = '' }: StatLabelProps) {
  return (
    <dt
      className={`${KICKER_CLASS} text-text-secondary m-0 ${className}`.trim()}
    >
      {children}
    </dt>
  );
}

export default Stat;
