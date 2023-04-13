export enum CurrencyEnum {
  BRL = 'BRL',
  USD = 'USD',
  MATIC = 'MATIC',
  ETHEREUM = 'ETH',
}

export const currencyMap = new Map([
  [CurrencyEnum.BRL, 'R$'],
  [CurrencyEnum.USD, 'US$'],
  [CurrencyEnum.MATIC, 'MATIC'],
  [CurrencyEnum.ETHEREUM, 'ETH'],
]);
