import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../enums/W3blockAPI';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';
import { usePixwaySession } from '../usePixwaySession';
import { usePrivateQuery } from '../usePrivateQuery';

export const useGetDocuments = () => {
  const axios = useAxios(W3blockAPI.ID);
  const { data } = usePixwaySession();
  const { companyId } = useCompanyConfig();
  return usePrivateQuery(
    [PixwayAPIRoutes.GET_DOCUMENTS_BY_USER, companyId, data?.id],
    () =>
      axios
        .get(
          PixwayAPIRoutes.GET_DOCUMENTS_BY_USER.replace(
            '{tenantId}',
            companyId
          ).replace('{userId}', data?.id ?? '') + '?type=multiface_selfie'
        )
        .then((res) => res.data),
    {
      enabled: companyId != null && data != null,
    }
  );
};
