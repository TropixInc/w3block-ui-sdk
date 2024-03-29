/* eslint-disable @typescript-eslint/no-explicit-any */
import { UtmContextInterface } from '../../core/context/UtmContext';
import { Status } from '../../core/metamask/interface';
import { Product } from '../../shared';
import { GasFee } from '../../shared/interface/GasFee';
import { Variants } from '../../storefront/hooks/useGetProductBySlug/useGetProductBySlug';
import { OrderStatus, PaymentMethod } from '../enum';

export interface PaymentsResponse {
  totalPrice?: string;
  currencyId?: string;
  originalCartPrice?: string;
  originalClientServiceFee?: string;
  originalTotalPrice?: string;
  cartPrice?: string;
  clientServiceFee?: string;
  gasFee?: GasFee;
  providersForSelection?: PaymentMethodsAvaiable[];
}
export interface OrderPreviewResponse {
  products: Product[];
  cartPrice?: string;
  clientServiceFee?: string;
  gasFee?: GasFee;
  totalPrice?: string;
  productsErrors?: ProductErrorInterface[];
  providersForSelection?: PaymentMethodsAvaiable[];
  appliedCoupon?: string;
  originalCartPrice?: string;
  originalClientServiceFee?: string;
  originalTotalPrice?: string;
  variants?: Variants[];
  cashback?: {
    amount?: string;
    cashbackAmount?: string;
    currencyId?: string;
  };
  payments?: PaymentsResponse[];
}

export interface ProductErrorInterface {
  productId: string;
  product: Product;
  error: {
    code: string;
    limit: number;
  };
}
export interface createOrderResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  userId: string;
  destinationWalletAddress: string;
  addressId?: string;
  currencyId: string;
  currencyAmount: string;
  status: Status;
  paymentProvider: string;
  providerTransactionId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentMethod: any;
  paymentInfo: {
    split: {
      percentage: number;
      destination: string;
    }[];
    approved: boolean;
    payRoyalty: boolean;
    totalPrice: string;
    w3blockFeePercentage?: number;
    remainingFeePercentage?: number;
  };
  deliverDate?: string;
  expiresIn: string;
  gasFee: string;
  clientServiceFee: string;
  failReason: string;
  totalAmount: string;
}

export interface AvailableInstallmentInfo {
  amount: number;
  finalPrice: string;
  interest?: number;
  installmentPrice: number;
}
export interface PaymentMethodsAvaiable {
  paymentMethod: string;
  paymentProvider: string;
  inputs: string[];
  availableInstallments?: AvailableInstallmentInfo[];
}
export interface OrderPreviewCache {
  payments?: PaymentsResponse[];
  currencyId: string;
  products: Product[];
  orderProducts: OrderProductsInterface[];
  signedGasFee: string;
  totalPrice: string;
  choosedPayment?: PaymentMethodsAvaiable;
  cpfCnpj?: string;
  clientServiceFee?: string;
  gasFee?: GasFee;
  cartPrice?: string;
  couponCode?: string;
  originalCartPrice?: string;
  originalClientServiceFee?: string;
  originalTotalPrice?: string;
  destinationUser?: {
    walletAddress: string;
    name: string;
  };
  isCoinPayment?: boolean;
  cashback?: string;
}

export interface OrderProductsInterface {
  expectedPrice: string;
  productId: string;
  variantIds?: string[];
  quantity?: number;
  productTokenId?: string;
}

export interface CreateOrder {
  orderProducts: CreateOrderProduct[];
  currencyId: string;
  destinationWalletAddress: string;
  addressId?: string;
  signedGasFee: string;
  successUrl?: string;
  paymentMethod?: string;
  providerInputs?: unknown;
  utmParams?: UtmContextInterface;
  couponCode?: string;
  payments?: {
    currencyId: string;
    paymentMethod?: string;
    paymentProvider?: string;
    providerInputs?: unknown;
    amountType?: string;
    amount?: string;
  }[];
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
  totalAmount: any;
  originalCurrencyAmount?: string;
  originalTotalAmount?: string;
  deliverId: string;
}

export interface PaymentInfoInterface {
  paymentUrl?: string;
  pix?: PixInterface;
  clientSecret?: string;
  publicKey?: string;
}

export interface PixInterface {
  encodedImage: string;
  expirationDate: string;
  payload: string;
}
export interface CreateOrderPayload {
  companyId: string;
  createOrder: CreateOrder;
}
