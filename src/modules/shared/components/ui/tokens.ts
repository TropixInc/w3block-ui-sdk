/**
 * Visual tokens of the internal-area facelift. Neutral by design: the tenant
 * colour only enters through the theme (`pw-*-brand-primary`).
 *
 * Kept as plain class strings so Tailwind can see them at build time.
 */
export const UI = {
  text: 'pw-text-[#0F1729]',
  textSecondary: 'pw-text-[#4A5567]',
  textMuted: 'pw-text-[#6B7280]',
  textFaint: 'pw-text-[#8B93A3]',
  line: 'pw-border-[#E6E8EC]',
  card: 'pw-bg-white pw-rounded-[10px] pw-shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
  cardPadding: 'pw-p-4 sm:pw-p-5',
  /** 11px uppercase label used on table headers and KPI labels. */
  label:
    'pw-text-[11px] pw-font-semibold pw-uppercase pw-tracking-[0.04em] pw-text-[#6B7280]',
  surfaceGrey: 'pw-bg-[#F1F3F6]',
  surfaceAccent: 'pw-bg-[#F5F9FF]',
  focusRing:
    'focus-visible:pw-outline-none focus-visible:pw-ring-2 focus-visible:pw-ring-brand-primary focus-visible:pw-ring-offset-1',
} as const;

export type Tone = 'ok' | 'warn' | 'bad' | 'info' | 'grey';

export const TONE_CLASSES: Record<Tone, string> = {
  ok: 'pw-bg-[#E6F6EF] pw-text-[#0B7A55]',
  warn: 'pw-bg-[#FDF5E6] pw-text-[#9A6508]',
  bad: 'pw-bg-[#FDECEC] pw-text-[#C92A2D]',
  info: 'pw-bg-[#EAF1FC] pw-text-[#2F6FD0]',
  grey: 'pw-bg-[#F1F3F6] pw-text-[#4A5567]',
};

export const TONE_TEXT: Record<Tone, string> = {
  ok: 'pw-text-[#0B7A55]',
  warn: 'pw-text-[#9A6508]',
  bad: 'pw-text-[#C92A2D]',
  info: 'pw-text-[#2F6FD0]',
  grey: 'pw-text-[#4A5567]',
};
