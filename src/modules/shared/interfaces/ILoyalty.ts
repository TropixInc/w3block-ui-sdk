export interface LoyaltyInterface {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  contractId: string;
  settings: Settings;
  name: string;
  compensateRule: CompensateRule;
  priority: number;
  tokenIssuanceMethod: string;
  tokenIssuanceAddress: string;
  tokenTransferabilityMethod: string;
  tokenTransferabilityAddress: string;
  pointPrecision: string;
  paymentViewSettings: PaymentViewSettings;
  rules: Rule[];
}
export interface Settings {
  paymentView: PaymentView;
}
export interface PaymentView {
  enabled: boolean;
}

export interface CompensateRule {
  period: string;
}

export interface PaymentViewSettings {
  pointsEquivalent: PointsEquivalent;
}

export interface PointsEquivalent {
  currency: string;
  pointsValue: number;
  currencyValue: number;
}

export interface Rule {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  loyaltyId: string;
  whitelistId: string;
  value: string;
  available: string;
  type: string;
  name: string;
  description: string;
  priority: number;
}
