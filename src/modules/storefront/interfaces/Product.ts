export interface DataFields {
    name: string;
    label: string;
    required: boolean;
    type: 'text' | 'textarea';
  }

  interface Terms {
    title: string;
    description?: string;
    link?: string;
  }

  export type ProductPrice = {
    amount: string;
    currency: CurrencyResponse;
    currencyId?: string;
    anchorCurrencyId?: string;
  };
  
  export interface CurrencyResponse {
    code?: string;
    createdAt?: string;
    crypto?: boolean;
    id?: string;
    name?: string;
    symbol: string;
    updatedAt?: string;
  }

  export interface VariantValues {
    id: string;
    createdAt: string;
    updatedAt: string;
    companyId: string;
    name: string;
    extraAmount: string;
    keyValue: string;
  }

  export interface Variants {
    id: string;
    createdAt: string;
    updatedAt: string;
    companyId: string;
    name: string;
    keyLabel: string;
    values: VariantValues[];
  }
  

export interface Product {
    settings?: {
      acceptMultipleCurrenciesPurchase?: boolean;
      passShareCodeConfig?: {
        enabled?: boolean;
        dataFields?: DataFields[];
      };
    };
    canPurchase?: boolean;
    chainId?: number;
    htmlContent?: string;
    companyId?: string;
    contractAddress?: string;
    createdAt?: string;
    description: string;
    hasLink?: boolean;
    distributionType?: string;
    draftData?: {
      keyCollectionId?: string;
      quantity?: number;
      range?: string;
    };
    endSaleAt?: string;
    id: string;
    images: {
      assetId?: string;
      original?: string;
      thumb?: string;
      variants?: {
        keyLabel: string;
        keyValue: string;
      }[];
    }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any;
    name: string;
    prices: ProductPrice[];
    pricingType?: string;
    slug: string;
    startSaleAt?: string;
    status?: string;
    stockAmount?: number;
    canPurchaseAmount?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags?: any[];
    tokensAmount?: number;
    updatedAt?: string;
    requirements?: {
      companyId: string;
      keyCollectionId: string;
      productId: string;
      requirementCTALabel: string;
      requirementCTAAction: string;
      requirementDescription: string;
      requirementModalContent: string;
      autoCloseOnSuccess: boolean;
      linkMessage: string;
      purchaseRequiredModalContent: string;
      requirementModalPendingContent: string;
      requirementModalNoPurchaseAvailable: string;
      requireKycContext?: {
        slug?: string;
      };
    };
    hasWhitelistBlocker?: boolean;
    variants?: Variants[];
    terms?: Terms[];
  }
  