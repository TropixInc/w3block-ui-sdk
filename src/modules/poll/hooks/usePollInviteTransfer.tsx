import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

interface PollInviteUserApi {
  pollId: string;
  name?: string;
  email: string;
  slug: string;
}

export const usePollInviteTransfer = () => {
  const axios = useAxios(W3blockAPI.POLL);
  const { companyId } = useCompanyConfig();
  return useMutation((pollInviteUser: PollInviteUserApi) =>
    axios.post(
      PixwayAPIRoutes.INVITE_USER_AFTER_POLL.replace('{companyId}', companyId),
      pollInviteUser
    )
  );
};
