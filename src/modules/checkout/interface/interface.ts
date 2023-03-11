import { Product } from '../../shared';
import { GasFee } from '../../shared/interface/GasFee';
import { OrderStatus, PaymentMethod } from '../enum';
export interface OrderPreviewResponse {
  products: Product[];
  cartPrice?: string;
  clientServiceFee?: string;
  gasFee?: GasFee;
  totalPrice?: string;
  providersForSelection?: PaymentMethodsAvaiable[];
}

export interface PaymentMethodsAvaiable {
  paymentMethod: string;
  paymentProvider: string;
  inputs: string[];
}
export interface OrderPreviewCache {
  currencyId: string;
  products: Product[];
  orderProducts: OrderProductsInterface[];
  signedGasFee: string;
  totalPrice: string;
  choosedPayment?: PaymentMethodsAvaiable;
  cpfCnpj?: string;
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
  paymentMethod?: string;
  providerInputs?: unknown;
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
  clientServiceFee: string;
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
