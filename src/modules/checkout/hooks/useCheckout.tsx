import { AxiosResponse } from 'axios';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import {
  CreateOrder,
  CreateOrderPayload,
  CreateOrderResponse,
  OrderPreviewResponse,
} from '../interface/interface';

interface GetOrderPreviewPayload {
  productIds: string[];
  currencyId: string;
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

interface UseOrderPreviewReturnInterface {
  getOrderPreview: (
    payload: GetOrderPreviewPayload
  ) => Promise<OrderPreviewResponse>;
  createOrder: (payload: CreateOrderPayload) => Promise<CreateOrderResponse>;
}

export const useCheckout = (): UseOrderPreviewReturnInterface => {
  const axios = useAxios(W3blockAPI.COMMERCE);

  const getOrderPreview = ({
    productIds,
    currencyId,
    companyId,
  }: GetOrderPreviewPayload) => {
    const products: ProductToSendPayload[] = productIds.map(
      (pId: string): ProductToSendPayload => {
        return {
          productId: pId,
        };
      }
    );
    return axios
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

  const createOrder = ({
    companyId,
    createOrder,
  }: CreateOrderPayload): Promise<CreateOrderResponse> => {
    return axios
      .post<
        CreateOrderResponse,
        AxiosResponse<CreateOrderResponse>,
        CreateOrder
      >(
        PixwayAPIRoutes.CREATE_ORDER.replace('{companyId}', companyId),
        createOrder
      )
      .then((res) => {
        return res.data;
      });
  };

  return { getOrderPreview, createOrder };
};
