import { ReactChild } from 'react';

// import useAxios from '../useAxios/useAxios';
import { usePrivateQuery } from '../usePrivateQuery';

interface FAQDTO {
  items: {
    question: ReactChild;
    answer: ReactChild;
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useFAQ = (identifier: string) => {
  // const axios = useAxios();
  const getFAQ = async () => {
    const mock = await {
      items: [
        {
          question:
            'Aliquam ullamcorper velit eget metus facilisis, eu porttitor dolor dignissim',
          answer:
            'Proin tempus massa ac massa consectetur, eu efficitur velit lacinia',
        },
        {
          question:
            'Aliquam ullamcorper velit eget metus facilisis, eu porttitor dolor dignissim',
          answer:
            'Proin tempus massa ac massa consectetur, eu efficitur velit lacinia',
        },
        {
          question:
            'Aliquam ullamcorper velit eget metus facilisis, eu porttitor dolor dignissim',
          answer:
            'Proin tempus massa ac massa consectetur, eu efficitur velit lacinia',
        },
      ],
    };
    return mock;
  };
  const res = usePrivateQuery<FAQDTO>([], getFAQ);
  return res.data;
};
