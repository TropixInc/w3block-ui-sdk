import { Product } from '../../../shared';
import { GasFee } from '../../../shared/interface/GasFee';

export interface OrderPreviewResponse {
  products: Product[];
  cartPrice: string;
  serviceFee: string;
  gasFee: GasFee;
  totalPrice: string;
}
