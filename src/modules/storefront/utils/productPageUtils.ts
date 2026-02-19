import { AvailableInstallmentInfo } from '../../checkout/interface/interface';
import { formatterCurrency } from '../../shared/components/CriptoValueComponent';

export const getChainName = (chainId?: number): string => {
  switch (chainId) {
    case 137:
      return 'Polygon';
    case 4:
      return 'Rinkeby';
    case 1:
      return 'Ethereum';
    default:
      return 'Mumbai';
  }
};

export const generateInstallmentText = (
  installment: AvailableInstallmentInfo,
  currency: string
): string => {
  return `${installment.amount}x de ${formatterCurrency(
    currency,
    String(installment?.installmentPrice)
  )} ${
    installment.interest && installment.interest !== 0
      ? `(${installment.interest}% de juros)`
      : 'sem juros'
  }`;
};
