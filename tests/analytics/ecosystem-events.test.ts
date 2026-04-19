import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  ECOSYSTEM_EVENTS,
  type EcosystemEventName,
} from '../../src/analytics/events';

describe('analytics/ECOSYSTEM_EVENTS', () => {
  it('SIX_I_TO_ETF_TRANSITION matches canonical literal', () => {
    expect(ECOSYSTEM_EVENTS.SIX_I_TO_ETF_TRANSITION).toBe(
      'ecosystem_6i_to_etf_transition'
    );
  });

  it('ETF_TO_SIX_I_TRANSITION matches canonical literal', () => {
    expect(ECOSYSTEM_EVENTS.ETF_TO_SIX_I_TRANSITION).toBe(
      'ecosystem_etf_to_6i_transition'
    );
  });

  it('exposes exactly the two documented ecosystem events', () => {
    expect(Object.keys(ECOSYSTEM_EVENTS).sort()).toEqual([
      'ETF_TO_SIX_I_TRANSITION',
      'SIX_I_TO_ETF_TRANSITION',
    ]);
  });

  it('EcosystemEventName unions the two value literals', () => {
    expectTypeOf<EcosystemEventName>().toEqualTypeOf<
      'ecosystem_6i_to_etf_transition' | 'ecosystem_etf_to_6i_transition'
    >();
  });
});
