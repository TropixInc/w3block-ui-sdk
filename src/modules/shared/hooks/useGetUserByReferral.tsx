import { useQuery } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { W3blockAPI } from "../enums/W3blockAPI";
import { useAxios } from "../hooks/useAxios";
import { useCompanyConfig } from "../hooks/useCompanyConfig";


export const useGetUserByReferral = ({
  referralCode,
  enabled = true,
}: {
  referralCode?: string;
  enabled?: boolean;
}) => {
  const axios = useAxios(W3blockAPI.ID);
  const { companyId } = useCompanyConfig();

  const getUserByReferral = useQuery(
    [PixwayAPIRoutes.GET_USER_BY_REFERRAL, referralCode],
    () =>
      axios
        .get(
          PixwayAPIRoutes.GET_USER_BY_REFERRAL.replace(
            '{companyId}',
            companyId
          ).replace('{referralCode}', referralCode ?? '')
        )
        .then((res) => res.data),
    {
      enabled: typeof referralCode === 'string' && !!companyId && enabled,
      retry: 2,
      refetchOnWindowFocus: false,
    }
  );
  return getUserByReferral;
};
