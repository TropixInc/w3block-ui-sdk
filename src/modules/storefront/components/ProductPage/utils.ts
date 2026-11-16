import { formatterCurrency } from '../../../shared/components/CriptoValueComponent';
import { AvailableInstallmentInfo } from '../../../checkout/interface/interface';

export const CHAIN_IDS: Record<number, string> = {
  137: 'Polygon',
  4: 'Rinkeby',
  1: 'Ethereum',
} as const;

export const DEFAULT_CHAIN = 'Mumbai';

export function getChainName(chainId?: number): string {
  return chainId ? (CHAIN_IDS[chainId] ?? DEFAULT_CHAIN) : DEFAULT_CHAIN;
}

export function generateInstallmentText(
  installment: AvailableInstallmentInfo,
  currency: string
): string {
  return `${installment.amount}x de ${formatterCurrency(
    currency,
    String(installment?.installmentPrice)
  )} ${
    installment.interest && installment.interest !== 0
      ? `(${installment.interest}% de juros)`
      : 'sem juros'
  }`;
}

export const DEFAULT_INSTALLMENT: AvailableInstallmentInfo = {
  amount: 0,
  finalPrice: '0',
  installmentPrice: 20,
  interest: 0,
};
