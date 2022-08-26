import { Product } from '../../../shared';
import { GasFee } from '../../../shared/interface/GasFee';

export interface OrderPreviewResponse {
  products: Product[];
  cartPrice?: string;
  serviceFee?: string;
  gasFee?: GasFee;
  totalPrice?: string;
}

export interface OrderPreviewCache {
  currencyId: string;
  product: Product;
  orderProducts: OrderProductsInterface[];
  signedGasFee: string;
}

interface OrderProductsInterface {
  expectedPrice: string;
  productId: string;
}
