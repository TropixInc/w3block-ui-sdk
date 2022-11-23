import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';
import { PassBenefitDTO } from '../interfaces/PassBenefitDTO';

interface Response {
  items: PassBenefitDTO[];
}

const useGetPassBenefits = () => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery([PixwayAPIRoutes.PASS_BENEFIT], () =>
    axios.get<Response>(
      PixwayAPIRoutes.PASS_BENEFIT.replace('{tenantId}', tenantId ?? '')
    )
  );
};

export default useGetPassBenefits;
