import { useMutation } from "@tanstack/react-query";
import { PixwayAPIRoutes } from "../../modules/shared/enums/PixwayAPIRoutes";
import { W3blockAPI } from "../../modules/shared/enums/W3blockAPI";
import { useAxios } from "../../modules/shared/hooks/useAxios";
import { useCompanyConfig } from "../../modules/shared/hooks/useCompanyConfig";

interface Payload {
  email: string;
  editionId: string;
}

const useTransferTokenWithEmail = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.TRANSFER_TOKEN_EMAIL],
    (payload: Payload) =>
      axios.patch(
        PixwayAPIRoutes.TRANSFER_TOKEN_EMAIL.replace(
          '{companyId}',
          companyId ?? ''
        ).replace('{id}', payload.editionId),
        {
          email: payload.email,
        }
      )
  );
};

export default useTransferTokenWithEmail;
