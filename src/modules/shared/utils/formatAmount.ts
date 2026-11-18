/**
 * Formats a token / points amount for display. `integer` precision drops the
 * decimals (loyalty programmes that count whole points).
 */
export const formatAmount = (
  value: string | number | null | undefined,
  locale?: string,
  precision: 'decimal' | 'integer' = 'decimal'
) => {
  const n = Number(value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  const digits = precision === 'integer' ? 0 : 2;
  const intlLocale =
    locale && locale.toLowerCase().startsWith('en') ? 'en-US' : 'pt-BR';
  return safe.toLocaleString(intlLocale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};
