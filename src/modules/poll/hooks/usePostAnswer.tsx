

import { useMutation } from '@tanstack/react-query';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { PostAnswerResponseInterface } from '../interfaces/PollResponseInterface';

interface PostAnswerApi {
  pollId: string;
  questionId: string;
  email: string;
  description: string;
  slug?: string;
}

export const usePostAnswer = () => {
  const axios = useAxios(W3blockAPI.POLL);
  const { companyId } = useCompanyConfig();
  return useMutation((answer: PostAnswerApi) => {
    return axios.post<PostAnswerResponseInterface>(
      PixwayAPIRoutes.POST_POLL_ANSWER.replace('{companyId}', companyId),
      answer
    );
  });
};
