import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { usePrivateQuery } from '../../shared/hooks/usePrivateQuery';

export interface TokenCategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  image: string;
}

type GetTokenCategoriesResponse = Array<TokenCategory>;

const useTokenCategories = () => {
  const axios = useAxios(W3blockAPI.KEY);
  return usePrivateQuery([PixwayAPIRoutes.CATEGORIES], () =>
    axios.get<GetTokenCategoriesResponse>(PixwayAPIRoutes.CATEGORIES)
  );
};

export default useTokenCategories;
