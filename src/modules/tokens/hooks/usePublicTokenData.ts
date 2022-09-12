import { useQuery } from 'react-query';

import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import useRouter from '../../shared/hooks/useRouter';
import { getPublicPageData } from '../api/getPublicPageData';
import { getPublicTokenDataQueryKey } from '../utils/getPublicTokenDataQueryKey';

const usePublicTokenData = () => {
  const router = useRouter();
  const rfid = (router.query.rfid as string) ?? '';
  const contractAddress = (router.query.contractAddress as string) ?? '';
  const chainId = (router.query.chainId as string) ?? '';
  const tokenId = (router.query.tokenId as string) ?? '';

  const axios = useAxios(W3blockAPI.KEY);

  return useQuery(
    getPublicTokenDataQueryKey({
      contractAddress,
      rfid,
      tokenId,
    }),
    () =>
      getPublicPageData({
        RFID: rfid,
        contractAddress,
        chainId,
        tokenId,
        axios,
      }),
    { staleTime: Infinity }
  );
};

export default usePublicTokenData;
