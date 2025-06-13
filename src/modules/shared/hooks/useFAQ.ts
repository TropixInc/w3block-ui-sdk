
import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { W3blockAPI } from '../enums/W3blockAPI';
import { useAxios } from './useAxios';
import { useCompanyConfig } from './useCompanyConfig';
import { usePrivateQuery } from './usePrivateQuery';


interface Locales {
  'pt-br': string;
  'en-us': string;
}

interface ItemsFAQ {
  question: Locales;
  answer: Locales;
  externalUrl: string;
  faqContextItems: Record<string, unknown>;
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface MetaFAQ {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

interface LinksFAQ {
  first: string;
  prev: string;
  next: string;
  last: string;
}

interface GetFAQResponse {
  items: ItemsFAQ[];
  meta: MetaFAQ;
  links: LinksFAQ;
}

export interface getFAQProps {
  page: number;
  limit: number;
  name: string;
}

export const useFAQ = (page: number, limit: number, name: string) => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const { companyId } = useCompanyConfig();

  return usePrivateQuery(
    [
      PixwayAPIRoutes.GET_FAQ.replace('{companyId}', companyId),
      companyId,
      name,
      limit,
      page,
    ],
    () =>
      axios.get<GetFAQResponse>(
        PixwayAPIRoutes.GET_FAQ.replace('{companyId}', companyId),
        {
          params: { companyId, name, limit, page },
        }
      )
  );
};
