/* eslint-disable @typescript-eslint/no-explicit-any */


import { useQuery } from '@tanstack/react-query';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { PassBenefitDTO } from '../interfaces/PassBenefitDTO';

interface Response {
  items: {
    id: string;
    editionNumber: number;
    usedAt: string;
    userId: string;
    tenantId: string;
    tokenPassBenefit: PassBenefitDTO;
    tokenPassBenefitId: string;
    uses: 0;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    user: {
      name: string;
      email: string;
      cpf: string;
      phone: string;
    };
  }[];
  meta: {
    itemCount: 1;
    totalItems: 1;
    itemsPerPage: 1;
    totalPages: 1;
    currentPage: 1;
  };
}

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  orderBy?: string;
  benefitId?: string;
  editionNumber?: number;
}

interface Params {
  query?: QueryParams;
  enabled?: boolean;
}

export const useGetBenefitUses = ({ query, enabled = true }: Params) => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId } = useCompanyConfig();
  const defaultQuery: QueryParams = {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    orderBy: 'DESC',
    ...query,
  };
  const queryString =
    '?' +
    new URLSearchParams(defaultQuery as Record<string, string>).toString();

  return useQuery(
    [PixwayAPIRoutes.GET_BENEFIT_USES, companyId, queryString],
    () =>
      axios
        .get<Response>(
          PixwayAPIRoutes.GET_BENEFIT_USES.replace('{companyId}', companyId) +
            queryString
        )
        .then((res) => res.data),
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 0,
    }
  );
};
