import { useState } from 'react';

import { format } from 'date-fns';

import { CheckoutStatus } from '../../../checkout';
import { useGetEspecificOrder } from '../../../checkout/hooks/useGetEspecificOrder';
import { PriceAndGasInfo, ProductInfo } from '../../../shared';
import { ReactComponent as ArrowIcon } from '../../../shared/assets/icons/arrowDown.svg';
import { ReactComponent as CheckIcon } from '../../../shared/assets/icons/checkOutlined.svg';
import { ReactComponent as CopyIcon } from '../../../shared/assets/icons/copy.svg';
import { ReactComponent as XIcon } from '../../../shared/assets/icons/x-circle.svg';
export enum OrderStatusEnum {
  PENDING = 'pending',
  EXPIRED = 'expired',
  CONFIRMING_PAYMENT = 'confirming_payment',
  CONCLUDED = 'concluded',
  FAILED = 'failed',
  DELIVERING = 'delivering',
  CANCELLED = 'cancelled',
}

interface OrderCardComponentSDKProps {
  id: string;
  status: OrderStatusEnum;
  createdAt: string;
}

export const OrderCardComponentSDK = ({
  id,
  status,
  createdAt,
}: OrderCardComponentSDKProps) => {
  const [opened, setOpened] = useState(false);
  const { data: order } = useGetEspecificOrder(id, opened);
  const statusObj = getStatusText(status);
  const products = order?.data.products;
  return (
    <div className="pw-p-6 pw-bg-white pw-rounded-xl pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] pw-w-full">
      <div className="pw-flex pw-justify-between">
        <div className="">
          <p
            style={{ color: statusObj?.color }}
            className="pw-text-sm pw-font-bold pw-flex pw-gap-1"
          >
            <span>{statusObj?.icon}</span>
            {statusObj?.title}
          </p>

          <p className="pw-text-xs pw-font-[500] pw-text-black pw-flex pw-gap-x-1">
            ID: {id}{' '}
            <span>
              <CopyIcon className="pw-fill-[#295BA6] pw-text-xs pw-w-[12px] pw-h-[12px] pw-cursor-pointer" />
            </span>
          </p>
        </div>
        <div className="pw-flex pw-items-center pw-gap-x-2 pw-justify-end">
          <div className="">
            <p className="pw-text-xs pw-font-[500] pw-text-[#353945] pw-text-right">
              Pedido realizado em:
            </p>
            <p className="pw-text-xs pw-font-[500] pw-text-[#353945]  pw-text-right">
              {format(new Date(createdAt), 'd MMM, yyyy')}
            </p>
          </div>
          <div
            onClick={() => setOpened(!opened)}
            className="pw-w-[30px] pw-h-[30px] pw-flex  pw-justify-center pw-items-center pw-bg-[#EFEFEF] pw-rounded-full pw-cursor-pointer"
          >
            <ArrowIcon style={{ stroke: statusObj?.color }} />
          </div>
        </div>
      </div>

      {opened && products && products.length && (
        <div>
          <div className="pw-border pw-border-slate-300 pw-rounded-lg pw-overflow-hidden pw-mt-6">
            {products && products.length
              ? products
                  .reduce((acc: any, current: any) => {
                    const x = acc.some(
                      (item: any) =>
                        item.productToken.product.id ==
                        current.productToken.product.id
                    );
                    if (!x) {
                      return acc.concat([current]);
                    } else {
                      return acc;
                    }
                  }, [])
                  .map((prod: any, index: number) => (
                    <ProductInfo
                      image={
                        prod?.productToken?.product?.images?.length
                          ? prod?.productToken?.product?.images?.thumb
                          : prod.productToken.metadata.media[0].cached
                              .smallSizeUrl
                      }
                      name={prod?.productToken?.product?.name ?? ''}
                      id={prod?.productToken?.product.id ?? ''}
                      price={prod.currencyAmount}
                      status={CheckoutStatus.MY_ORDER}
                      quantity={
                        products.filter(
                          (pr: any) =>
                            pr.productToken.product.id ==
                            prod.productToken.product.id
                        ).length
                      }
                      stockAmount={1}
                      key={prod.id + index}
                    />
                  ))
              : null}
          </div>
          <PriceAndGasInfo
            className="pw-mt-6"
            gasFee={order.data.gasFee}
            service={order.data.clientServiceFee}
            price={order.data.currencyAmount}
            totalPrice={(
              parseFloat(order.data.clientServiceFee) +
              parseFloat(order.data.currencyAmount) +
              parseFloat(order.data.gasFee)
            ).toFixed(2)}
          />
        </div>
      )}
    </div>
  );
};

const getStatusText = (status: OrderStatusEnum) => {
  switch (status) {
    case OrderStatusEnum.CANCELLED:
      return { title: 'Cancelado', color: '#ED4971', icon: <XIcon /> };
    case OrderStatusEnum.CONCLUDED:
      return { title: 'Finalizado', color: '#295BA6', icon: <CheckIcon /> };
    case OrderStatusEnum.CONFIRMING_PAYMENT:
      return { title: 'Confirmando o pagamento', color: '#295BA6' };
    case OrderStatusEnum.DELIVERING:
      return { title: 'Entregando', color: '#295BA6' };
    case OrderStatusEnum.EXPIRED:
      return {
        title: 'Expirado',
        color: '#ED4971',
        icon: <XIcon className="pw-stroke-[#ED4971]" />,
      };
    case OrderStatusEnum.FAILED:
      return { title: 'Falha', color: '#ED4971', icon: <XIcon /> };
    case OrderStatusEnum.PENDING:
      return { title: 'Pagamento pendente', color: '#353945' };
    default:
      break;
  }
};
