export enum PaymentMethod {
  PAGAR_ME = 'pagar_me',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  ASAAS = 'asaas',
  BRAZA = 'braza',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMING_PAYMENT = 'confirming_payment',
  WAITING_DELIVERY = 'waiting_delivery',
  DELIVERING = 'delivering',
  CONCLUDED = 'concluded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PARTIALLY_CANCELLED = 'partially_cancelled',
  EXPIRED = 'expired',
}
