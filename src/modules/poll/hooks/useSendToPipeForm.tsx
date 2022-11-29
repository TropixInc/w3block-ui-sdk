import { useMutation } from 'react-query';

import axios from 'axios';

interface sendToPipeFormInterface {
  pollId: string;
  questionId: string;
  email: string;
  description: string;
  slug?: string;
}

const PIPEFORM_URL =
  'https://e0bc8366843b634ac24a2e52ad6ec51c.m.pipedream.net/';

export const useSendToPipeForm = () => {
  return useMutation(
    [PIPEFORM_URL],
    (data: sendToPipeFormInterface) => {
      return axios.post(PIPEFORM_URL, data);
    },
    { retry: 1 }
  );
};
