import { useEffect, useMemo, useState } from 'react';
import { CurrencyInput } from 'react-currency-mask';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useRouterConnect } from '../../hooks';
import { useGetResaleById } from '../../hooks/useGetResaleById/useGetResaleById';
import { useGuardPagesWithOptions } from '../../hooks/useGuardPagesWithOptions/useGuardPagesWithOptions';
import { usePostProductResale } from '../../hooks/usePostProductResale/usePostProductResale';
import useTranslation from '../../hooks/useTranslation';
import { Alert } from '../Alert';
import { BaseInput } from '../BaseInput';
import { BaseSelect } from '../BaseSelect';
import { BaseButton } from '../Buttons';
import { CriptoValueComponent } from '../CriptoValueComponent/CriptoValueComponent';
import { InternalpageHeaderWithFunds } from '../InternalPageHeaderWithFunds/InternalPageHeaderWithFunds';
import { InternalPagesLayoutBase } from '../InternalPagesLayoutBase';
import { Spinner } from '../Spinner';
import TranslatableComponent from '../TranslatableComponent';

export const Erc20Resale = () => {
  const [translate] = useTranslation();
  const router = useRouterConnect();
  const id = router?.query?.id as string;
  const { data: productResale } = useGetResaleById({ id });
  const [config, setConfig] = useState<{
    price?: number;
    quantity?: number;
    currency?: string;
  }>();
  const [value, setValue] = useState(0);
  const { mutate, isLoading } = usePostProductResale();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
                  config?.currency ?? '65fe1119-6ec0-4b78-8d30-cb989914bdcb',
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

  const options = useMemo(() => {
    return (
      productResale?.product?.settings?.resaleConfig?.currencyIds?.map(
        (res) => {
          return {
            value: res,
            label: res === '65fe1119-6ec0-4b78-8d30-cb989914bdcb' ? 'R$' : '$',
          };
        }
      ) ?? []
    );
  }, [productResale?.product?.settings?.resaleConfig?.currencyIds]);

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
          <div className="pw-flex pw-flex-col pw-mt-5 pw-gap-2 pw-justify-center pw-items-center">
            <Alert variant="success">
              {translate('pages>productResale>success')}
            </Alert>
            <BaseButton link={{ href: PixwayAppRoutes.MY_SALES }}>
              {translate('pages>resale>goToSales')}
            </BaseButton>
          </div>
        ) : (
          <>
            <div className="pw-flex sm:pw-flex-row pw-flex-col pw-gap-[34px] pw-mt-8 pw-items-start pw-bg-white pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014] pw-p-[34px]">
              <div className="pw-w-full pw-flex pw-flex-col pw-gap-3">
                <div>
                  <label className="pw-block pw-text-sm pw-font-medium pw-text-black pw-mb-2">
                    {translate('pages>productResale>quantity')}
                  </label>
                  <div className="pw-flex pw-gap-3">
                    <BaseInput
                      value={value}
                      onChange={(e) => setValue(parseFloat(e.target.value))}
                      type="number"
                      className="pw-w-full"
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
                      {translate('pages>checkout>batchSize', { batchSize })}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="pw-block pw-text-sm pw-font-medium pw-text-black pw-mb-2">
                    {translate('pages>productResale>currency')}
                  </label>
                  <BaseSelect
                    value={config?.currency}
                    readOnly={options.length === 1}
                    options={options}
                    onChangeValue={(e) => setConfig({ ...config, currency: e })}
                    className="pw-w-full"
                  />
                </div>
                <div>
                  <label className="pw-block pw-text-sm pw-font-medium pw-text-black pw-mb-2">
                    {translate('pages>productResale>value')}
                  </label>
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
                        className="pw-w-full pw-border-[#CED4DA] pw-border pw-border-solid pw-h-[32px] pw-text-[16px] pw-outline-none focus:pw-outline-none pw-rounded-lg pw-transition-all pw-duration-200 pw-p-[7px_12px_6px_12px] pw-flex pw-items-center pw-justify-between relative pw-bg-white pw-text-black"
                        placeholder="0.00"
                      />
                    }
                  />
                  <p className="pw-text-[12px] pw-text-gray-500">
                    {`Valor mínimo: R$${parseFloat(
                      productResale?.product?.settings?.resaleConfig
                        ?.priceLimits?.[0]?.min ?? '0'
                    ).toFixed(2)}, Valor máximo: R$${parseFloat(
                      productResale?.product?.settings?.resaleConfig
                        ?.priceLimits?.[0]?.max ?? '0'
                    ).toFixed(2)} `}
                  </p>
                </div>
              </div>
              <div className="pw-w-full">
                <div className="pw-mb-8">
                  <h1 className="pw-font-normal pw-text-base pw-mb-4 pw-text-black">
                    {translate('pages>productResale>summary')}
                  </h1>
                  {config?.price && config?.currency && value ? (
                    <div className={`pw-w-full`}>
                      <div className="pw-flex pw-justify-between">
                        <p className="pw-text-sm pw-text-[#35394C] pw-font-[400]">
                          {translate('pages>productResale>subtotal')}
                        </p>
                        <div className="pw-flex pw-gap-2">
                          <CriptoValueComponent
                            code={'BRL'}
                            value={(config.price * value) as unknown as string}
                            fontClass="pw-text-sm pw-font-[600] pw-text-[#35394C]"
                          />
                        </div>
                      </div>
                      <div className="pw-w-full pw-h-[1px] pw-bg-[#777E8F] pw-my-2"></div>
                      <div className="pw-flex pw-justify-between">
                        <p className="pw-font-[600] pw-text-sm pw-text-[#35394C]">
                          {translate('shared>components>price&gasInfo')}
                        </p>
                        <div className="pw-flex pw-gap-2">
                          <CriptoValueComponent
                            code={'BRL'}
                            value={(config.price * value) as unknown as string}
                            fontClass="pw-text-xl pw-font-[700] !pw-text-[#35394C]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="pw-mt-5 pw-w-full pw-flex pw-justify-end">
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
          </>
        )}
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
