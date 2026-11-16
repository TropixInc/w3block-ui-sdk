/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { Spinner } from '../../shared/components/Spinner';
import { useLocale } from '../../shared/hooks/useLocale';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useGetSpecificWithdraw } from '../hooks/useRequestWithdraw';
import useTranslation from '../../shared/hooks/useTranslation';

type Status =
  | 'pending'
  | 'escrowing_resources'
  | 'ready_to_transfer_funds'
  | 'concluded'
  | 'failed'
  | 'refused';

const statusStyleMap: Record<Status, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pendente', bg: 'pw-bg-yellow-100', text: 'pw-text-yellow-800' },
  escrowing_resources: { label: 'Pendente', bg: 'pw-bg-yellow-100', text: 'pw-text-yellow-800' },
  ready_to_transfer_funds: { label: 'Pendente', bg: 'pw-bg-yellow-100', text: 'pw-text-yellow-800' },
  concluded: { label: 'Concluído', bg: 'pw-bg-green-100', text: 'pw-text-green-800' },
  failed: { label: 'Falha', bg: 'pw-bg-red-100', text: 'pw-text-red-800' },
  refused: { label: 'Recusado', bg: 'pw-bg-red-100', text: 'pw-text-red-800' },
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
  const { data, isFetching } = useGetSpecificWithdraw(id);
  const [translate] = useTranslation();

  const status = data?.data?.status as Status;
  const statusStyle = statusStyleMap[status] ?? statusStyleMap.pending;

  return (
    <div className="pw-p-6">
      <button
        className="pw-flex pw-items-center pw-gap-1 pw-text-sm pw-text-[#555] hover:pw-text-black pw-mb-4 pw-transition-colors"
        onClick={() => router.push('/withdraws')}
      >
        <span className="pw-text-lg">&#8592;</span> {translate('shared>back')}
      </button>
      {isFetching ? (
        <div className="pw-mt-20 pw-w-full pw-flex pw-items-center pw-justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="pw-grid pw-grid-cols-1 sm:pw-grid-cols-2 pw-gap-5 pw-mt-2">
            <div className="pw-flex pw-flex-col pw-gap-1">
              <p className="pw-text-xs pw-font-semibold pw-text-[#777] pw-uppercase pw-tracking-wide">
                {translate('auth>withdrawAdminActions>requestMade')}
              </p>
              <p className="pw-text-sm pw-text-black">
                {format(
                  new Date(data?.data?.createdAt ?? Date.now()),
                  'PPpp',
                  { locale: locale === 'pt-BR' ? ptBR : enUS }
                )}
              </p>
            </div>
            <div className="pw-flex pw-flex-col pw-gap-1">
              <p className="pw-text-xs pw-font-semibold pw-text-[#777] pw-uppercase pw-tracking-wide">
                {translate('pass>sharedOrder>value')}
              </p>
              <p className="pw-text-base pw-font-semibold pw-text-black">
                {parseFloat(data?.data?.amount).toFixed(2)} {currency}
              </p>
            </div>
            <div className="pw-flex pw-flex-col pw-gap-1">
              <p className="pw-text-xs pw-font-semibold pw-text-[#777] pw-uppercase pw-tracking-wide">
                {translate('token>pass>status')}
              </p>
              <div>
                <span className={`pw-inline-flex pw-items-center pw-px-3 pw-py-1 pw-rounded-full pw-text-xs pw-font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                  {statusStyle.label}
                </span>
              </div>
            </div>
            {data?.data?.status === 'refused' && data?.data?.reason ? (
              <div className="sm:pw-col-span-2 pw-flex pw-flex-col pw-gap-1">
                <p className="pw-text-xs pw-font-semibold pw-text-[#777] pw-uppercase pw-tracking-wide">
                  {translate('key>kycActionsModal>resons')}
                </p>
                <p className="pw-text-sm pw-text-red-600">{data?.data?.reason}</p>
              </div>
            ) : null}
            {data?.data?.receiptAsset?.directLink ? (
              <div className="sm:pw-col-span-2 pw-flex pw-flex-col pw-gap-1">
                <p className="pw-text-xs pw-font-semibold pw-text-[#777] pw-uppercase pw-tracking-wide">
                  {translate('auth>withdrawAdminActions>proof')}
                </p>
                <a
                  href={data?.data?.receiptAsset?.directLink}
                  target="_blank"
                  rel="noreferrer"
                  className="pw-text-sm pw-text-[#0050FF] pw-underline hover:pw-text-[#0034A3] pw-transition-colors"
                >
                  {translate('auth>withdrawAdminActions>viewReceipt')}
                </a>
              </div>
            ) : null}
          </div>
          {status === 'escrowing_resources' ||
            status === 'ready_to_transfer_funds' ? (
            <div className="pw-flex pw-justify-center pw-items-center pw-mt-6 pw-p-4 pw-bg-yellow-50 pw-rounded-lg">
              <p className="pw-text-sm pw-font-medium pw-text-yellow-700">
                {translate('auth>withdrawAdminActions>pleaseWaitHoldFunds')}
              </p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default WithdrawInternal;
