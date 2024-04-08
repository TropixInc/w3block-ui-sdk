import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
import { usePixwaySession } from '../usePixwaySession';
import { usePrivateQuery } from '../usePrivateQuery';

interface Response {
  details: {
    hasAccess: boolean;
    userId: string;
    whitelistId: string;
  }[];
  hasAccess: boolean;
}

export const useCheckWhitelistByUser = (
  whitelists: Array<string>,
  enabled?: boolean
) => {
  const axios = useAxios(W3blockAPI.ID);
  const { data } = usePixwaySession();
  const { companyId } = useCompanyConfig();
  const whitelistsToUse = whitelists.join('&whitelistsIds=');
  return usePrivateQuery<Response>(
    [PixwayAPIRoutes.CHECK_WHITELIST_BY_USER, companyId, data?.id],
    () =>
      axios
        .get(
          PixwayAPIRoutes.CHECK_WHITELIST_BY_USER.replace(
            '{companyId}',
            companyId
          ) + `?userId=${data?.id ?? ''}&whitelistsIds=${whitelistsToUse}`
        )
        .then((res) => res.data),
    {
      enabled: companyId != null && data != null && enabled,
    }
  );
};
