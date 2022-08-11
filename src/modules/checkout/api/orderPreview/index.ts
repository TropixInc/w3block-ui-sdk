import { AxiosResponse } from 'axios';

import { getPublicAPI } from '../../../shared/config/api';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { OrderPreviewResponse } from './interface';

interface GetOrderPreviewPayload {
  productIds: string[];
  currencyId: string;
  baseUrl: string;
  companyId: string;
}

interface ProductToSendPayload {
  productId: string;
  productTokenId?: string;
}

interface OrderPreviewPayload {
  orderProducts: ProductToSendPayload[];
  currencyId: string;
}

export const getOrderPreview = ({
  productIds,
  currencyId,
  companyId,
  baseUrl,
}: GetOrderPreviewPayload): Promise<OrderPreviewResponse> => {
  const products: ProductToSendPayload[] = productIds.map(
    (pId: string): ProductToSendPayload => {
      return {
        productId: pId,
      };
    }
  );
  return getPublicAPI(baseUrl)
    .post<
      OrderPreviewResponse,
      AxiosResponse<OrderPreviewResponse, OrderPreviewPayload>,
      OrderPreviewPayload
    >(PixwayAPIRoutes.ORDER_PREVIEW.replace('{companyId}', companyId), {
      orderProducts: products,
      currencyId,
    })
    .then((res) => res.data);
};
