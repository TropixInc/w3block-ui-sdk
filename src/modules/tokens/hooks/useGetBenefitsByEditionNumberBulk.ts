import { useEffect, useMemo, useRef, useState } from 'react';
import { AxiosResponse } from 'axios';

import { getBenefitsByEditionNumber } from '../../pass/hooks/useGetBenefitsByEditionNumber';
import { BenefitsByEditionNumberDTO } from '../../pass/interfaces/PassBenefitDTO';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { Token } from '../interfaces/Token';

type BenefitsItem = {
  id?: Token['id'] | number;
  collectionData?: Partial<Token['collectionData']>;
  editionNumber?: Token['editionNumber'] | number;
};

interface BenefitsByItemResult {
  item: BenefitsItem;
  benefits: BenefitsByEditionNumberDTO[];
  response: AxiosResponse<BenefitsByEditionNumberDTO[]>;
}

interface HookState {
  data: BenefitsByItemResult[];
  isLoading: boolean;
  error: unknown | null;
}

const useGetBenefitsByEditionNumberBulk = (
  items: BenefitsItem[] = []
): HookState => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();
  const [state, setState] = useState<HookState>({
    data: [],
    isLoading: false,
    error: null,
  });

  const lastSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const validItems = items.filter(
      (item) => item?.collectionData?.id && item?.id
    );

    const signature = [
      tenantId ?? '',
      ...validItems.map(
        (item) => `${item.collectionData?.id ?? ''}:${item.id ?? ''}`
      ),
    ].join('|');

    if (signature === lastSignatureRef.current) {
      return () => {
        isMounted = false;
      };
    }

    lastSignatureRef.current = signature;

    if (!validItems.length) {
      setState((previous) =>
        previous.data.length || previous.isLoading || previous.error
          ? { data: [], isLoading: false, error: null }
          : previous
      );
      return () => {
        isMounted = false;
      };
    }

    setState({ data: [], isLoading: true, error: null });

    const tasks = validItems.map(async (item) => {
      const editionNumber = Number(item.editionNumber);

      if (Number.isNaN(editionNumber)) {
        return {
          item,
          status: 'invalid' as const,
        };
      }

      try {
        const response = await getBenefitsByEditionNumber({
          axios,
          tenantId,
          tokenPassId: item.collectionData!.id ?? '',
          editionNumber,
        });

        const { data: benefits } = response;

        const hasAvailableBenefit = Array.isArray(benefits)
          ? benefits.some((benefit) => {
              const available = benefit?.useAvailable;
              return available == null || available > 0;
            })
          : false;

        const status =
          response.status === 200 && hasAvailableBenefit
            ? 'useGetBenefitsByEditionNumber'
            : 'invalid';

        return {
          item,
          response,
          status,
        };
      } catch (error) {
        return {
          item,
          status: 'error' as const,
          error,
        };
      }
    });

    Promise.all(tasks)
      .then((results) => {
        if (!isMounted) return;

        console.log(results, "results")

        const filtered = results.filter(
          (
            result
          ): result is {
            item: BenefitsItem;
            response: AxiosResponse<BenefitsByEditionNumberDTO[]>;
            status: 'useGetBenefitsByEditionNumber';
          } =>
            result.status === 'useGetBenefitsByEditionNumber' &&
            'response' in result
        );

        setState({
          data: filtered.map(({ item, response }) => ({
            item,
            benefits: response.data ?? [],
            response,
          })),
          isLoading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (!isMounted) return;

        setState({
          data: [],
          isLoading: false,
          error,
        });
      });

    return () => {
      isMounted = false;
    };
  }, [axios, tenantId, items]);

  useEffect(() => {
    lastSignatureRef.current = null;
  }, [axios]);

  const data = useMemo(() => state.data, [state.data]);

  return {
    data,
    isLoading: state.isLoading,
    error: state.error,
  };
};

export default useGetBenefitsByEditionNumberBulk;
