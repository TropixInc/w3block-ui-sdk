import { CheckoutStatus } from '../../../checkout';
import { ReactComponent as EthIcon } from '../../assets/icons/Eth.svg';
import { ReactComponent as MaticIcon } from '../../assets/icons/maticIcon.svg';
import { ReactComponent as TrashIcon } from '../../assets/icons/trash.svg';
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
  currency?: string;
  quantity?: number;
  changeQuantity?: (n: number, id: string) => void;
  stockAmount: number;
  canPurchaseAmount?: number;
  deleteProduct?: (id: string) => void;
  isCart?: boolean;
  originalPrice?: string;
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
  currency = 'R$',
  changeQuantity,
  stockAmount,
  canPurchaseAmount = 5,
  deleteProduct,
  isCart,
  originalPrice,
}: ProductInfoProps) => {
  const [translate] = useTranslation();
  const maxUp = stockAmount > 5 ? 5 : stockAmount;
  const StatusToShow = () => {
    switch (status) {
      case CheckoutStatus.FINISHED:
        return (
          <div className="pw-flex pw-items-center pw-justify-end pw-gap-x-2 -pw-mb-[2px]">
            <p className="pw-text-xs sm:pw-text-sm pw-text-[#295BA6] pw-font-[600]">
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
              width={500}
              quality="good"
            />
          </div>
        )}
      </div>
      <div className="pw-flex-1 pw-ml-3">
        {loading ? (
          <Shimmer className="pw-mb-1 pw-w-[120px]" />
        ) : (
          <p className="pw-font-[600] pw-text-[13px] pw-text-[#353945] pw-min-w-0 pw-truncate pw-whitespace-pre-wrap pw-mb-2">
            {name}
          </p>
        )}
        {loading ? (
          <Shimmer className="pw-w-[80px] pw-h-6" />
        ) : (
          <div className="pw-flex pw-gap-1">
            {parseFloat(originalPrice ?? '0') > parseFloat(price) && (
              <p className="pw-font-[400] pw-text-[#35394C] pw-opacity-50 pw-text-sm pw-flex pw-items-center pw-line-through">
                {currency == 'MATIC' ? (
                  <MaticIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                ) : currency == 'ETH' ? (
                  <EthIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                ) : (
                  currency
                )}
                {originalPrice}
              </p>
            )}
            <p className="pw-font-[400] pw-text-[#35394C] pw-text-sm pw-flex pw-items-center">
              {currency == 'MATIC' ? (
                <MaticIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
              ) : currency == 'ETH' ? (
                <EthIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
              ) : (
                currency
              )}
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
        <p className="pw-text-sm pw-font-[700] pw-text-[#35394C] pw-flex pw-items-center">
          {currency == 'MATIC' ? (
            <MaticIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
          ) : currency == 'ETH' ? (
            <EthIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
          ) : (
            currency
          )}
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
          <div className="pw-w-[36px] pw-h-[36px] sm:pw-w-[48px] sm:pw-h-[48px] pw-rounded-md sm:pw-rounded-lg pw-overflow-hidden">
            <ImageSDK
              src={image}
              className="pw-w-[36px] pw-h-[36px] sm:pw-w-[48px] sm:pw-h-[48px] pw-rounded-md sm:pw-rounded-lg pw-object-cover"
              width={500}
              quality="good"
            />
          </div>
        )}
      </div>
      <div className="pw-flex-1 pw-ml-1 sm:pw-ml-3">
        {loading ? (
          <Shimmer className="pw-mb-1 pw-w-[120px]" />
        ) : (
          <p className="pw-font-[600] pw-text-[13px] pw-text-[#353945] pw-min-w-0 pw-truncate pw-whitespace-pre-wrap pw-mb-2">
            {name}
          </p>
        )}
        {loading ? (
          <Shimmer className="pw-w-[80px] pw-h-6" />
        ) : (
          <div className="pw-flex pw-gap-1">
            {parseFloat(originalPrice ?? '0') > parseFloat(price) && (
              <p className="pw-font-[400] pw-text-[#35394C] pw-opacity-50 pw-text-sm pw-flex pw-items-center pw-line-through">
                {currency == 'MATIC' ? (
                  <MaticIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                ) : currency == 'ETH' ? (
                  <EthIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                ) : (
                  currency
                )}
                {originalPrice}
              </p>
            )}
            <p className="pw-font-[700] pw-text-[#35394C] pw-text-sm pw-flex pw-items-center">
              {currency == 'MATIC' ? (
                <MaticIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
              ) : currency === 'ETH' ? (
                <EthIcon className="pw-h-[16px] pw-w-[16px] pw-mr-2" />
              ) : (
                currency
              )}
              {price}
            </p>
          </div>
        )}
      </div>
      <div
        className={`pw-flex pw-flex-col pw-items-end ${
          isCart ? 'pw-justify-between' : 'pw-justify-end'
        } `}
      >
        {status == CheckoutStatus.CONFIRMATION && isCart ? (
          <TrashIcon
            onClick={() => deleteProduct?.(id)}
            className="pw-cursor-pointer"
          />
        ) : (
          <StatusToShow />
        )}

        {currency != 'MATIC' && currency != 'ETH' && (
          <div className="pw-flex pw-gap-x-4 pw-items-center pw-justify-center">
            {status == CheckoutStatus.CONFIRMATION && (
              <p
                onClick={() =>
                  changeQuantity?.(
                    quantity && quantity > 1 ? quantity - 1 : 1,
                    id
                  )
                }
                className={` pw-cursor-pointer pw-text-xs pw-flex pw-items-center pw-justify-center pw-border pw-rounded-sm pw-w-[14px] pw-h-[14px] ${
                  quantity && quantity > 1
                    ? 'pw-text-[#353945] pw-border-brand-primary'
                    : 'pw-text-[rgba(0,0,0,0.3)] pw-border-[rgba(0,0,0,0.3)]'
                }`}
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
                className={` pw-cursor-pointer pw-text-xs pw-flex pw-items-center pw-justify-center pw-border pw-rounded-sm pw-w-[14px] pw-h-[14px] ${
                  quantity &&
                  quantity < canPurchaseAmount &&
                  quantity < stockAmount
                    ? 'pw-border-brand-primary pw-text-[#353945]'
                    : 'pw-border-[rgba(0,0,0,0.3)] pw-text-[rgba(0,0,0,0.3)]'
                }`}
                onClick={() => {
                  if (
                    quantity &&
                    quantity < canPurchaseAmount &&
                    quantity < stockAmount
                  ) {
                    changeQuantity?.(
                      quantity && quantity < maxUp ? quantity + 1 : maxUp,
                      id
                    );
                  }
                }}
              >
                +
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
