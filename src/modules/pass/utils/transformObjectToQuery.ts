export interface TransformObjectToQueryProps {
  page?: number;
  limit?: number;
  tokenPassId?: string;
  benefitId?: string;
  tokenId?: string;
  contractAddress?: string;
  chainId?: string;
}

export const transformObjectToQuery = (object: TransformObjectToQueryProps) => {
  const mappedObject = Object.entries(object);

  const mountedQuery = mappedObject
    .map((item, index) => {
      if (index == 0) {
        return `?${item[0]}=${item[1]}`;
      } else {
        return `&${item[0]}=${item[1]}`;
      }
    })
    .join('');

  return mountedQuery;
};
