/* eslint-disable i18next/no-literal-string */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';


import EthIcon from '../assets/icons/Eth.svg';
import MaticIcon from '../assets/icons/maticIcon.svg';
import TrashIcon from '../assets/icons/trash.svg';
import { useTranslation } from 'react-i18next';
import { CheckoutStatus } from '../../checkout/components/CheckoutInfo';
import { Variants } from '../../storefront/interfaces/Product';
import { ImageSDK } from './ImageSDK';
import { Shimmer } from './Shimmer';

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
  changeQuantity?: (
    n: boolean | null,
    id: string,
    variants?: Variants[],
    quantity?: number
  ) => void;
  stockAmount: number;
  canPurchaseAmount?: number;
  deleteProduct?: (id: string, variants?: Variants[]) => void;
  isCart?: boolean;
  originalPrice?: string;
  variants?: Variants[];
  loadingPreview?: boolean;
  index?: number;
  disableQuantity?: boolean;
  subtitle?: string;
  anchorCurrencyAmount?: string;
  anchorCurrencySymbol?: string;
  metadata?: any;
  promotionDescription?: string;
  totalValue?: string;
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
  variants,
  loadingPreview = false,
  index,
  disableQuantity = false,
  subtitle,
  anchorCurrencyAmount,
  anchorCurrencySymbol,
  metadata,
  promotionDescription,
  totalValue,
}: ProductInfoProps) => {
  const [translate] = useTranslation();
  const [error, setError] = useState('');
  const [qnt, setQnt] = useState(quantity ?? 1);
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

  const beltMap = {
    Blue: 'Blue',
    Purple: 'Purple',
    Brown: 'Brown',
    Black: 'Black',
    Coral: 'Coral',
    Red: 'Red',
  };

  type Belt = 'Blue' | 'Purple' | 'Brown' | 'Black' | 'Coral' | 'Red';

  const renderName = () => {
    if (metadata?.metadata?.degree) return 'WJJC Degree Certification';
    else if (
      metadata?.metadata?.beltColor &&
      beltMap[metadata?.metadata?.beltColor as Belt]
    )
      return 'WJJC Belt Certification';
    else if (
      metadata?.metadata?.beltColor &&
      !beltMap[metadata?.metadata?.beltColor as Belt]
    )
      return 'WJJC Children’s Belt Certification';
    else return name;
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
            {renderName()}
          </p>
        )}
        {subtitle && (
          <div className="pw-flex pw-gap-1 -pw-mt-2 pw-mb-2">
            <p className="pw-text-xs pw-text-black">{subtitle}</p>
          </div>
        )}
        {promotionDescription && (
          <div className="pw-flex pw-gap-1 -pw-mt-2 pw-mb-2">
            <p className="pw-text-[12px] pw-font-[400] pw-text-slate-500">
              {promotionDescription}
            </p>
          </div>
        )}
        <div className="pw-flex pw-flex-col pw-gap-1 -pw-mt-2 pw-mb-2 pw-opacity-50">
          {variants &&
            variants.map((value) => {
              return (
                <div key={value.id} className="pw-flex pw-gap-1">
                  <p className="pw-text-xs pw-text-black">
                    <span className="pw-font-semibold">{value.name}: </span>
                    {value.values[0].name}
                  </p>
                </div>
              );
            })}
        </div>
        {loading || loadingPreview ? (
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
                )}{' '}
                {originalPrice}
              </p>
            )}
            {anchorCurrencyAmount !== '0' ? (
              <>
                <p className="pw-font-[700] pw-text-[#35394C] pw-text-sm pw-flex pw-items-center">
                  {anchorCurrencySymbol == 'MATIC' ? (
                    <MaticIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                  ) : anchorCurrencySymbol == 'ETH' ? (
                    <EthIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                  ) : (
                    anchorCurrencySymbol
                  )}{' '}
                  {anchorCurrencyAmount}
                </p>
                <p className="pw-font-[400] pw-text-[#35394C] pw-opacity-50 pw-text-sm pw-flex pw-items-center">
                  (
                  {currency == 'MATIC' ? (
                    <MaticIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                  ) : currency == 'ETH' ? (
                    <EthIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                  ) : (
                    currency
                  )}{' '}
                  {price})
                </p>
              </>
            ) : (
              <p className="pw-font-[700] pw-text-[#35394C] pw-text-sm pw-flex pw-items-center">
                {currency == 'MATIC' ? (
                  <MaticIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                ) : currency === 'ETH' ? (
                  <EthIcon className="pw-h-[16px] pw-w-[16px] pw-mr-2" />
                ) : (
                  currency
                )}{' '}
                {price}
              </p>
            )}
          </div>
        )}
        <p className="pw-text-[13px] pw-font-[400] pw-text-[#35394C]">
          {translate('shared>productInfo>quantity', { quantity: quantity })}
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
          )}{' '}
          {totalValue
            ? parseFloat(totalValue).toFixed(2)
            : (parseFloat(price) * (quantity ?? 1)).toFixed(2)}
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
            {renderName()}
          </p>
        )}
        {subtitle && (
          <div className="pw-flex pw-gap-1 -pw-mt-2 pw-mb-2">
            <p className="pw-text-xs pw-text-black">{subtitle}</p>
          </div>
        )}
        {promotionDescription && (
          <div className="pw-flex pw-gap-1 -pw-mt-2 pw-mb-2">
            <p className="pw-text-[12px] pw-font-[400] pw-text-slate-500">
              {promotionDescription}
            </p>
          </div>
        )}
        <div className="pw-flex pw-flex-col pw-gap-1 -pw-mt-2 pw-mb-2 pw-opacity-50">
          {variants &&
            variants.map((value) => {
              return (
                <div key={value.id} className="pw-flex pw-gap-1">
                  <p className="pw-text-xs pw-text-black">
                    <span className="pw-font-semibold">{value.name}: </span>
                    {value.values[0].name}
                  </p>
                </div>
              );
            })}
        </div>
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
            {anchorCurrencyAmount !== '0' ? (
              <>
                <p className="pw-font-[700] pw-text-[#35394C] pw-text-sm pw-flex pw-items-center">
                  {anchorCurrencySymbol == 'MATIC' ? (
                    <MaticIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                  ) : anchorCurrencySymbol == 'ETH' ? (
                    <EthIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                  ) : (
                    anchorCurrencySymbol
                  )}
                  {anchorCurrencyAmount}
                </p>
                <p className="pw-font-[400] pw-text-[#35394C] pw-opacity-50 pw-text-sm pw-flex pw-items-center">
                  (
                  {currency == 'MATIC' ? (
                    <MaticIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                  ) : currency == 'ETH' ? (
                    <EthIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                  ) : (
                    currency
                  )}
                  {price})
                </p>
              </>
            ) : (
              <p className="pw-font-[700] pw-text-[#35394C] pw-text-sm pw-flex pw-items-center">
                {currency == 'MATIC' ? (
                  <MaticIcon className="pw-w-[16px] pw-h-[16px] pw-mr-2" />
                ) : currency === 'ETH' ? (
                  <EthIcon className="pw-h-[16px] pw-w-[16px] pw-mr-2" />
                ) : (
                  currency
                )}
                {parseFloat(price).toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>
        )}
      </div>
      <div
        className={`pw-flex pw-flex-col pw-items-end ${isCart ? 'pw-justify-between' : 'pw-justify-end'
          } `}
      >
        {status == CheckoutStatus.CONFIRMATION && isCart ? (
          <TrashIcon
            onClick={() => deleteProduct?.(id, variants)}
            className="pw-cursor-pointer"
          />
        ) : (
          <StatusToShow />
        )}

        {currency != 'MATIC' && currency != 'ETH' && (
          <>
            <div className="pw-flex pw-gap-x-4 pw-items-center pw-justify-center">
              {status == CheckoutStatus.CONFIRMATION && !disableQuantity && (
                <p
                  onClick={() => {
                    setQnt(qnt - 1);
                    changeQuantity?.(
                      (quantity && quantity > 1 && qnt > 1) || !isCart
                        ? false
                        : null,
                      id,
                      variants ?? []
                    );
                  }}
                  className={` pw-cursor-pointer pw-text-xs pw-flex pw-items-center pw-justify-center pw-border pw-rounded-sm pw-w-[14px] pw-h-[14px] ${(quantity && quantity > 1 && qnt > 1) || !isCart
                      ? 'pw-text-[#353945] pw-border-brand-primary'
                      : 'pw-text-[rgba(0,0,0,0.3)] pw-border-[rgba(0,0,0,0.3)] pw-invisible'
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

                {disableQuantity ? (
                  <p className="pw-text-sm pw-font-[600] pw-text-[#353945] pw-text-center pw-w-[30px]">
                    x{qnt}
                  </p>
                ) : (
                  <input
                    type="number"
                    id={`quantityValue${index}`}
                    disabled={loading || loadingPreview || disableQuantity}
                    value={qnt}
                    onChange={() => {
                      const inputValue = parseFloat(
                        (
                          document.getElementById(
                            'quantityValue' + index
                          ) as HTMLInputElement
                        ).value
                      );
                      if (canPurchaseAmount && inputValue > canPurchaseAmount) {
                        setError(
                          `Limite máximo de ${canPurchaseAmount} unidades`
                        );
                        setQnt(canPurchaseAmount);
                        changeQuantity?.(
                          null,
                          id,
                          variants ?? [],
                          canPurchaseAmount
                        );
                      } else if (inputValue > 0) {
                        setError('');
                        setQnt(inputValue);
                        changeQuantity?.(null, id, variants ?? [], inputValue);
                      } else if (inputValue < 1) {
                        setQnt(1);
                        changeQuantity?.(null, id, variants ?? [], 1);
                      }
                    }}
                    className="pw-text-sm pw-font-[600] pw-text-[#353945] pw-text-center pw-w-[30px]"
                  ></input>
                )}
              </div>

              {status == CheckoutStatus.CONFIRMATION && !disableQuantity && (
                <p
                  className={` pw-cursor-pointer pw-text-xs pw-flex pw-items-center pw-justify-center pw-border pw-rounded-sm pw-w-[14px] pw-h-[14px] ${quantity &&
                      quantity < canPurchaseAmount &&
                      quantity < stockAmount
                      ? 'pw-border-brand-primary pw-text-[#353945]'
                      : 'pw-border-[rgba(0,0,0,0.3)] pw-text-[rgba(0,0,0,0.3)] pw-invisible'
                    }`}
                  onClick={() => {
                    if (
                      quantity &&
                      quantity < canPurchaseAmount &&
                      quantity < stockAmount
                    ) {
                      setQnt(qnt + 1);
                      changeQuantity?.(
                        quantity ? true : null,
                        id,
                        variants ?? []
                      );
                    }
                  }}
                >
                  +
                </p>
              )}
            </div>
            <p className="pw-text-sm pw-font-[600] pw-text-[#93949b] pw-text-left ">
              {error}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
