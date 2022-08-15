import { AxiosResponse } from 'axios';

import { getPublicAPI } from '../../../shared/config/api';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { CreateOrder, CreateOrderResponse } from './interface';

export const createOrderApi = (
  baseUrl: string,
  token: string,
  companyId: string,
  createOrder: CreateOrder
) => {
  return getPublicAPI(baseUrl)
    .post<CreateOrderResponse, AxiosResponse<CreateOrderResponse>, CreateOrder>(
      PixwayAPIRoutes.CREATE_ORDER.replace('{companyId}', companyId),
      createOrder,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e);
    });
};
