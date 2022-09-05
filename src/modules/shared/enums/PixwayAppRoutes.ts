export enum PixwayAppRoutes {
  HOME = '/',
  SIGN_UP = '/auth/signUp',
  SIGN_IN = '/auth/signIn',
  REQUEST_PASSWORD_CHANGE = '/auth/changePassword/request',
  RESET_PASSWORD = '/auth/changePassword/newPassword',
  TOKEN_DETAILS = '/tokens/{contractAddress}/{chainId}/{tokenId}',
  TOKENS = '/tokens',
}
