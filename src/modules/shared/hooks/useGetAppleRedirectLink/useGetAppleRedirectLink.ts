// import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
// import { removeDuplicateSlahes } from '../../utils/removeDuplicateSlahes';
// import { useCompanyConfig } from '../useCompanyConfig';
// import { usePixwayAPIURL } from '../usePixwayAPIURL/usePixwayAPIURL';

export const useGetAppleRedirectLink = () => {
  // const apisUrl = usePixwayAPIURL();
  // const { companyId } = useCompanyConfig();
  // const url = removeDuplicateSlahes(
  //   apisUrl.w3blockIdAPIUrl +
  //     PixwayAPIRoutes.GET_APPLE_REDIRECT.replace('{companyId}', companyId)
  // );
  const url =
    'https://appleid.apple.com/auth/authorize?client_id=ai.zuca.apple.login&response_type=code&response_mode=query&redirect_uri=https%3A%2F%2Ffoodcoin.store.stg.w3block.io%2Fauth%2FsignIn%2Fapple';
  return url;
};
