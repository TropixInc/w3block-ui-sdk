import { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyId } from '../../../shared/hooks/useCompanyId';
import { useCountdown } from '../useCountdown';

interface GetLastTransferAPIResponse {
  sender: string;
  status: string;
  toAddress: string;
  txHash: string;
  chainId: number;
}
interface Tokens {
  id: string;
  number: string;
}

interface TokenList {
  [token: string]: {
    id: string;
    number: string;
    status: string;
    hash: string;
    chainId: number;
  };
}

export const useGetStatusOfTokenTransfers = (
  tokens: Array<Tokens>,
  startProcess: boolean
) => {
  const axios = useAxios(W3blockAPI.KEY);
  const companyId = useCompanyId();

  const [tokenList, setTokenList] = useState<TokenList>();
  const [successfulTransfers, setSuccessfulTransfers] = useState(false);
  const [counter, setCounter] = useCountdown();

  const { mutate } = useMutation(
    [PixwayAPIRoutes.TRANSFER_MULTIPLE_TOKENS, tokens],
    async (editionId: string) => {
      const response = await axios.get<GetLastTransferAPIResponse>(
        PixwayAPIRoutes.GET_LAST_TRASNFER.replace(
          '{companyId}',
          companyId ?? ''
        ).replace('{id}', editionId)
      );

      if (response.data && tokenList) {
        setTokenList({
          ...tokenList,
          [editionId]: {
            ...tokenList[editionId],
            status: response.data.status,
            hash: response.data.txHash,
            chainId: response.data.chainId,
          },
        });
      }

      return response;
    }
  );

  useEffect(() => {
    if (startProcess) {
      let list = {};
      tokens.forEach(async (token) => {
        list = {
          ...list,
          [token.id]: {
            id: token.id,
            number: token.number,
            status: '',
            hash: '',
            chainId: 0,
          },
        };
      });
      setTokenList(list);
      setCounter(10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startProcess]);

  useEffect(() => {
    if (tokenList && startProcess) {
      if (
        Object.keys(tokenList).every(
          (token) => tokenList[token].status === 'success'
        )
      ) {
        setSuccessfulTransfers(true);
      } else if (counter === 0) {
        Object.keys(tokenList)
          .filter((token) => tokenList[token].status !== 'success')
          .forEach((token) => {
            mutate(token);
          });
        setCounter(10);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  return useMemo(() => {
    return {
      tokenList,
      successfulTransfers,
    };
  }, [tokenList, successfulTransfers]);
};
