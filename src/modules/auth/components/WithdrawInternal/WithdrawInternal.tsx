/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import { useRouterConnect } from '../../../shared';
import { Spinner } from '../../../shared/components/Spinner';
import { useLocale } from '../../../shared/hooks/useLocale';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useGetSpecificWithdraw } from '../../hooks/useRequestWithdraw';

type Status =
  | 'pending'
  | 'escrowing_resources'
  | 'ready_to_transfer_funds'
  | 'concluded'
  | 'failed'
  | 'refused';

const statusMapping = {
  pending: 'Pendente',
  escrowing_resources: 'Pendente',
  ready_to_transfer_funds: 'Pendente',
  concluded: 'Concluído',
  failed: 'Falha',
  refused: 'Recusado',
};

const WithdrawInternal = ({
  id,
  currency,
}: {
  id: string;
  currency: string;
}) => {
  const router = useRouterConnect();
  const locale = useLocale();
  const { data, isLoading } = useGetSpecificWithdraw(id);
  const [translate] = useTranslation();

  return (
    <div className="pw-p-[40px]">
      <>
        <button
          className="pw-max-w-[120px] pw-h-[30px] pw-w-full !pw-text-base !pw-py-0 pw-text-black pw-text-start"
          onClick={() => router.push('/withdraws')}
        >
          {`<`} {translate('shared>back')}
        </button>
        {isLoading ? (
          <div className="pw-mt-20 pw-w-full pw-flex pw-items-center pw-justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="pw-text-black pw-flex pw-flex-col pw-justify-between pw-gap-4 pw-mt-4">
              <div>
                <p className="pw-font-semibold">
                  {translate('auth>withdrawAdminActions>requestMade')}
                </p>
                <p>
                  {format(
                    new Date(data?.data?.createdAt ?? Date.now()),
                    'PPpp',
                    {
                      locale: locale === 'pt-BR' ? ptBR : enUS,
                    }
                  )}
                </p>
              </div>
              <div>
                <p className="pw-font-semibold">
                  {translate('pass>sharedOrder>value')}
                </p>
                <p>
                  {parseFloat(data?.data?.amount).toFixed(2)} {currency}
                </p>
              </div>
              <div>
                <p className="pw-font-semibold">
                  {translate('token>pass>status')}
                </p>
                <p>{statusMapping[data?.data?.status as Status]}</p>
              </div>
              {data?.data?.status === 'refused' ? (
                <div>
                  <p className="pw-font-semibold">
                    {translate('key>kycActionsModal>resons')}:
                  </p>
                  <p>{data?.data?.reason}</p>
                </div>
              ) : null}
              {data?.data?.receiptAsset?.directLink ? (
                <div>
                  <a
                    href={data?.data?.receiptAsset?.directLink}
                    target="_blank"
                    rel="noreferrer"
                    className="pw-font-semibold pw-underline"
                  >
                    {translate('auth>withdrawAdminActions>proof')}
                  </a>
                </div>
              ) : null}
            </div>
            {data?.data?.status === 'escrowing_resources' ||
            data?.data?.status === 'ready_to_transfer_funds' ? (
              <div className="pw-flex pw-justify-center pw-items-center pw-text-black pw-mt-5">
                <p className="pw-font-semibold">
                  {translate('auth>withdrawAdminActions>pleaseWaitHoldFunds')}
                </p>
              </div>
            ) : null}
          </>
        )}
      </>
    </div>
  );
};

export default WithdrawInternal;
