export interface CurrencyPaymentProviderEntityDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  currencyId: string;
  paymentProvider: string;
}

export interface CurrencyEntityDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  crypto: boolean;
  paymentProviders: CurrencyPaymentProviderEntityDto;
  label: string;
  disabled: boolean;
}
