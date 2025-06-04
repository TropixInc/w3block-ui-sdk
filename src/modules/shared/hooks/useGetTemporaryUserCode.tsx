import { PixwayAPIRoutes } from "../enums/PixwayAPIRoutes";
import { W3blockAPI } from "../enums/W3blockAPI";
import { useAxios } from "./useAxios";
import { useCompanyConfig } from "./useCompanyConfig";
import { usePixwaySession } from "./usePixwaySession";
import { usePrivateQuery } from "./usePrivateQuery";


export interface TemporaryCodeInterface {
  code: string;
  expiresAt: Date;
}
export const UseGetTemporaryUserCode = () => {
  const axios = useAxios(W3blockAPI.ID);
  const { data } = usePixwaySession();
  const { companyId } = useCompanyConfig();
  return usePrivateQuery(
    [PixwayAPIRoutes.GET_TEMPORARY_CODE, data?.id, companyId],
    (): Promise<TemporaryCodeInterface> =>
      axios
        .post<TemporaryCodeInterface>(
          PixwayAPIRoutes.GET_TEMPORARY_CODE.replace(
            '{companyId}',
            companyId
          ).replace('{userId}', data?.id ?? '')
        )
        .then((res) => res.data),
    {
      enabled: companyId != null && data != null,
    }
  );
};
