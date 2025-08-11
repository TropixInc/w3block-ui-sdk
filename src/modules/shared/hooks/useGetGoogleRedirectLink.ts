import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { removeDuplicateSlahes } from '../utils/removeDuplicateSlahes';
import { useCompanyConfig } from './useCompanyConfig';
import { usePixwayAPIURL } from './usePixwayAPIURL';

export const useGetGoogleRedirectLink = () => {
  const apisUrl = usePixwayAPIURL();
  const { companyId } = useCompanyConfig();
  const url = removeDuplicateSlahes(
    apisUrl.w3blockIdAPIUrl +
      PixwayAPIRoutes.GET_GOOGLE_URL.replace('{companyId}', companyId)
  );
  return url;
};
