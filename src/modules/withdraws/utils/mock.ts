/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Withdraw,
  WithdrawOrder,
  WithdrawOrdersResponse,
  WithdrawStatus,
  WithdrawTotals,
  WithdrawsSummary,
} from '../interfaces';

// ---------------------------------------------------------------------------
// MOCK · dados simulados enquanto a Key API não expõe (api-faltante-saques.md):
//   §1 compras conciliadas por saque (ordersCount, period, totals, lista)
//   §2 XLS do saque
//   §4 resumo da lista (paidInPeriod)
//   relatório de auditoria (XLS)
// Tudo aqui é determinístico a partir do id do saque, para a tela ficar
// estável entre renders. Quando o endpoint existir, o hook correspondente
// deixa de cair aqui (ver `isMissingEndpoint`). Desligue com
// `WITHDRAWS_MOCK_FALLBACK = false` para ver o erro real da API.
// ---------------------------------------------------------------------------

export const WITHDRAWS_MOCK_FALLBACK = true;

/** 404/405/501 = rota ainda não existe no backend. */
export const isMissingEndpoint = (err: any) => {
  const status = err?.response?.status ?? err?.status;
  return status === 404 || status === 405 || status === 501;
};

const hash = (input: string) => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const rng = (seed: number) => {
  let s = seed || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

const money = (value: number) => value.toFixed(2);

const DAY = 24 * 60 * 60 * 1000;

const FIRST_NAMES = [
  'Mariana',
  'Carlos',
  'Júlia',
  'Rodrigo',
  'Beatriz',
  'Thiago',
  'Fernanda',
  'Lucas',
  'Ana',
  'Pedro',
  'Camila',
  'Rafael',
];

const LAST_INITIALS = [
  'S.',
  'E.',
  'M.',
  'P.',
  'L.',
  'A.',
  'R.',
  'V.',
  'C.',
  'H.',
];

export const CASHBACK_RATE = 0.05;

/** Período de compras: os 7 dias anteriores à solicitação. */
export const mockPeriodFor = (withdraw: Pick<Withdraw, 'createdAt'>) => {
  const end = withdraw.createdAt ? new Date(withdraw.createdAt) : new Date();
  const to = new Date(end.getTime() - DAY);
  const from = new Date(end.getTime() - 7 * DAY);
  return { from: from.toISOString(), to: to.toISOString() };
};

/**
 * Gera a lista completa de compras de um saque. O líquido fecha exatamente
 * no `amount` do saque para a composição bater com o valor real.
 */
export const mockOrdersFor = (
  withdraw: Pick<Withdraw, 'id' | 'amount' | 'createdAt'>
): WithdrawOrder[] => {
  const seed = hash(withdraw.id || 'withdraw');
  const next = rng(seed);
  const amount = Number(withdraw.amount) || 0;
  const count =
    amount <= 0 ? 0 : Math.max(1, Math.min(60, Math.round(amount / 70) + 3));
  const { from } = mockPeriodFor(withdraw);
  const start = new Date(from).getTime();

  // Pesos aleatórios normalizados para somar o amount.
  const weights = Array.from({ length: count }, () => 0.4 + next());
  const weightSum = weights.reduce((a, b) => a + b, 0);
  let distributed = 0;

  return weights
    .map((w, index) => {
      const isLast = index === count - 1;
      const net = isLast
        ? Math.round((amount - distributed) * 100) / 100
        : Math.round(((amount * w) / weightSum) * 100) / 100;
      distributed += net;
      const gross = net / (1 - CASHBACK_RATE);
      const purchasedAt = new Date(
        start +
          Math.floor(next() * 6 * DAY) +
          Math.floor(next() * 12) * 3600000 +
          11 * 3600000
      );
      const releasedAt = new Date(purchasedAt.getTime() + 3 * DAY);
      const first = FIRST_NAMES[Math.floor(next() * FIRST_NAMES.length)];
      const last = LAST_INITIALS[Math.floor(next() * LAST_INITIALS.length)];
      const orderCode = `#${seed.toString(16).slice(0, 4).toUpperCase()}-${(
        9000 +
        index * 13 +
        Math.floor(next() * 9)
      ).toString()}`;
      return {
        loyaltyDeferredId: `mock-${withdraw.id}-${index}`,
        orderId: orderCode,
        purchasedAt: purchasedAt.toISOString(),
        releasedAt: releasedAt.toISOString(),
        customer: { name: `${first} ${last}` },
        grossAmount: money(gross),
        cashbackAmount: money(gross - net),
        netAmount: money(net),
        status: 'released' as const,
      };
    })
    .sort((a, b) => a.purchasedAt.localeCompare(b.purchasedAt));
};

export const totalsOf = (orders: WithdrawOrder[]): WithdrawTotals => {
  const sum = (
    key: keyof Pick<
      WithdrawOrder,
      'grossAmount' | 'cashbackAmount' | 'netAmount'
    >
  ) => orders.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
  return {
    gross: money(sum('grossAmount')),
    cashback: money(sum('cashbackAmount')),
    net: money(sum('netAmount')),
  };
};

export const mockOrdersPage = (
  withdraw: Pick<Withdraw, 'id' | 'amount' | 'createdAt'>,
  page = 1,
  limit = 10
): WithdrawOrdersResponse => {
  const all = mockOrdersFor(withdraw);
  const totalPages = Math.max(1, Math.ceil(all.length / limit));
  const current = Math.min(Math.max(1, page), totalPages);
  const items = all.slice((current - 1) * limit, current * limit);
  return {
    items,
    meta: {
      totalItems: all.length,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: current,
    },
    totals: totalsOf(all),
    isMock: true,
  };
};

/**
 * Preenche ordersCount / period / totals quando a API não mandou.
 * Saques recusados ou com falha no escrow não têm compras conciliadas.
 */
export const withWithdrawExtras = <T extends Withdraw>(withdraw: T): T => {
  if (!WITHDRAWS_MOCK_FALLBACK) return withdraw;
  if (withdraw.ordersCount !== undefined && withdraw.period !== undefined) {
    return withdraw;
  }
  if (withdraw.status === WithdrawStatus.REFUSED) {
    return {
      ...withdraw,
      ordersCount: withdraw.ordersCount ?? 0,
      period: withdraw.period ?? null,
      extrasAreMock: true,
    };
  }
  const orders = mockOrdersFor(withdraw);
  return {
    ...withdraw,
    ordersCount: withdraw.ordersCount ?? orders.length,
    period: withdraw.period ?? mockPeriodFor(withdraw),
    totals: withdraw.totals ?? totalsOf(orders),
    extrasAreMock: true,
  };
};

export const mockSummary = (
  partial: Partial<WithdrawsSummary> & { seed?: string }
): WithdrawsSummary => {
  const next = rng(hash(partial.seed ?? 'summary'));
  const count = partial.paidInPeriod?.count ?? Math.floor(8 + next() * 10);
  const ordersCount = count * Math.floor(12 + next() * 10);
  return {
    awaitingAction: partial.awaitingAction ?? Math.floor(next() * 5),
    processing: partial.processing ?? Math.floor(next() * 8),
    paidInPeriod: partial.paidInPeriod ?? {
      count,
      amount: money(count * (900 + next() * 900)),
      ordersCount,
    },
    nextExecutionAt: partial.nextExecutionAt ?? null,
    isMock: true,
  };
};

const csvEscape = (value: unknown) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * XLS do saque simulado: gera um CSV (abre no Excel) com as compras do saque.
 * Substituído pelo arquivo do backend quando `GET .../xlsx` existir.
 */
export const mockWithdrawXlsxBlob = (
  withdraw: Withdraw,
  header: Record<string, string>,
  columns: string[]
) => {
  const orders = mockOrdersFor(withdraw);
  const totals = totalsOf(orders);
  const lines: string[] = [];
  Object.entries(header).forEach(([key, value]) => {
    lines.push(`${csvEscape(key)};${csvEscape(value)}`);
  });
  lines.push('');
  lines.push(columns.map(csvEscape).join(';'));
  orders.forEach((order) => {
    lines.push(
      [
        order.orderId,
        order.purchasedAt,
        order.customer?.name,
        order.releasedAt,
        order.grossAmount,
        order.cashbackAmount,
        order.netAmount,
      ]
        .map(csvEscape)
        .join(';')
    );
  });
  lines.push(
    ['', '', '', 'TOTAL', totals.gross, totals.cashback, totals.net].join(';')
  );
  return new Blob(['﻿' + lines.join('\n')], {
    type: 'text/csv;charset=utf-8',
  });
};

export const mockAuditXlsxBlob = (
  withdraws: Withdraw[],
  columns: string[],
  rowOf: (withdraw: Withdraw) => unknown[]
) => {
  const lines = [columns.map(csvEscape).join(';')];
  withdraws.forEach((withdraw) => {
    lines.push(rowOf(withdraw).map(csvEscape).join(';'));
  });
  return new Blob(['﻿' + lines.join('\n')], {
    type: 'text/csv;charset=utf-8',
  });
};
