import { useMutation } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { W3blockAPI } from "../enums/W3blockAPI";
import { useAxios } from "./useAxios";
import { useCompanyConfig } from "./useCompanyConfig";


interface Params {
  productId: string;
  config?: {
    tokenId?: string;
    prices?: { currencyId: string; amount: string }[];
    amount?: string;
    unlimited?: boolean;
  };
}

export const usePostProductResale = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  const _postProductResale = async ({ productId, config }: Params) => {
    const res = await axios.post<Response>(
      PixwayAPIRoutes.POST_PRODUCT_RESALE.replace(
        '{companyId}',
        companyId
      ).replace('{productId}', productId),
      { ...config }
    );
    return res.data;
  };

  return useMutation(_postProductResale);
};
