import { useCompanyConfig } from "../../shared/hooks/useCompanyConfig";
import { W3blockAPI } from "../../shared/enums/W3blockAPI";
import { useAxios } from "../../shared/hooks/useAxios";
import { usePrivateQuery } from "../../shared/hooks/usePrivateQuery";
import { PixwayAPIRoutes } from "../../shared/enums/PixwayAPIRoutes";

export const useGetUserNotifications = () => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.GET_NOTIFICATIONS, companyId],
    () =>
      axios
        .get(
          PixwayAPIRoutes.GET_NOTIFICATIONS.replace(
            '{tenantId}',
            companyId
          )
        )
        .then((res) => res.data),
    {
      enabled: companyId != null,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      keepPreviousData: false,
    }
  );
};