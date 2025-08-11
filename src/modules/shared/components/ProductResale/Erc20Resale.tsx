/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import { CurrencyInput } from 'react-currency-mask';
import { useDebounce } from 'react-use';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import {
  ProductResaleResponse,
  useGetResaleById,
} from '../../hooks/useGetResaleById/useGetResaleById';
import { useGetUserForSaleErc20 } from '../../hooks/useGetUserForSaleErc20/useGetUserForSaleErc20';
import { usePostProductResale } from '../../hooks/usePostProductResale/usePostProductResale';
import useTranslation from '../../hooks/useTranslation';
import { Alert } from '../Alert';
import { BaseInput } from '../BaseInput';
import { BaseSelect } from '../BaseSelect';
import { BaseButton } from '../Buttons';
import { InternalPagesLayoutBase } from '../InternalPagesLayoutBase';
import { Shimmer } from '../Shimmer';
import { Spinner } from '../Spinner';
import TranslatableComponent from '../TranslatableComponent';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { useGuardPagesWithOptions } from '../../../shared/hooks/useGuardPagesWithOptions';
import { CriptoValueComponent } from '../CriptoValueComponent';
import { InternalpageHeaderWithFunds } from '../InternalPageHeaderWithFunds';

export const Erc20Resale = () => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const id = router?.query?.id as string;
  const { mutate: productResalePreview, isLoading: isLoadingPreview } =
    useGetResaleById();
  const [productResale, setProductResale] = useState<ProductResaleResponse>();
  const [config, setConfig] = useState<{
    price?: number;
    quantity?: number;
    currency?: string;
  }>();
  const [value, setValue] = useState(0);
  const { mutate, isLoading } = usePostProductResale();
  const isEdit = (router?.query?.edit as string) === 'true';
  const { data: forSaleErc20 } = useGetUserForSaleErc20(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (forSaleErc20?.data?.items.length && isEdit) {
      setValue(parseFloat(forSaleErc20?.data?.items?.[0]?.tokenData?.amount));
      setConfig({
        price: parseFloat(forSaleErc20?.data?.items?.[0]?.prices?.[0]?.amount),
        quantity: parseFloat(forSaleErc20?.data?.items?.[0]?.tokenData?.amount),
        currency: forSaleErc20?.data?.items[0]?.prices?.[0]?.currencyId,
      });
    }
  }, [forSaleErc20?.data?.items, isEdit]);

  const getResalePreview = () => {
    productResalePreview(
      {
        id,
        amount: value.toString(),
        price: config?.price?.toString(),
      },
      {
        onSuccess(data: ProductResaleResponse | undefined) {
          setProductResale(data);
        },
      }
    );
  };

  useEffect(() => {
    getResalePreview();
  }, []);

  useDebounce(
    () => {
      getResalePreview();
    },
    400,
    [value, config?.price]
  );

  const options = useMemo(() => {
    return (
      productResale?.product?.settings?.resaleConfig?.currencyIds?.map(
        (res: string) => {
          return {
            value: res,
            label: res === '65fe1119-6ec0-4b78-8d30-cb989914bdcb' ? 'R$' : '$',
          };
        }
      ) ?? []
    );
  }, [productResale?.product?.settings?.resaleConfig?.currencyIds]);

  const handleSubmit = () => {
    if (config?.price && value && config?.currency) {
      setError('');
      mutate(
        {
          productId: id,
          config: {
            amount: value.toString(),
            prices: [
              {
                amount: config?.price.toString(),
                currencyId:
                  config?.currency ??
                  options?.[0]?.value ??
                  '65fe1119-6ec0-4b78-8d30-cb989914bdcb',
              },
            ],
          },
        },
        {
          onSuccess() {
            setSuccess(true);
          },
          onError(res: any) {
            setError(res?.response?.data?.message);
          },
        }
      );
    }
  };

  const batchSize = useMemo(() => {
    return productResale?.product?.settings?.resaleConfig?.batchSize ?? 1;
  }, [productResale?.product?.settings?.resaleConfig?.batchSize]);

  const increment = () => {
    setValue(value + batchSize);
  };

  const decrement = () => {
    setValue(value - batchSize);
  };

  useEffect(() => {
    if (options.length === 1) {
      setConfig({ ...config, currency: options[0].value });
    }
  }, [options, config]);

  useGuardPagesWithOptions({
    needUser: true,
    redirectPage: PixwayAppRoutes.SIGN_IN,
  });

  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase>
        <InternalpageHeaderWithFunds
          title={translate('pages>productResale>erc20Sell', {
            name: productResale?.product?.name,
          })}
        ></InternalpageHeaderWithFunds>
        {success ? (
          <div className="pw-flex pw-flex-col pw-mt-5 pw-px-4 pw-gap-2 pw-justify-center pw-items-center">
            <Alert variant="success">
              {translate('pages>productResale>success')}
            </Alert>
            <BaseButton link={{ href: PixwayAppRoutes.MY_SALES }}>
              {translate('pages>resale>goToSales')}
            </BaseButton>
          </div>
        ) : (
          <>
            <div className="pw-flex pw-flex-col pw-gap-[34px] pw-mt-8 pw-items-start pw-bg-white pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014] pw-p-[34px] pw-mb-5">
              <div className="pw-w-full pw-flex pw-flex-col pw-gap-[34px]">
                <div>
                  <div
                    className="pw-block pw-text-sm pw-font-medium pw-text-black pw-mb-2"
                    dangerouslySetInnerHTML={{
                      __html: translate('pages>productResale>quantity'),
                    }}
                  />
                  <div className="pw-flex pw-gap-3">
                    <BaseInput
                      value={value}
                      onChange={(e) => setValue(parseFloat(e.target.value))}
                      type="number"
                      className="pw-w-full pw-max-w-[250px]"
                    />
                    <div className="pw-flex pw-gap-2">
                      <button
                        onClick={decrement}
                        className="pw-text-black pw-border pw-border-solid pw-font-bold pw-px-4 pw-rounded-lg pw-h-[32px]"
                        disabled={value === 0}
                      >
                        -
                      </button>
                      <button
                        onClick={increment}
                        className="pw-text-black pw-border pw-border-solid pw-font-bold pw-px-4 pw-rounded-lg pw-h-[32px]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {batchSize ? (
                    <p className="pw-text-[12px] pw-text-gray-500">
                      {translate('pages>checkout>batchSizeSale', { batchSize })}
                    </p>
                  ) : null}
                </div>
                {options.length > 1 ? (
                  <div>
                    <div
                      className="pw-block pw-text-sm pw-font-medium pw-text-black pw-mb-2"
                      dangerouslySetInnerHTML={{
                        __html: translate('pages>productResale>currency'),
                      }}
                    />
                    <BaseSelect
                      value={config?.currency}
                      readOnly={options.length === 1}
                      options={options}
                      onChangeValue={(e) =>
                        setConfig({ ...config, currency: e })
                      }
                      className="pw-w-full"
                    />
                  </div>
                ) : null}
                <div>
                  <div
                    className="pw-block pw-text-sm pw-font-medium pw-text-black pw-mb-2"
                    dangerouslySetInnerHTML={{
                      __html: translate('pages>productResale>value'),
                    }}
                  />
                  <CurrencyInput
                    onChangeValue={(_, value) => {
                      if (value) {
                        setConfig({
                          ...config,
                          price: parseFloat((value as string) ?? '1'),
                        });
                      }
                    }}
                    value={config?.price}
                    hideSymbol
                    InputElement={
                      <input
                        inputMode="numeric"
                        className="pw-w-full pw-max-w-[250px] pw-border-[#CED4DA] pw-border pw-border-solid pw-h-[32px] pw-text-[16px] pw-outline-none focus:pw-outline-none pw-rounded-lg pw-transition-all pw-duration-200 pw-p-[7px_12px_6px_12px] pw-flex pw-items-center pw-justify-between relative pw-bg-white pw-text-black"
                        placeholder="0.00"
                      />
                    }
                  />
                  <p className="pw-text-[12px] pw-text-gray-500">
                    {`${translate('pages>resale>minimumValue')} R$${parseFloat(
                      productResale?.product?.settings?.resaleConfig
                        ?.priceLimits?.[0]?.min ?? '0'
                    ).toFixed(2)}, ${translate(
                      'pages>resale>maximumValue'
                    )} R$${parseFloat(
                      productResale?.product?.settings?.resaleConfig
                        ?.priceLimits?.[0]?.max ?? '0'
                    ).toFixed(2)} `}
                  </p>
                </div>
              </div>
              <div className="pw-w-full">
                <div>
                  <div
                    className="pw-block pw-text-sm pw-font-medium pw-text-black pw-mb-2"
                    dangerouslySetInnerHTML={{
                      __html: translate('pages>productResale>summary'),
                    }}
                  />
                  <div className={`pw-w-full`}>
                    <div className="pw-flex pw-justify-between">
                      <div
                        className="pw-text-sm pw-text-[#35394C] pw-font-[400]"
                        dangerouslySetInnerHTML={{
                          __html: translate('pages>productResale>subtotal'),
                        }}
                      />
                      {isLoadingPreview ? (
                        <Shimmer />
                      ) : (
                        <div className="pw-flex pw-gap-2">
                          <CriptoValueComponent
                            code={'BRL'}
                            value={
                              productResale?.resaleMetadata
                                ?.resalePreviewResponse?.totalPrice ?? '--'
                            }
                            fontClass="pw-text-sm pw-font-[600] pw-text-[#35394C]"
                          />
                        </div>
                      )}
                    </div>
                    {productResale?.resaleMetadata?.resalePreviewResponse
                      ?.fees === '0.00' ||
                    productResale?.resaleMetadata?.resalePreviewResponse
                      ?.fees === undefined ? null : (
                      <>
                        <div className="pw-flex pw-justify-between">
                          <div
                            className="pw-text-sm pw-text-[#35394C] pw-font-[400]"
                            dangerouslySetInnerHTML={{
                              __html: translate('pages>mysales>resale>fees'),
                            }}
                          />
                          {isLoadingPreview ? (
                            <Shimmer />
                          ) : (
                            <div className="pw-flex pw-gap-2 pw-justify-center pw-items-center pw-text-black">
                              <p>-</p>
                              <CriptoValueComponent
                                code={'BRL'}
                                value={
                                  productResale?.resaleMetadata
                                    ?.resalePreviewResponse?.fees ?? '--'
                                }
                                fontClass="pw-text-sm pw-font-[600] pw-text-[#35394C]"
                              />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    <div className="pw-w-full pw-h-[1px] pw-bg-[#777E8F] pw-my-2"></div>
                    <div className="pw-flex pw-justify-between">
                      <div
                        className="pw-text-sm pw-text-[#35394C] pw-font-[600]"
                        dangerouslySetInnerHTML={{
                          __html: translate('pages>resale>totalReceivable'),
                        }}
                      />
                      {isLoadingPreview ? (
                        <Shimmer />
                      ) : (
                        <div className="pw-flex pw-gap-2">
                          <CriptoValueComponent
                            code={'BRL'}
                            value={
                              productResale?.resaleMetadata
                                ?.resalePreviewResponse?.netValue ?? '--'
                            }
                            fontClass="pw-text-xl pw-font-[700] !pw-text-[#35394C]"
                          />
                        </div>
                      )}
                    </div>
                    <div
                      className="pw-text-[14px] pw-text-gray-500"
                      dangerouslySetInnerHTML={{
                        __html: translate('pages>resale>feesTip'),
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="pw-block pw-text-sm pw-font-medium pw-text-black"
                  dangerouslySetInnerHTML={{
                    __html: translate('pages>resale>saleWarning'),
                  }}
                />
              </div>
              <div className="pw-w-full pw-flex pw-justify-start">
                <div className="pw-flex pw-flex-col pw-gap-2">
                  {error !== '' ? <Alert variant="error">{error}</Alert> : null}

                  <BaseButton disabled={isLoading} onClick={handleSubmit}>
                    {isLoading ? (
                      <Spinner className="pw-w-5 pw-h-5" />
                    ) : (
                      translate('pages>mysales>resale')
                    )}
                  </BaseButton>
                </div>
              </div>
            </div>
          </>
        )}
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
