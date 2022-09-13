import { useMemo } from 'react';
import { useMutation } from 'react-query';

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

export const useCheckout = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);

  const getOrderPreview = useMutation(
    async ({ productIds, currencyId, companyId }: GetOrderPreviewPayload) => {
      const products: ProductToSendPayload[] = productIds.map(
        (pId: string): ProductToSendPayload => {
          return {
            productId: pId,
          };
        }
      );
      const preview = await axios.post<
        OrderPreviewResponse,
        AxiosResponse<OrderPreviewResponse, OrderPreviewPayload>,
        OrderPreviewPayload
      >(PixwayAPIRoutes.ORDER_PREVIEW.replace('{companyId}', companyId), {
        orderProducts: products,
        currencyId,
      });
      return preview.data;
    }
  );

  const createOrder = useMutation(
    ({ companyId, createOrder }: CreateOrderPayload) => {
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
    }
  );

  // const createOrder = ({
  //   companyId,
  //   createOrder,
  // }: CreateOrderPayload): Promise<CreateOrderResponse> => {
  //   return axios
  //     .post<
  //       CreateOrderResponse,
  //       AxiosResponse<CreateOrderResponse>,
  //       CreateOrder
  //     >(
  //       PixwayAPIRoutes.CREATE_ORDER.replace('{companyId}', companyId),
  //       createOrder
  //     )
  //     .then((res) => {
  //       return res.data;
  //     });
  // };

  return useMemo(() => {
    return { getOrderPreview, createOrder };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
