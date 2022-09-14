import { Currency } from '../Currency';

export interface Price {
  amount: string;
  currencyId: string;
  currency: Currency;
}
