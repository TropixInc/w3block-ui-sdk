import { PixwayAPIRoutes } from "../../modules/shared/enums/PixwayAPIRoutes";
import { W3blockAPI } from "../../modules/shared/enums/W3blockAPI";
import { useAxios } from "../../modules/shared/hooks/useAxios";
import { useCompanyConfig } from "../../modules/shared/hooks/useCompanyConfig";
import { usePrivateQuery } from "../../modules/shared/hooks/usePrivateQuery";

export interface GetLastTransferAPIResponse {
  sender: string;
  status: string;
  toAddress: string;
  txHash: string;
  chainId: number;
}

export const useGetTransferToken = (editionId: string, enabled: boolean) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery(
    [
      PixwayAPIRoutes.GET_LAST_TRASNFER.replace(
        '{companyId}',
        companyId
      ).replace('{id}', editionId),
      companyId,
      editionId,
    ],
    () =>
      axios.get<GetLastTransferAPIResponse>(
        PixwayAPIRoutes.GET_LAST_TRASNFER.replace(
          '{companyId}',
          companyId
        ).replace('{id}', editionId)
      ),
    {
      enabled: enabled,
    }
  );
};
