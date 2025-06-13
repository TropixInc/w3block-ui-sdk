import { useMutation } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { W3blockAPI } from "../enums/W3blockAPI";
import { useAxios } from "./useAxios";
import { useCompanyConfig } from "./useCompanyConfig";


export const useIncreaseCurrencyAllowance = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [],
    ({
      currencyId,
      walletAddress,
      targetAmount,
    }: {
      currencyId: string;
      walletAddress: string;
      targetAmount: string;
    }) => {
      return axios.patch(
        PixwayAPIRoutes.INCREASE_CURRENCY_ALLOWANCE.replace(
          '{companyId}',
          companyId ?? ''
        ).replace('{currencyId}', currencyId),
        { walletAddress, targetAmount }
      );
    }
  );
};
