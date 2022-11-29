export enum CurrencyEnum {
  BRL = 'BRL',
  USD = 'USD',
}

export const currencyMap = new Map([
  [CurrencyEnum.BRL, 'R$'],
  [CurrencyEnum.USD, 'US$'],
]);
