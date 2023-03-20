import { CheckoutStatus } from '../../../checkout';
import { ReactComponent as TrashIcon } from '../../assets/icons/trash.svg';
import { CurrencyEnum, currencyMap } from '../../enums/Currency';
import useTranslation from '../../hooks/useTranslation';
import { ImageSDK } from '../ImageSDK';
import { Shimmer } from '../Shimmer';
interface ProductInfoProps {
  status?: CheckoutStatus;
  image: string;
  name: string;
  id: string;
  price: string;
  className?: string;
  loading?: boolean;
  currency?: CurrencyEnum;
  quantity?: number;
  changeQuantity?: (n: number, id: string) => void;
  stockAmount: number;
  deleteProduct?: (id: string) => void;
  isCart?: boolean;
}

export const ProductInfo = ({
  image,
  name,
  quantity,
  status,
  price,
  id,
  className,
  loading = false,
  currency = CurrencyEnum.BRL,
  changeQuantity,
  stockAmount,
  deleteProduct,
}: ProductInfoProps) => {
  const [translate] = useTranslation();
  const maxUp = stockAmount > 5 ? 5 : stockAmount;

  const StatusToShow = () => {
    switch (status) {
      case CheckoutStatus.FINISHED:
        return (
          <div className="pw-flex pw-items-center pw-justify-end pw-gap-x-2 -pw-mb-[2px]">
            <p className="pw-text-sm pw-text-[#295BA6] pw-font-[600]">
              {translate('shared>processing')}
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  return status == CheckoutStatus.MY_ORDER ? (
    <div
      className={`pw-w-full pw-px-4 pw-py-5 pw-flex pw-justify-between pw-items-center  pw-gap-x-3 pw-overflow-auto ${className}`}
    >
      <div>
        {loading ? (
          <Shimmer className="!pw-w-[48px] !pw-h-[48px] pw-rounded-lg " />
        ) : (
          <div className="pw-w-[48px] pw-h-[48px] pw-rounded-lg pw-overflow-hidden">
            <ImageSDK
              src={image}
              className="pw-w-[48px] pw-h-[48px] pw-rounded-lg pw-object-cover"
            />
          </div>
        )}
      </div>
      <div className="pw-flex-1 pw-ml-3">
        {loading ? (
          <Shimmer className="pw-mb-1 pw-w-[120px]" />
        ) : (
          <p className="pw-font-[600] pw-text-[13px] pw-text-[#353945] pw-min-w-0 pw-truncate">
            {name}
          </p>
        )}
        {loading ? (
          <Shimmer className="pw-w-[80px] pw-h-6" />
        ) : (
          <div className="pw-flex pw-flex-col">
            <p className="pw-font-[400] pw-text-[#35394C] pw-text-sm">
              {currencyMap.get(currency)}
              {price}
            </p>
          </div>
        )}
        <p className="pw-text-[13px] pw-font-[400] pw-text-[#35394C]">
          Quantidade: {quantity}
        </p>
      </div>
      <div>
        <p className="pw-text-[13px] pw-font-[400] pw-text-[#35394C]">Total</p>
        <p className="pw-text-sm pw-font-[700] pw-text-[#35394C]">
          {currencyMap.get(currency)}
          {(parseFloat(price) * (quantity ?? 1)).toFixed(2)}
        </p>
      </div>
    </div>
  ) : (
    <div
      className={`pw-w-full pw-px-4 pw-py-5 pw-flex pw-justify-between  pw-gap-x-3 pw-overflow-auto ${className}`}
    >
      <div>
        {loading ? (
          <Shimmer className="!pw-w-[48px] !pw-h-[48px] pw-rounded-lg " />
        ) : (
          <div className="pw-w-[48px] pw-h-[48px] pw-rounded-lg pw-overflow-hidden">
            <ImageSDK
              src={image}
              className="pw-w-[48px] pw-h-[48px] pw-rounded-lg pw-object-cover"
            />
          </div>
        )}
      </div>
      <div className="pw-flex-1 pw-ml-3">
        {loading ? (
          <Shimmer className="pw-mb-1 pw-w-[120px]" />
        ) : (
          <p className="pw-font-[600] pw-text-[13px] pw-text-[#353945] pw-min-w-0 pw-truncate">
            {name}
          </p>
        )}
        {loading ? (
          <Shimmer className="pw-w-[80px] pw-h-6" />
        ) : (
          <div className="pw-fle pw-flex-col">
            <p className="pw-font-[700] pw-text-[#35394C] pw-text-sm">
              {currencyMap.get(currency)}
              {price}
            </p>
          </div>
        )}
      </div>
      <div className={`pw-flex pw-flex-col pw-items-end pw-justify-between `}>
        {status == CheckoutStatus.CONFIRMATION ? (
          <TrashIcon
            onClick={() => deleteProduct?.(id)}
            className="pw-cursor-pointer"
          />
        ) : (
          <StatusToShow />
        )}

        <div className="pw-flex pw-gap-x-4 pw-items-center pw-justify-center">
          {status == CheckoutStatus.CONFIRMATION && (
            <p
              onClick={() =>
                changeQuantity?.(
                  quantity && quantity > 1 ? quantity - 1 : 1,
                  id
                )
              }
              className=" pw-cursor-pointer pw-text-xs pw-border-brand-primary pw-text-[#353945] pw-flex pw-items-center pw-justify-center pw-border pw-rounded-sm pw-w-[14px] pw-h-[14px]"
            >
              -
            </p>
          )}
          <div>
            {status === CheckoutStatus.FINISHED && (
              <p className="pw-text-center pw-text-xs pw-text-[#353945]">
                Quant.
              </p>
            )}

            <p className="pw-text-sm pw-font-[600] pw-text-[#353945] pw-text-center">
              {quantity}
            </p>
          </div>

          {status == CheckoutStatus.CONFIRMATION && (
            <p
              className=" pw-cursor-pointer pw-text-xs pw-border-brand-primary pw-text-[#353945] pw-flex pw-items-center pw-justify-center pw-border pw-rounded-sm pw-w-[14px] pw-h-[14px]"
              onClick={() =>
                changeQuantity?.(
                  quantity && quantity < maxUp ? quantity + 1 : maxUp,
                  id
                )
              }
            >
              +
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
