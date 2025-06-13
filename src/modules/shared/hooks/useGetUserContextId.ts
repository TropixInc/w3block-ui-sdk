import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { W3blockAPI } from "../enums/W3blockAPI";
import { useAxios } from "./useAxios";
import { useCompanyConfig } from "./useCompanyConfig";
import { usePrivateQuery } from "./usePrivateQuery";


interface Params {
  userId: string;
  userContextId: string;
}

export const useGetUserContextId = ({ userId, userContextId }: Params) => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();
  return usePrivateQuery(
    [PixwayAPIRoutes.GET_USER_CONTEXT_ID, companyId, userContextId, userId],
    () =>
      axios.get(
        PixwayAPIRoutes.GET_USER_CONTEXT_ID.replace('{companyId}', companyId)
          .replace('{userId}', userId)
          .replace('{userContextId}', userContextId)
      ),
    {
      enabled: !!userContextId && !!userId,
      retry: false,
    }
  );
};
