const ImageSDK = lazy(() =>
  import('../../../shared/components/ImageSDK').then((mod) => ({
    default: mod.ImageSDK,
  }))
);
import { lazy } from 'react';
import { CurrencyInput } from 'react-currency-mask';

const Shimmer = lazy(() =>
  import('../../../shared/components/Shimmer').then((mod) => ({
    default: mod.Shimmer,
  }))
);

interface UserCardProps {
  onCancel?: () => void;
  avatarSrc?: string;
  name?: string;
  currency?: string;
  balance?: string;
  onChangeValue?: (value: number) => void;
  valueToUse?: number;
}
export const UserCard = ({
  onCancel,
  avatarSrc,
  name,
  currency,
  balance,
  onChangeValue,
  valueToUse = 0,
}: UserCardProps) => {
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
          Usuário não possui saldo.
        </p>
      ) : (
        <div>
          {balance ? (
            <p className="pw-text-center pw-text-zinc-700 pw-font-semibold pw-text-sm">
              {currency} a ser utilizado
            </p>
          ) : (
            <Shimmer className="pw-h-5 !pw-w-[150px] pw-rounded-full" />
          )}
          {balance ? (
            <CurrencyInput
              onChangeValue={(_, value) =>
                onChangeValue && onChangeValue(value as number)
              }
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
        </div>
      )}
    </div>
  );
};
