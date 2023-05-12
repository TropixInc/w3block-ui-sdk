import { W3blockAPI } from '../../enums/W3blockAPI';

export const useGetApiUrl = (type: W3blockAPI) => {
  const apiBaseURLMap = new Map([
    [W3blockAPI.ID, process.env.NEXT_PUBLIC_PIXWAY_ID_API_URL ?? ''],
    [W3blockAPI.KEY, process.env.NEXT_PUBLIC_PIXWAY_KEY_API_URL ?? ''],
    [W3blockAPI.COMMERCE, process.env.NEXT_PUBLIC_COMMERCE_API_URL ?? ''],
  ]);
  const baseUrl = apiBaseURLMap.get(type) ?? '';

  return baseUrl;
};
