import { Product } from '../../shared';
import { GasFee } from '../../shared/interface/GasFee';
import { OrderStatus, PaymentMethod } from '../enum';
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

export interface CreateOrder {
  orderProducts: CreateOrderProduct[];
  currencyId: string;
  destinationWalletAddress: string;
  addressId?: string;
  signedGasFee: string;
  successUrl: string;
}

export interface CreateOrderProduct {
  productId: string;
  productTokenId?: string;
  expectedPrice: string;
}

export interface CreateOrderResponse {
  addressId: string;
  companyId: string;
  createdAt: string;
  currencyAmount: string;
  currencyId: string;
  deliverDate: string;
  destinationWalletAddress: string;
  expiresIn: string;
  gasFee: string;
  id: string;
  paymentInfo: PaymentInfoInterface;
  paymentUrl: string;
  paymentMethod: string;
  paymentProvider: PaymentMethod;
  providerTransactionId: string;
  serviceFee: string;
  status: OrderStatus;
  updatedAt: string;
  userId: string;
}

export interface PaymentInfoInterface {
  paymentUrl?: string;
  clientSecret?: string;
  publicKey?: string;
}

export interface CreateOrderPayload {
  companyId: string;
  createOrder: CreateOrder;
}
