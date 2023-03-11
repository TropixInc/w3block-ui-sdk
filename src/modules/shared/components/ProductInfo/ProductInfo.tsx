import { CheckoutStatus } from '../../../checkout';
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
  changeQuantity?: (n: number) => void;
}

export const ProductInfo = ({
  image,
  name,
  quantity,
  status,
  price,
  className,
  loading = false,
  currency = CurrencyEnum.BRL,
  changeQuantity,
}: ProductInfoProps) => {
  const [translate] = useTranslation();
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
  return (
    <div
      className={`pw-w-full pw-px-2 pw-py-3 pw-flex pw-justify-between pw-items-center pw-border pw-border-[rgba(0,0,0,0.2)] pw-gap-x-3 pw-overflow-auto pw-rounded-2xl ${className}`}
    >
      <div className="pw-flex pw-items-center pw-min-w-0 pw-gap-x-3">
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

        <div className="pw-flex pw-flex-col pw-flex-1 pw-overflow-ellipsis pw-overflow-hidden ">
          {loading ? (
            <Shimmer className="pw-mb-1 pw-w-[120px]" />
          ) : (
            <p className="pw-font-[600] pw-text-sm pw-text-[#353945] pw-min-w-0 pw-truncate">
              {name}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className="pw-text-center pw-text-[#353945] pw-text-[10px]">
          Quant.
        </p>
        <div className="pw-flex pw-gap-x-4 pw-items-center pw-justify-center">
          {status == CheckoutStatus.CONFIRMATION && (
            <p
              onClick={() =>
                changeQuantity?.(quantity && quantity > 1 ? quantity - 1 : 1)
              }
              className=" pw-cursor-pointer pw-text-[#353945]"
            >
              -
            </p>
          )}

          <p className="pw-text-sm pw-text-[#353945]">{quantity}</p>
          {status == CheckoutStatus.CONFIRMATION && (
            <p
              className=" pw-cursor-pointer pw-text-[#353945]"
              onClick={() =>
                changeQuantity?.(quantity && quantity < 5 ? quantity + 1 : 5)
              }
            >
              +
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <Shimmer className="pw-w-[80px] pw-h-6" />
      ) : (
        <div className="pw-fle pw-flex-col">
          <StatusToShow />
          <p className="pw-font-[700] pw-text-[#35394C] pw-text-lg pw-text-right">
            {currencyMap.get(currency)}
            {price}
          </p>
        </div>
      )}
    </div>
  );
};
