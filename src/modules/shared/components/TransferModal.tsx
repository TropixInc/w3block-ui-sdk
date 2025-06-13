/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';


import _ from 'lodash';

import { CurrencyInput } from 'react-currency-mask';
import { useTransfer } from '../hooks/useTransfer';
import { useGetTheme } from '../../storefront/hooks/useGetTheme';
import { usePaginatedGenericApiGet } from '../hooks/usePaginatedGenericApiGet';
import { ModalBase } from './ModalBase';
import { Alert } from './Alert';
import { BaseButton } from './Buttons';
import { BaseSelect } from './BaseSelect';
import { BaseInput } from './BaseInput';
import { Spinner } from './Spinner';



const paginationMapping = {
  default: {},
  strapi: {
    inputMap: (data: any) => {
      if (data) {
        return {
          totalItems: data?.meta?.pagination?.total,
          totalPages: data?.meta?.pagination?.pageCount,
        };
      }
    },
    outputMap: (params: any) => {
      const newParams = { ...params, page: undefined };
      newParams['pagination[pageSize]'] = 10;
      newParams['pagination[page]'] = params?.page;

      return newParams;
    },
  },
};

export const TransferModal = ({
  isOpen,
  onClose,
  wallet,
  contractId,
}: {
  isOpen: boolean;
  onClose(): void;
  wallet: string;
  contractId: string;
}) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [walletToTransfer, setWalletToTransfer] = useState('');
  const [step, setStep] = useState(1);
  const { mutate, isLoading } = useTransfer();
  const { data: theme } = useGetTheme(!isOpen);
  const transferInfo = theme?.data?.configurations?.contentData?.walletTransfer;
  const [{ data }] = usePaginatedGenericApiGet({
    url: transferInfo?.suggestionUrl,
    isPublicApi: true,
    enabled: true,
    ...paginationMapping['strapi'],
  });
  const options = useMemo(() => {
    if (data && transferInfo) {
      const items = _.get(data, transferInfo.itemsPath, []);

      const arrOptions = items?.length
        ? items?.map((item: any) => ({
            value: _.get(item, transferInfo.suggestionWalletPath, ''),
            label: _.get(item, transferInfo.suggestionWalletLabel, ''),
          }))
        : [];

      return arrOptions?.filter((item: any) => item.value);
    } else return [];
  }, [data, transferInfo]);

  const [result, setResult] = useState('');

  return (
    <ModalBase
      classes={{ classComplement: '!pw-min-w-[350px]' }}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setStep(1);
      }}
    >
      {step === 3 ? (
        <>
          <div className="pw-flex pw-flex-col pw-gap-6 pw-items-center pw-mt-4">
            <Alert variant={result === 'error' ? 'error' : 'success'}>
              {result === 'error'
                ? 'Erro ao transferir, por favor tente novamente mais tarde.'
                : 'Tranferência concluida com sucesso!'}
            </Alert>
          </div>
          <div className="pw-flex pw-justify-center pw-gap-5 pw-mt-8">
            <BaseButton
              onClick={() => {
                onClose();
                setStep(1);
              }}
              variant="outlined"
            >
              {'Fechar'}
            </BaseButton>
            {result === 'error' ? (
              <BaseButton
                disabled={paymentAmount === '' || walletToTransfer === ''}
                onClick={() => setStep(1)}
              >
                {'Tentar Novamente'}
              </BaseButton>
            ) : null}
          </div>
        </>
      ) : (
        <>
          {step === 1 ? (
            <div className="pw-flex pw-flex-col pw-gap-6 pw-items-center pw-mt-3">
              <p className="pw-font-semibold">{'Transferir'}</p>
              <BaseSelect
                placeholder="Destinatário..."
                options={options}
                onChangeValue={setWalletToTransfer}
                value={walletToTransfer}
                classes={{ root: '!pw-w-full' }}
              />
              <CurrencyInput
                onChangeValue={(_, value) => {
                  if (value) {
                    setPaymentAmount(value as string);
                  }
                }}
                value={paymentAmount}
                hideSymbol
                InputElement={
                  <BaseInput
                    type="numeric"
                    placeholder="0,0"
                    className="!pw-w-full"
                  />
                }
              />
            </div>
          ) : (
            <div className="pw-flex pw-flex-col pw-gap-6 pw-items-center pw-mt-3">
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <p className="pw-font-semibold">
                    {
                      'Tem certeza que deseja transferir para o seguinte destinatário?'
                    }
                  </p>{' '}
                  <p>
                    {
                      options?.find(
                        (res: any) => res.value === walletToTransfer
                      ).label
                    }
                    {transferInfo?.mode === 'walletSuggestions'
                      ? null
                      : `: ${walletToTransfer}`}
                  </p>
                </>
              )}
            </div>
          )}
          <div className="pw-flex pw-justify-center pw-gap-5 pw-mt-8">
            <BaseButton
              disabled={isLoading}
              onClick={() => {
                if (step === 1) onClose();
                else setStep(1);
              }}
              variant="outlined"
            >
              {'Cancelar'}
            </BaseButton>
            <BaseButton
              disabled={
                paymentAmount === '' || walletToTransfer === '' || isLoading
              }
              onClick={() => {
                if (step === 1) {
                  setStep(2);
                } else {
                  mutate(
                    {
                      to: walletToTransfer,
                      amount: String(paymentAmount),
                      from: wallet,
                      id: contractId,
                      description: options?.find(
                        (res: any) => res.value === walletToTransfer
                      ).label,
                    },
                    {
                      onSuccess() {
                        setStep(3);
                        setResult('success');
                      },
                      onError() {
                        setStep(3);
                        setResult('error');
                      },
                    }
                  );
                }
              }}
            >
              {'Transferir'}
            </BaseButton>
          </div>
        </>
      )}
    </ModalBase>
  );
};
