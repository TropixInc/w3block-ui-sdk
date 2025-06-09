
import { useState } from 'react';
import { CurrencyInput } from 'react-currency-mask';
import { useTranslation } from 'react-i18next';
import { Alert } from '../../shared/components/Alert';
import { ImageSDK } from '../../shared/components/ImageSDK';
import { Shimmer } from '../../shared/components/Shimmer';



interface UserCardProps {
  onCancel?: () => void;
  avatarSrc?: string;
  name?: string;
  currency?: string;
  balance?: string;
  onChangeValue: (value: number) => void;
  valueToUse?: number;
  setMaxValue: () => void;
}
export const UserCard = ({
  onCancel,
  avatarSrc,
  name,
  currency,
  balance,
  onChangeValue,
  valueToUse = 0,
  setMaxValue,
}: UserCardProps) => {
  const [error, setError] = useState(false);
  const [translate] = useTranslation();
  return (
    <div className=" pw-w-full sm:pw-w-[300px] pw-p-5 pw-bg-white pw-rounded-2xl pw-shadow pw-border pw-border-zinc-100 pw-flex-col pw-justify-center pw-items-center pw-gap-3.5 pw-flex">
      {name && (
        <div
          onClick={onCancel}
          className="pw-w-4 pw-h-4 pw-rounded-full pw-border pw-border-red-500 pw-flex pw-justify-center pw-items-center pw-text-red-500 pw-text-sm"
        >
          -
        </div>
      )}
      <ImageSDK
        src={avatarSrc}
        className="pw-w-[150px] pw-h-[150px] pw-rounded-full pw-object-cover"
      />
      {name ? (
        <p className="pw-text-center pw-text-zinc-700 pw-font-semibold pw-text-sm">
          {name}
        </p>
      ) : (
        <Shimmer className="pw-h-5 !pw-w-[150px] pw-rounded-full" />
      )}
      <div className="pw-w-full pw-rounded-full pw-h-px pw-bg-zinc-200"></div>
      {balance && parseFloat(balance) == 0 ? (
        <p className="pw-text-center pw-text-red-600 pw-font-semibold pw-text-sm">
          {translate('business>userCard>userNotBalance')}
        </p>
      ) : (
        <div>
          {balance ? (
            <p className="pw-text-center pw-text-zinc-700 pw-font-semibold pw-text-sm">
              {translate('business>userCard>utilityBalance', {
                currency: currency,
              })}
            </p>
          ) : (
            <Shimmer className="pw-h-5 !pw-w-[150px] pw-rounded-full" />
          )}
          {balance ? (
            <CurrencyInput
              onChangeValue={(_, value) => {
                if ((value as number) > parseFloat(balance)) {
                  setError(true);
                } else {
                  setError(false);
                }
                onChangeValue(value as number);
              }}
              value={valueToUse}
              hideSymbol
              InputElement={
                <input
                  placeholder="Valor a ser utilizado"
                  className="pw-p-2.5 pw-rounded-lg pw-border pw-border-blue-800 pw-flex-col pw-mt-1 pw-text-black"
                />
              }
            />
          ) : (
            <Shimmer className="pw-h-5 !pw-w-[150px] pw-rounded-full pw-mt-1" />
          )}
          {balance && parseFloat(balance) != 0 ? (
            <div className="pw-flex pw-justify-between pw-text-slate-500 pw-text-sm pw-items-center pw-mt-3">
              <p>
                {translate('header>logged>pixwayBalance')}:{' '}
                {parseFloat(balance).toFixed(2)}
              </p>
              <button
                onClick={() => {
                  setMaxValue();
                  setError(false);
                }}
                className="pw-p-[2px_10px] pw-bg-zinc-100 pw-rounded-[48px] pw-border pw-border-zinc-600  pw-text-slate-800 pw-font-medium"
              >
                {translate('business>userCard>max')}
              </button>
            </div>
          ) : null}
          {error && (
            <Alert variant="atention" className="pw-mt-3">
              {translate('business>userCard>insufficientFunds')}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};
