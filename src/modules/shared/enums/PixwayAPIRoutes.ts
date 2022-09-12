export enum PixwayAPIRoutes {
  COMPANY_BY_ID = 'companies/hosts/{companyId}',
  SIGN_IN = 'auth/signin',
  REQUEST_PASSWORD_CHANGE = 'auth/request-password-reset',
  RESET_PASSWORD = 'auth/reset-password',
  REFRESH_TOKEN = 'auth/refresh-token',
  GET_PROFILE = 'users/profile',
  ORDER_PREVIEW = '/companies/{companyId}/orders/preview',
  CREATE_ORDER = '/companies/{companyId}/orders',
  USERS = 'users/',
  VERIFY_SIGN_UP = '/auth/verify-sign-up',
  REQUEST_CONFIRMATION_MAIL = '/auth/request-confirmation-email',
}
