import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { handleNetworkException } from '../../shared/utils/handleNetworkException';
import { BenefitsByEditionNumberDTO } from '../interfaces/PassBenefitDTO';

interface Props {
  tokenPassId: string;
  editionNumber: number;
}

const useGetBenefitsByEditionNumber = ({
  tokenPassId,
  editionNumber,
}: Props) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery(
    [PixwayAPIRoutes.PASS_BENEFITS_BY_EDITION, tokenPassId, editionNumber],
    async () => {
      try {
        const response = await axios.get<BenefitsByEditionNumberDTO[]>(
          PixwayAPIRoutes.PASS_BENEFITS_BY_EDITION.replace(
            '{tenantId}',
            tenantId ?? ''
          )
            .replace('{id}', tokenPassId)
            .replace('{editionNumber}', editionNumber.toString())
        );

        return response;
      } catch (error) {
        console.error(
          'Erro ao buscar benefícios pela edição do token pass:',
          error
        );
        throw handleNetworkException(error);
      }
    },
    {
      enabled:
        tokenPassId != null && editionNumber != null && tokenPassId !== '',
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      initialData: undefined
    }
  );
};
export default useGetBenefitsByEditionNumber;
