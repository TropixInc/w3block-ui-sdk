/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

interface Payload {
  body: {
    userId: string;
    editionNumber: string;
  };
  benefitId: string;
}

const usePostSelfUseBenefit = ({ body, benefitId }: Payload) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  return useMutation([PixwayAPIRoutes.PASS_BENEFIT_SELF_USE], () =>
    axios.post<any>(
      PixwayAPIRoutes.PASS_BENEFIT_SELF_USE.replace(
        '{tenantId}',
        tenantId ?? ''
      ).replace('{id}', benefitId),
      body
    )
  );
};

export default usePostSelfUseBenefit;
