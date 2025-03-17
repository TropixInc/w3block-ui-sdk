import { useEffect, useState } from 'react';

import { ERROR_STATUS, metamaskErrors, useMetamask } from '../../../core';
import { useSocket } from '../../../core/metamask/hooks/useSocket/useSocket';
import { BaseButton } from '../../../shared';
import { Spinner } from '../../../shared/components/Spinner';
import { useIncreaseCurrencyAllowance } from '../../../shared/hooks/useIncreaseCurrencyAllowance';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

export const IncreaseCurrencyAllowance = ({
  currencyAllowanceState,
  onClose,
  onContinue,
  onSuccess,
  currencyId,
  targetAmount,
  resetError,
}: {
  currencyAllowanceState: string;
  onClose(): void;
  onContinue(): void;
  onSuccess(): void;
  currencyId: string;
  targetAmount: string;
  resetError: boolean;
}) => {
  const [translate] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [err, setErr] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [allowMeta, setAllowMeta] = useState(true);
  const { mutate, isLoading } = useIncreaseCurrencyAllowance();
  const { mainWallet: wallet } = useUserWallet();
  const { signinRequest, emitTransactionCloncluded } = useSocket();
  const { sendSignedRequest } = useMetamask();
  const handleClick = () => {
    onContinue();
    mutate(
      { currencyId, targetAmount, walletAddress: wallet?.address ?? '' },
      {
        onSuccess() {
          onSuccess();
          setLoading(true);
          setAllowMeta(true);
        },
        onError() {
          setError(true);
        },
      }
    );
  };

  useEffect(() => {
    if (signinRequest && allowMeta) {
      setAllowMeta(false);
      sendSignedRequest?.(signinRequest)
        .then((res: string) => {
          emitTransactionCloncluded?.(signinRequest.id, res).then(() => {
            console.log('Transaction concluded');
          });
        })
        .catch((e: any) => {
          setError(true);
          if (e?.code === 'ACTION_REJECTED') {
            setErr(metamaskErrors.get(4001) ?? ERROR_STATUS.NO_MAPPED_ERROR);
            setErrMessage(
              'Para prosseguir com a compra, assine a transação da MetaMask após clicar no botão de comprar. '
            );
          } else {
            if (e.code) {
              setErr(
                metamaskErrors.get(e.code) ?? ERROR_STATUS.NO_MAPPED_ERROR
              );
            }
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signinRequest]);

  const Processing = () => {
    return (
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-py-10">
        <p className="pw-font-semibold pw-text-base">
          {translate('checkout>increaseCurrency>processing')}
        </p>
        <Spinner />
      </div>
    );
  };

  if (resetError || error) {
    return (
      <ErrorMessage
        className="pw-mt-4"
        title={err ?? 'Erro, por favor tente novamente'}
        message={errMessage}
      />
    );
  }

  return (
    <div>
      {currencyAllowanceState === 'required' ? (
        <div>
          {loading || isLoading ? (
            <Processing />
          ) : (
            <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-py-10">
              <p className="pw-font-semibold pw-w-[300px] pw-text-base pw-text-center">
                {translate('checkout>increaseCurrency>continue')}
              </p>
              <div className="pw-flex pw-w-full pw-justify-center pw-gap-10 pw-mt-4 pw-items-center">
                <BaseButton variant="outlined" onClick={onClose}>
                  {translate('checkout>increaseCurrency>cancel')}
                </BaseButton>
                <BaseButton onClick={handleClick}>{'Permitir'}</BaseButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>{<Processing />}</div>
      )}
    </div>
  );
};
