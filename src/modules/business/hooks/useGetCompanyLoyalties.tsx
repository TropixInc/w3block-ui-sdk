import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../shared/hooks/useAxios";
import { W3blockAPI } from "../../shared/enums/W3blockAPI";
import { useProfileWithKYC } from "../../shared/hooks/useProfileWithKYC";
import { useCompanyConfig } from "../../shared/hooks/useCompanyConfig";
import { PixwayAPIRoutes } from "../../shared/enums/PixwayAPIRoutes";
import { LoyaltyInterface } from "../../shared/interfaces/ILoyalty";


export const useGetCompanyLoyalties = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { profile } = useProfileWithKYC();
  const { companyId } = useCompanyConfig();

  return useQuery(
    [PixwayAPIRoutes.GET_COMPANY_LOYALTIES, companyId, profile?.id],
    (): Promise<LoyaltyInterface[]> =>
      axios
        .get(
          PixwayAPIRoutes.GET_COMPANY_LOYALTIES.replace(
            '{companyId}',
            companyId
          ) + '?limit=49'
        )
        .then((res: { data: { items: any; }; }) => res.data.items),
    {
      enabled:
        profile?.id != null &&
        companyId != null &&
        (profile.roles.includes('superAdmin') ||
          profile.roles.includes('admin') ||
          profile.roles.includes('loyaltyOperator')),
    }
  );
};
