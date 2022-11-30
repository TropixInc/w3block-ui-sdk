import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';

const useGetPass = () => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return usePrivateQuery([PixwayAPIRoutes.TOKEN_PASS], () =>
    axios.get<any>(
      PixwayAPIRoutes.TOKEN_PASS.replace('{tenantId}', tenantId ?? '')
    )
  );
};

export default useGetPass;
