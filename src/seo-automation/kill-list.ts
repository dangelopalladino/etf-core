/**
 * Brand kill-lists. Used by `lintDraft` to flag banned phrasing post-generation.
 *
 * Match rules:
 * - Strings are matched as case-insensitive whole-word/phrase regexes.
 * - RegExps are used as-is (caller pre-strips blockquotes, code fences,
 *   and `### References` sections to avoid false positives in citation text).
 * - Contextual carveouts use lookahead — e.g. ETF allows "evidence-based"
 *   when followed within 80 chars by a citation marker like `[1]`.
 */

export type KillListEntry =
  | { kind: 'phrase'; value: string }
  | { kind: 'regex'; value: RegExp; label: string };

const phrase = (value: string): KillListEntry => ({ kind: 'phrase', value });
const regex = (value: RegExp, label: string): KillListEntry => ({
  kind: 'regex',
  value,
  label,
});

export const ETF_KILL_LIST: KillListEntry[] = [
  phrase('journey'),
  phrase('unlock'),
  phrase('potential'),
  phrase('empower'),
  phrase('elevate'),
  phrase('thrive'),
  phrase('passionate'),
  phrase('purpose-driven'),
  phrase('change lives'),
  phrase('turnkey'),
  phrase('plug-and-play'),
  phrase('world-class'),
  phrase('paradigm-shifting'),
  // "trauma-informed" as a bare modifier (not followed by a noun-of-substance + citation)
  regex(
    /\btrauma-informed\b(?!.{0,80}\[\d+\])/i,
    'trauma-informed (bare modifier, no citation within 80 chars)'
  ),
  // "evidence-based" without an inline citation marker within 80 chars
  regex(
    /\bevidence-based\b(?!.{0,80}\[\d+\])/i,
    'evidence-based (no citation within 80 chars)'
  ),
  regex(
    /\bneuroscience-backed\b(?!.{0,80}\[\d+\])/i,
    'neuroscience-backed (no citation within 80 chars)'
  ),
];

export const SIXID_KILL_LIST: KillListEntry[] = [
  // Generic SaaS/marketing junk
  phrase('journey'),
  phrase('unlock'),
  phrase('potential'),
  phrase('empower'),
  phrase('elevate'),
  phrase('thrive'),
  phrase('authentic'),
  phrase('transform'),
  phrase('transcend'),
  phrase('holistic'),
  phrase('wellness'),
  phrase('self-love'),
  phrase('manifest'),
  phrase('alignment'),
  phrase('abundance'),
  phrase('vibrant'),
  phrase('synergy'),
  phrase('unleash'),
  phrase('harness'),
  phrase('foster'),
  phrase('best self'),
  phrase('find your why'),
  phrase('let us dive in'),
  phrase("let's dive in"),
  phrase("in today's world"),
  phrase('navigate the complexities'),
  // Therapy-speak
  phrase('meet you where you are'),
  phrase('hold space'),
  phrase('heal your wounds'),
  phrase('somatic'),
  phrase('inner child'),
  phrase('your healing journey'),
  // Manosphere
  phrase('alpha'),
  phrase('sigma'),
  phrase('grind'),
  phrase('dominate'),
  phrase('built different'),
  // OS frame is reserved for ETF
  phrase('operating system'),
  // "whether you're X or Y" construction
  regex(
    /\bwhether you(?:'re| are)\b[^.]{0,120}\bor\b/i,
    'whether you are X or Y (construction)'
  ),
];
