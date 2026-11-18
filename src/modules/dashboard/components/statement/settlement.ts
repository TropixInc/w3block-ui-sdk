/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Repasse (settlement) de um lançamento de cashback.
//
// A Key API ainda não vincula o lançamento (loyalties_deferred) ao saque que
// o repassou (pedido nº 3 do api-faltante-saques.md). Quando vincular, cada
// item virá com `settlement`, `withdrawId` e `withdrawPaidAt`; este módulo já
// lê esses campos. Enquanto não vêm, `STATEMENT_MOCK_FALLBACK` gera uma
// simulação determinística por id, marcada como simulada na tela.
// ---------------------------------------------------------------------------

export const STATEMENT_MOCK_FALLBACK = true;

export type Settlement = 'pending' | 'in_withdraw' | 'paid' | 'refused';

export type SettlementColor = 'green' | 'blue' | 'amber' | 'red' | 'gray';

export interface SettlementInfo {
  settlement?: Settlement | null;
  withdrawId?: string | null;
  withdrawPaidAt?: string | null;
}

export interface SettlementPresentation {
  key: 'released' | 'pending' | 'in_withdraw' | 'paid' | 'refused' | 'locked';
  color: SettlementColor;
  /** Data do pagamento do repasse (ISO), quando pago. */
  paidAt?: string | null;
  withdrawId?: string | null;
  isMock: boolean;
}

export const SETTLEMENT_PILL_CLASSES: Record<SettlementColor, string> = {
  green: 'pw-bg-[#e7f7f0] pw-text-[#0b7a55]',
  blue: 'pw-bg-[#eaf1fc] pw-text-[#2f6fd0]',
  amber: 'pw-bg-[#fdf5e6] pw-text-[#9a6508]',
  red: 'pw-bg-[#fdecec] pw-text-[#c92a2d]',
  gray: 'pw-bg-[#f1f3f6] pw-text-[#4a5567]',
};

const hash = (input: string) => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const DAY = 24 * 60 * 60 * 1000;

/** Próxima sexta-feira 09:00 depois de `from` (rodada semanal de repasse). */
const nextFridayAfter = (from: Date) => {
  const date = new Date(from.getTime());
  const offset = (5 - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + offset);
  date.setHours(9, 0, 0, 0);
  return date;
};

/**
 * Simulação determinística: lançamento liberado há mais de uma rodada
 * semanal conta como repassado na sexta seguinte à liberação; liberado há
 * menos tempo fica aguardando ou em repasse.
 */
export const mockSettlementFor = (
  id: string,
  releasedAt?: string | Date | null
): Required<SettlementInfo> => {
  const released = releasedAt ? new Date(releasedAt) : null;
  if (!released || Number.isNaN(released.getTime())) {
    return { settlement: 'pending', withdrawId: null, withdrawPaidAt: null };
  }
  const seed = hash(id || 'statement');
  const payday = nextFridayAfter(released);
  const now = Date.now();
  if (payday.getTime() + 2 * DAY < now) {
    return {
      settlement: 'paid',
      withdrawId: `mock-${seed.toString(16).slice(0, 8)}`,
      withdrawPaidAt: payday.toISOString(),
    };
  }
  if (payday.getTime() - DAY < now) {
    return {
      settlement: 'in_withdraw',
      withdrawId: `mock-${seed.toString(16).slice(0, 8)}`,
      withdrawPaidAt: null,
    };
  }
  return { settlement: 'pending', withdrawId: null, withdrawPaidAt: null };
};

interface ResolveArgs {
  id: string;
  /** Item como veio da API (lê settlement / withdrawId / withdrawPaidAt). */
  item?: SettlementInfo | null;
  /** Já liberado para saque? (withdrawableAt no passado) */
  released: boolean;
  releasedAt?: string | Date | null;
}

/**
 * Decide o que a pill de repasse mostra. Lançamento ainda travado pelo
 * vesting nunca tem repasse ("aguardando liberação"). Liberado: usa o campo
 * da API se existir; senão, a simulação (se ligada); senão, nada.
 */
export const resolveSettlement = ({
  id,
  item,
  released,
  releasedAt,
}: ResolveArgs): SettlementPresentation | null => {
  if (!released) {
    return { key: 'locked', color: 'gray', isMock: false };
  }
  const fromApi = item?.settlement;
  const source: Required<SettlementInfo> | null = fromApi
    ? {
        settlement: fromApi,
        withdrawId: item?.withdrawId ?? null,
        withdrawPaidAt: item?.withdrawPaidAt ?? null,
      }
    : STATEMENT_MOCK_FALLBACK
    ? mockSettlementFor(id, releasedAt)
    : null;
  if (!source) return null;
  const isMock = !fromApi;
  switch (source.settlement) {
    case 'paid':
      return {
        key: 'paid',
        color: 'green',
        paidAt: source.withdrawPaidAt,
        withdrawId: source.withdrawId,
        isMock,
      };
    case 'in_withdraw':
      return {
        key: 'in_withdraw',
        color: 'blue',
        withdrawId: source.withdrawId,
        isMock,
      };
    case 'refused':
      return {
        key: 'refused',
        color: 'red',
        withdrawId: source.withdrawId,
        isMock,
      };
    default:
      return { key: 'pending', color: 'amber', isMock };
  }
};

export const isReleased = (withdrawableAt?: string | Date | null) => {
  if (!withdrawableAt) return false;
  const date = new Date(withdrawableAt);
  return !Number.isNaN(date.getTime()) && date.getTime() <= Date.now();
};

/** Valor em pontos com duas casas (ou inteiro) no locale. */
export const formatPoints = (
  value: string | number | null | undefined,
  precision: 'integer' | 'decimal' = 'decimal',
  locale = 'pt-BR'
) => {
  const number = Number(value);
  if (value === undefined || value === null || Number.isNaN(number)) return '—';
  const digits = precision === 'integer' ? 0 : 2;
  return number.toLocaleString(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};
