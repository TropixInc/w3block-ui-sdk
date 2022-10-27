import { useMutation } from 'react-query';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';

interface PostAnswerApi {
  pollId: string;
  questionId: string;
  email: string;
  description: string;
}

export const usePostAnswer = () => {
  const axios = useAxios(W3blockAPI.POLL);
  const { companyId } = useCompanyConfig();
  return useMutation(async (answer: PostAnswerApi) => {
    try {
      const response = await axios.post(
        PixwayAPIRoutes.POST_POLL_ANSWER.replace('{companyId}', companyId),
        answer
      );
      return response.data;
    } catch (e) {
      return e;
    }
  });
};
