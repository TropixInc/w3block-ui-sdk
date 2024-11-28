import { CurrencyEnum } from '../../enums/Currency';

export interface Currency {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: CurrencyEnum;
  crypto: boolean;
  code?: string;
  symbol?: string;
}
