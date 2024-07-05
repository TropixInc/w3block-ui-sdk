import { useMutation } from 'react-query';

import { W3blockAPI } from '../../enums';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { useAxios } from '../useAxios';
import { useCompanyConfig } from '../useCompanyConfig';

const useUploadAssetsCommerce = () => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();

  return useMutation(
    [PixwayAPIRoutes.UPLOAD_ASSETS],
    (params: { type: string; target: string }) =>
      axios.post(
        PixwayAPIRoutes.UPLOAD_ASSETS.replace('{companyId}', companyId),
        { ...params }
      )
  );
};

export default useUploadAssetsCommerce;
