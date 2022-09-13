import { useQuery } from 'react-query';

import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.coinbase.com/v2',
});

type Currency = 'ETH' | 'MATIC';

export interface CurrencyExchangeRate {
  data: {
    currency: Currency;
    rates: {
      MATIC: string;
      ETH: string;
      BRL: string;
      USD: string;
      EUR: string;
    };
  };
}

export const useCryptoCurrencyExchangeRate = (currency: Currency) => {
  return useQuery(['cripto', currency], () => {
    return instance.get<CurrencyExchangeRate>(
      `/exchange-rates?currency=${currency}`
    );
  });
};
