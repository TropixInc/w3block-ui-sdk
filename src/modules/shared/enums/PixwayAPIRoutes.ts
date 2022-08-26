export enum PixwayAPIRoutes {
  COMPANY_BY_ID = 'companies/hosts/{companyId}',
  SIGN_IN = 'auth/signin',
  REQUEST_PASSWORD_CHANGE = 'auth/request-password-reset',
  RESET_PASSWORD = 'auth/reset-password',
  REFRESH_TOKEN = 'auth/refresh-token',
  GET_PROFILE = 'users/profile',
  NFTS_BY_WALLET = 'metadata/nfts/{address}/{chainId}',
}
