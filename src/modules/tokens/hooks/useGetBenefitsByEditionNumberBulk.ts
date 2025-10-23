import { useEffect, useMemo, useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getBenefitsByEditionNumber } from '../../pass/hooks/useGetBenefitsByEditionNumber';
import { BenefitsByEditionNumberDTO } from '../../pass/interfaces/PassBenefitDTO';
import { useAxios } from '../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { Token } from '../interfaces/Token';

const MAX_CONCURRENCY = 8;
const MAX_ITEMS = 200;
const PAGE_SIZE = 50;
const MAX_PAGES = Math.ceil(MAX_ITEMS / PAGE_SIZE);

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

const fetchBenefitsPaginated = async (
  axios: ReturnType<typeof useAxios>,
  tenantId: string,
  tokenPassId: string,
  editionNumber: number
): Promise<{ benefits: BenefitsByEditionNumberDTO[]; response: AxiosResponse }> => {
  const allBenefits: BenefitsByEditionNumberDTO[] = [];
  let lastResponse: AxiosResponse | null = null;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const response = await getBenefitsByEditionNumber({
      axios,
      tenantId,
      tokenPassId,
      editionNumber,
      page,
      limit: PAGE_SIZE,
    });
    const data = response.data ?? [];
    allBenefits.push(...data);
    lastResponse = response;

    if (data.length < PAGE_SIZE || allBenefits.length >= MAX_ITEMS) break;
  }

  return { benefits: allBenefits.slice(0, MAX_ITEMS), response: lastResponse! };
};

async function runConcurrent<T>(
  items: T[],
  handler: (item: T) => Promise<void>,
  concurrency = MAX_CONCURRENCY,
  abortRef: React.MutableRefObject<boolean>
) {
  let cursor = 0;
  const runners = new Array(concurrency).fill(null).map(async () => {
    while (!abortRef.current && cursor < items.length) {
      const index = cursor++;
      await handler(items[index]);
    }
  });
  await Promise.all(runners);
}

export const useGetBenefitsByEditionNumberBulk = (items: BenefitsItem[] = []): HookState => {
  const axios = useAxios(W3blockAPI.PASS);
  const { companyId: tenantId } = useCompanyConfig();

  const [state, setState] = useState<HookState>({ data: [], isLoading: false, error: null });
  const abortRef = useRef(false);

  const validItems = useMemo(
    () => items.filter((i) => i?.collectionData?.id && i?.editionNumber && !Number.isNaN(Number(i.editionNumber))),
    [items]
  );

  const serializedKey = useMemo(
    () =>
      validItems
        .map((i) => `${i.collectionData?.id}:${i.editionNumber}`)
        .sort()
        .join('|'),
    [validItems]
  );

  useEffect(() => {
    if (!validItems.length) {
      setState({ data: [], isLoading: false, error: null });
      return;
    }

    abortRef.current = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const run = async () => {
      const results: BenefitsByItemResult[] = [];

      const processItem = async (item: BenefitsItem) => {
        if (abortRef.current) return;

        try {
          const editionNumber = Number(item.editionNumber);
          const { benefits, response } = await fetchBenefitsPaginated(
            axios,
            tenantId,
            String(item.collectionData!.id),
            editionNumber
          );

          // filtro instantâneo de benefícios ativos
          if (benefits.some((b) => b?.useAvailable == null || b?.useAvailable > 0)) {
            results.push({ item, benefits, response });
          }
        } catch (err) {
          console.error('Erro ao buscar benefícios:', err);
          throw err;
        }
      };

      try {
        await runConcurrent(validItems, processItem, MAX_CONCURRENCY, abortRef);
        if (!abortRef.current) {
          setState({ data: results, isLoading: false, error: null });
        }
      } catch (error) {
        if (!abortRef.current) {
          setState({ data: [], isLoading: false, error });
        }
      }
    };

    run();

    return () => {
      abortRef.current = true;
    };
  }, [serializedKey, axios, tenantId]);

  return state;
};
