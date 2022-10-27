import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { PollResponseInterface } from '../interfaces/PollResponseInterface';

export const usePoll = (pollId: string) => {
  const { companyId } = useCompanyConfig();
  const axios = useAxios(W3blockAPI.POLL);
  return useQuery(
    PixwayAPIRoutes.GET_POLL_BY_ID.replace('{companyId}', companyId).replace(
      '{pollId}',
      pollId
    ),
    async (): Promise<PollResponseInterface> => {
      const poll = await axios.get(
        PixwayAPIRoutes.GET_POLL_BY_ID.replace(
          '{companyId}',
          companyId
        ).replace('{pollId}', pollId)
      );
      return poll.data;
    },
    { refetchOnWindowFocus: false }
  );
};
