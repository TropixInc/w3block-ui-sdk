import { useMemo } from 'react';
import { useMutation } from 'react-query';

import { AxiosResponse } from 'axios';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';
import { useUtms } from '../../shared/hooks/useUtms/useUtms';
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
  acceptIncompleteCart?: boolean;
}

export const useCheckout = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const utms = useUtms();
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
        acceptIncompleteCart: true,
      });
      return preview.data;
    }
  );

  const createOrder = useMutation(
    ({
      companyId,
      createOrder,
    }: CreateOrderPayload): Promise<CreateOrderResponse> => {
      const cOrder = createOrder;
      const ut = utms;
      if (utms.expires && utms?.expires > new Date().getTime()) {
        delete ut.expires;
        cOrder.utmParams = ut;
      }
      return axios
        .post<
          CreateOrderResponse,
          AxiosResponse<CreateOrderResponse>,
          CreateOrder
        >(
          PixwayAPIRoutes.CREATE_ORDER.replace('{companyId}', companyId),
          cOrder
        )
        .then((res): CreateOrderResponse => {
          return res.data as CreateOrderResponse;
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
