import { useMemo } from 'react';
import { useMutation } from 'react-query';

import { AxiosError, AxiosResponse } from 'axios';

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
        })
        .catch((err: AxiosError) => {
          throw err.response?.data;
        });
    }
  );

  const getStatus = useMutation(
    ({
      companyId,
      orderId,
    }: {
      companyId: string;
      orderId: string;
    }): Promise<CreateOrderResponse> => {
      return axios
        .get(
          PixwayAPIRoutes.ORDER_BY_ID.replace('{orderId}', orderId).replace(
            '{companyId}',
            companyId + '?fetchNewestStatus=true'
          )
        )
        .then((res): CreateOrderResponse => {
          return res.data as CreateOrderResponse;
        });
    },
    {
      retry: 0,
    }
  );

  return useMemo(() => {
    return { getOrderPreview, createOrder, getStatus };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
