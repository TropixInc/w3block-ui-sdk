import { useMemo } from 'react';


import { AxiosError, AxiosResponse } from 'axios';

import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../shared/enums/W3blockAPI';
import { useAxios } from '../../shared/hooks/useAxios';

import {
  CompleteOrderPayload,
  CompletePaymentOrder,
  CreateOrder,
  CreateOrderPayload,
  CreateOrderResponse,
  OrderPreviewResponse,
} from '../interface/interface';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useUtms } from '../../shared/hooks/useUtms';

interface GetOrderPreviewPayload {
  productIds: ProductToSendPayload[];
  currencyId?: string;
  companyId: string;
  couponCode?: string;
  passShareCodeData?: {
    name: string;
    message: string;
  };
  payments?: {
    currencyId?: string;
    amountType?: string;
    amount?: string;
    paymentMethod?: string;
  }[];
  selectBestPrice?: boolean;
}

interface ProductToSendPayload {
  productId: string;
  selectBestPrice?: boolean;
  productTokenId?: string;
  variantIds?: string[];
  quantity?: number;
  passShareCodeData?: {
    name: string;
    message: string;
  };
}

interface OrderPreviewPayload {
  orderProducts: ProductToSendPayload[];
  currencyId?: string;
  acceptIncompleteCart?: boolean;
  couponCode?: string;
  payments?: {
    currencyId?: string;
    amountType?: string;
    amount?: string;
    paymentMethod?: string;
  }[];
  selectBestPrice?: boolean;
}

export const useCheckout = () => {
  const axios = useAxios(W3blockAPI.COMMERCE);
  const utms = useUtms();
  const getOrderPreview = useMutation(
    async ({
      productIds,
      companyId,
      couponCode,
      payments,
      currencyId,
    }: GetOrderPreviewPayload) => {
      const products: ProductToSendPayload[] = productIds.map(
        (pId): ProductToSendPayload => {
          return pId?.productTokenId
            ? {
                productId: pId.productId,
                productTokenId: pId?.productTokenId,
                variantIds: pId.variantIds,
                quantity: pId.quantity,
                selectBestPrice: pId.selectBestPrice,
              }
            : {
                productId: pId.productId,
                variantIds: pId.variantIds,
                quantity: pId.quantity,
                selectBestPrice: pId.selectBestPrice,
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
        couponCode,
        payments,
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

  const completeOrderPayment = useMutation(
    ({
      companyId,
      completeOrder,
      orderId,
    }: CompleteOrderPayload): Promise<CreateOrderResponse> => {
      const cOrder = completeOrder;
      return axios
        .patch<
          CreateOrderResponse,
          AxiosResponse<CreateOrderResponse>,
          CompletePaymentOrder
        >(
          PixwayAPIRoutes.COMPLETE_ORDER_PAYMENT.replace(
            '{companyId}',
            companyId
          ).replace('{orderId}', orderId ?? ''),
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
            companyId
          ) + '?fetchNewestStatus=true'
        )
        .then((res): CreateOrderResponse => {
          return res.data as CreateOrderResponse;
        });
    },
    {
      retry: 0,
    }
  );

  const useGetOrderById = ({
    companyId,
    orderId,
  }: {
    companyId: string;
    orderId: string;
  }) => {
    return useQuery(
      [PixwayAPIRoutes.ORDER_BY_ID, companyId, orderId],
      (): Promise<OrderPreviewResponse> =>
        axios
          .get(
            PixwayAPIRoutes.ORDER_BY_ID.replace('{orderId}', orderId).replace(
              '{companyId}',
              companyId
            ) + '?fetchNewestStatus=true'
          )
          .then((res): OrderPreviewResponse => {
            return res.data as OrderPreviewResponse;
          })
    );
  };

  return useMemo(() => {
    return {
      getOrderPreview,
      createOrder,
      getStatus,
      useGetOrderById,
      completeOrderPayment,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
