import { useState } from 'react';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useHasWallet } from '../hooks/useHasWallet';
import { useUserWallet } from '../hooks/useUserWallet/useUserWallet';
import { Alert } from './Alert';
import { ColumnDef, BaseTable } from './BaseTable';
import { BaseButton } from './Buttons';
import { ErrorBox } from './ErrorBox';
import { InternalPagesLayoutBase } from './InternalPagesLayoutBase';
import { Spinner } from './Spinner';
import TranslatableComponent from './TranslatableComponent';
import { useStakingSummary, useRedeemStaking, SummaryDto } from '../hooks/useStaking';
import useTranslation from '../hooks/useTranslation';


export const StakingSummary = () => {
  const [page, setPage] = useState(1);
  const [translate] = useTranslation();
  const { data, isLoading, error: errorStaking } = useStakingSummary({ page });
  const { loyaltyWallet } = useUserWallet();
  const coinSymbol = loyaltyWallet?.[0]?.currency;
  const {
    mutate,
    isPending: isLoadingRedeem,
    isSuccess,
    isError,
    error: errorRedeemStaking,
  } = useRedeemStaking();
  const columns = [
    {
      formatter: (row): React.JSX.Element => {
        return (
          <div>{coinSymbol + ' ' + parseFloat(row?.amount).toFixed(2)}</div>
        );
      },
      name: 'Quantidade',
      width: '100px',
    },
    {
      formatter: (row): React.JSX.Element => {
        return (
          <div>{format(new Date(row.createdAt), 'Pp', { locale: ptBR })}</div>
        );
      },
      name: 'Data de lançamento',
      width: '100px',
    },
    {
      formatter: (row): React.JSX.Element => {
        return (
          <div>
            {row.expiresAt
              ? format(new Date(row.expiresAt), 'Pp', { locale: ptBR })
              : '-'}
          </div>
        );
      },
      name: 'Data de expiração',
      width: '100px',
    },
    {
      formatter: (row): React.JSX.Element => {
        const value = () => {
          if (row.isExpired) return 'Expirado';
          else if (row.status !== 'deferred')
            return `Resgatado em ${format(new Date(row.executeAt), 'Pp', {
              locale: ptBR,
            })}`;
          else return 'Disponível';
        };
        return <div>{value()}</div>;
      },
      name: 'Situação',
      width: '100px',
    },
  ] satisfies ColumnDef<SummaryDto>[];
  useHasWallet({});

  return errorStaking ? (
    <ErrorBox customError={errorStaking} />
  ) : (
    <TranslatableComponent>
      <InternalPagesLayoutBase>
        <div className="pw-p-[20px] pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-text-black pw-shadow-md pw-rounded-lg pw-overflow-hidden">
          <div className="pw-mb-6">
            <p className="pw-text-[23px] pw-font-[600]">
              {translate('staking>summary>title')}
            </p>
            <p className="pw-text-[#777E8F] pw-text-xs">
              {translate('staking>summary>subtitle')}
            </p>
          </div>
          <div className="pw-flex pw-justify-start pw-gap-20 pw-items-center">
            {!isLoading ? (<div>
              <p className="pw-text-lg pw-mb-1">
                {translate('staking>summary>valueToRedeem')}{' '}
                {coinSymbol +
                  ' ' +
                  parseFloat(data?.data?.summary?.availableToRedeem).toFixed(2)}
              </p>
              <div className="pw-text-sm pw-mb-1">
                {parseFloat(data?.data?.summary?.delivering) > 0 ? (
                  <p>
                    {translate('staking>summary>deliverying')}{' '}
                    {coinSymbol +
                      ' ' +
                      parseFloat(data?.data?.summary?.delivering).toFixed(2)}
                  </p>
                ) : null}
              </div>
              <ErrorBox customError={errorRedeemStaking} />
              <BaseButton
                onClick={() => mutate()}
                disabled={
                  isLoadingRedeem ||
                  parseFloat(data?.data?.summary?.availableToRedeem) === 0
                }
              >
                {isLoadingRedeem ? (
                  <Spinner className="pw-h-6 pw-w-6" />
                ) : (
                  translate('staking>summary>redeem')
                )}
              </BaseButton>

              {isSuccess ? (
                <Alert className="pw-mt-3" variant="success">
                  {translate('staking>summary>success')}
                </Alert>
              ) : null}
              {isError ? (
                <Alert className="pw-mt-3" variant="error">
                  {translate('staking>summary>error')}
                </Alert>
              ) : null}
            </div>) : null}

          </div>
        </div>
        <div className="pw-p-[20px] pw-mt-8 pw-mx-[16px] pw-max-width-full sm:pw-mx-0 sm:pw-p-[24px] pw-pb-[32px] sm:pw-pb-[24px] pw-bg-white pw-shadow-md pw-rounded-lg pw-overflow-hidden">
          <BaseTable<SummaryDto>
            columns={columns}
            rows={data?.data?.items}
            isLoading={isLoading}
            pagination={{
              currentPage: data?.data?.meta?.currentPage,
              pagesQuantity: data?.data?.meta?.totalPages,
              onChangePage: setPage,
            }}
          />
        </div>
      </InternalPagesLayoutBase>
    </TranslatableComponent>
  );
};
