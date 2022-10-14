export enum PixwayAPIRoutes {
  COMPANY_BY_ID = 'companies/hosts/{companyId}',
  SIGN_IN = 'auth/signin',
  REQUEST_PASSWORD_CHANGE = 'auth/request-password-reset',
  RESET_PASSWORD = 'auth/reset-password',
  REFRESH_TOKEN = 'auth/refresh-token',
  GET_PROFILE = 'users/profile',
  GET_FAQ = 'faq/context/filter',
  NFTS_BY_WALLET = 'metadata/nfts/{address}/{chainId}',
  TOKEN_EDITIONS = '{companyId}/token-editions',
  ESTIMATE_TRANSFER_GAS = '{companyId}/token-editions/{id}/estimate-gas/transfer',
  TRANSFER_MULTIPLE_TOKENS = '{companyId}/token-editions/transfer-token',
  GET_LAST_TRASNFER = '{companyId}/token-editions/{id}/get-last/transfer',
  TRANSFER_TOKEN = '{companyId}/token-editions/{id}/transfer-token',
  TOKEN_COLLECTION_BY_ID = '{companyId}/token-collections/{id}',
  COMPANIES = 'companies/{id}',
  BALANCE = 'blockchain/balance/{address}/{chainId}',
  ORDER_PREVIEW = '/companies/{companyId}/orders/preview',
  CREATE_ORDER = '/companies/{companyId}/orders',
  METADATA_BY_RFID = 'metadata/rfid/{rfid}',
  METADATA_BY_CHAINADDRESS_AND_TOKENID = 'metadata/address/{contractAddress}/{chainId}/{tokenId}',
  TOKEN_COLLECTIONS = '{companyId}/token-collections',
  CATEGORIES = 'categories',
  USERS = 'users/',
  VERIFY_SIGN_UP = '/auth/verify-sign-up',
  REQUEST_CONFIRMATION_MAIL = '/auth/request-confirmation-email',
  PATCH_PROFILE = '/users/{companyId}/profile',
}
