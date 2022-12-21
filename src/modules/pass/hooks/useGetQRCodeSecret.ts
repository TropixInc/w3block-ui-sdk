import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';

interface SecretProps {
  benefitId: string;
  editionNumber: string;
}

interface SecretResponse {
  secret: string;
}

const useGetQRCodeSecret = ({ benefitId, editionNumber }: SecretProps) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery([PixwayAPIRoutes.TOKEN_PASS], () =>
    axios.get<SecretResponse>(
      PixwayAPIRoutes.PASS_SECRET.replace('{tenantId}', tenantId ?? '')
        .replace('{id}', benefitId)
        .replace('{editionNumber}', editionNumber)
    )
  );
};

export default useGetQRCodeSecret;
