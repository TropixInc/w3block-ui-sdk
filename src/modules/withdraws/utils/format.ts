import { WithdrawPeriod } from '../interfaces';

const toDate = (value?: string | Date | null) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const formatWithdrawDate = (
  value?: string | Date | null,
  locale = 'pt-BR'
) => {
  const date = toDate(value);
  return date ? date.toLocaleDateString(locale) : '—';
};

export const formatWithdrawDateTime = (
  value?: string | Date | null,
  locale = 'pt-BR'
) => {
  const date = toDate(value);
  if (!date) return '—';
  return `${date.toLocaleDateString(locale)} ${date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

/** "24/10 – 30/10/2026" */
export const formatWithdrawPeriod = (
  period?: WithdrawPeriod | null,
  locale = 'pt-BR'
) => {
  const from = toDate(period?.from);
  const to = toDate(period?.to);
  if (!from || !to) return '—';
  const short = (d: Date) =>
    d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' });
  return `${short(from)} – ${to.toLocaleDateString(locale)}`;
};

/** Valor em pontos/moeda com duas casas no locale ("2.640,00"). */
export const formatWithdrawAmount = (
  value?: string | number | null,
  locale = 'pt-BR'
) => {
  const number = Number(value);
  if (value === undefined || value === null || Number.isNaN(number)) return '—';
  return number.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const shortenWallet = (address?: string | null) =>
  address && address.length > 12
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : address ?? '—';

export const shortenId = (id?: string | null) =>
  id && id.length > 12 ? `${id.slice(0, 4)}-…-${id.slice(-4)}` : id ?? '—';
