import { useState } from 'react';

import { PixwayAppRoutes } from '../../enums/PixwayAppRoutes';
import { useRouterConnect } from '../../hooks';
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
  const batchSize = router?.query?.batchSize as string;
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

  const increment = () => {
    setValue(value + parseFloat(batchSize ?? '1'));
  };

  const decrement = () => {
    setValue(value - parseFloat(batchSize ?? '1'));
  };

  useGuardPagesWithOptions({
    needUser: true,
    redirectPage: PixwayAppRoutes.SIGN_IN,
  });
  return (
    <TranslatableComponent>
      <InternalPagesLayoutBase>
        <InternalpageHeaderWithFunds
          title={translate('pages>productResale>erc20Sell')}
        ></InternalpageHeaderWithFunds>
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
              <p className="pw-text-[10px] pw-text-gray-500">
                {`x${batchSize ?? '1'}`}
              </p>
            </div>
            <div>
              <label className="pw-block pw-text-sm pw-font-medium pw-text-black pw-mb-2">
                {translate('pages>productResale>currency')}
              </label>
              <BaseSelect
                value={config?.currency}
                options={[
                  {
                    value: '65fe1119-6ec0-4b78-8d30-cb989914bdcb',
                    label: 'BRL',
                  },
                  // { value: '8c43ece8-99b0-4877-aed3-2170d2deb4bf', label: 'USD' },
                ]}
                onChangeValue={(e) => setConfig({ ...config, currency: e })}
                className="pw-w-full"
              />
            </div>
            <div>
              <label className="pw-block pw-text-sm pw-font-medium pw-text-black pw-mb-2">
                {translate('pages>productResale>value')}
              </label>
              <BaseInput
                value={config?.price}
                onChange={(e) =>
                  setConfig({ ...config, price: parseFloat(e.target.value) })
                }
                type="number"
                className="pw-w-full"
              />
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
            {success ? (
              <Alert variant="success">
                {translate('pages>productResale>success')}
              </Alert>
            ) : (
              <BaseButton disabled={isLoading} onClick={handleSubmit}>
                {isLoading ? (
                  <Spinner className="pw-w-5 pw-h-5" />
                ) : (
                  translate('pages>mysales>resale')
                )}
              </BaseButton>
            )}
          </div>
        </div>
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
