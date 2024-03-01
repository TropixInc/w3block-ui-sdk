/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import PendingIcon from '../../assets/icons/clock.svg?react';
import CopyIcon from '../../assets/icons/copyIconOutlined.svg?react';
import RejectIcon from '../../assets/icons/minusCircle.svg?react';
import ApprovedIcon from '../../assets/icons/plusCircle.svg?react';
import { useLocale } from '../../hooks/useLocale';
import {
  Erc20ActionStatus,
  Statement,
} from '../../interface/Statement/Statement';
import { generateRandomUUID } from '../../utils/generateRamdomUUID';

interface StatementComponentSDKProps {
  statement: Statement;
  future?: boolean;
}

export const StatementComponentSDK = ({
  statement,
  future,
}: StatementComponentSDKProps) => {
  const locale = useLocale();
  const [state, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    copyToClipboard(statement?.txHash ?? '');
    if (!state.error) setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const getStatementColorAndIcon = () => {
    if (statement?.transactionType == 'receiving') {
      if (
        statement?.status == Erc20ActionStatus.SUCCESS ||
        statement?.status == Erc20ActionStatus.EXTERNAL
      ) {
        return {
          color: 'pw-text-blue-800',
          icon: (
            <ApprovedIcon className="pw-stroke-blue-800 pw-w-[16px] pw-h-[16px]" />
          ),
          text: 'Carga',
        };
      } else {
        return {
          color: 'pw-text-blue-800',
          icon: (
            <PendingIcon className="pw-stroke-blue-800 pw-w-[16px] pw-h-[16px]" />
          ),
          text: 'Carga',
        };
      }
    } else {
      if (statement?.status == Erc20ActionStatus.SUCCESS) {
        return {
          color: 'pw-text-rose-500',
          icon: (
            <RejectIcon className="pw-stroke-rose-500 pw-w-[16px] pw-h-[16px]" />
          ),
          text: 'Uso',
        };
      } else {
        return {
          color: 'pw-text-rose-500',
          icon: (
            <RejectIcon className="pw-stroke-rose-500 pw-w-[16px] pw-h-[16px]" />
          ),
          text: 'Uso',
        };
      }
    }
  };
  const subtext = () => {
    if (
      (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]?.action ===
        'cashback_multilevel' &&
      ((statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]
        ?.indirectCashbackLevel == 1 ||
        (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]
          ?.indirectCashbackLevel > 1)
    ) {
      return 'Comissão por pagamento de indicado';
    }
    if (
      (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]?.action ===
      'cashback_multilevel'
    ) {
      return (
        <p>
          Cashback no{' '}
          <a
            className="!pw-font-bold"
            href={`/profile/orders?orderId=${
              (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]
                ?.commerce?.orderId
            }`}
          >
            pagamento #
            {
              (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]
                ?.commerce?.deliverId
            }
          </a>{' '}
          para{' '}
          {
            (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]
              ?.operatorName
          }
        </p>
      );
    } else if (
      statement?.commerce &&
      statement?.request?.from === '0x0000000000000000000000000000000000000000'
    ) {
      return (
        <p>
          Carga de Zuca para{' '}
          <a
            className="!pw-font-bold"
            href={`/profile/orders?orderId=${statement?.commerce?.orderId}`}
          >
            pagamento #{statement?.commerce?.deliverId}
          </a>{' '}
          a {statement?.commerce?.destinationUserName}
        </p>
      );
    } else if (statement?.commerce) {
      return (
        <p>
          <a
            className="!pw-font-bold"
            href={`/profile/orders?orderId=${statement?.commerce?.orderId}`}
          >
            Pagamento #{statement?.commerce?.deliverId}
          </a>{' '}
          no valor total de {statement?.commerce?.erc20PurchaseAmount} ZUCA para{' '}
          {statement?.commerce?.destinationUserName}
        </p>
      );
    } else
      return (
        (statement?.request?.metadata?.description ||
          statement?.metadata?.description) ??
        ''
      );
  };
  return (
    <div className="pw-p-[28px] pw-bg-white pw-rounded-[14px] pw-shadow pw-flex pw-justify-between">
      <div className="pw-flex pw-flex-col pw-items-start">
        <div className="pw-flex pw-items-center pw-gap-2">
          {future ? (
            <>
              <p className="pw-text-sm pw-font-semibold pw-text-black">
                Recibo de pagamento {statement?.deliverId}
              </p>
            </>
          ) : (
            <>
              {getStatementColorAndIcon().icon}
              <p
                className={`pw-text-sm pw-font-semibold ${
                  getStatementColorAndIcon().color
                }`}
              >
                {getStatementColorAndIcon().text}
              </p>
            </>
          )}
        </div>
        <div className="pw-flex pw-items-center pw-gap-2">
          {future ? (
            <p className="pw-text-black pw-text-xs pw-font-medium">
              Comprador: {statement?.buyerName}
            </p>
          ) : (
            <p className="pw-text-[#777E8F] pw-text-xs pw-font-medium">
              tx: {statement?.txHash?.substring(0, 6)}
              {'...'}
              {statement?.txHash?.substring(
                statement?.txHash?.length - 4,
                statement?.txHash?.length
              )}
            </p>
          )}
          <button onClick={handleCopy}>
            <CopyIcon className="pw-stroke-[#777E8F] pw-w-[13px] pw-h-[13px]" />
          </button>
        </div>
        {isCopied && (
          <span className="pw-absolute pw-right-3 pw-top-5 pw-bg-[#E6E8EC] pw-py-1 pw-px-2 pw-rounded-md">
            Copiado!
          </span>
        )}
        {future ? (
          <div className="pw-flex pw-items-center pw-gap-2">
            <p className="pw-text-black pw-text-xs pw-font-medium">
              {statement?.executeAt
                ? 'Recebimento previsto para: ' +
                  format(new Date(statement?.executeAt), 'PPP', {
                    locale: locale === 'pt-BR' ? ptBR : enUS,
                  })
                : null}
            </p>
          </div>
        ) : null}
        <div>
          <span className="pw-text-black pw-text-sm pw-font-semibold">
            {statement?.transactionType == 'sending' ? '-' : '+'}{' '}
            {statement?.pointsPrecision == 'integer'
              ? statement?.amount?.toFixed(0)
              : statement?.amount?.toFixed(2)}{' '}
          </span>
          <span className="pw-text-black pw-text-[13px] pw-font-normal">
            {statement?.currency}
          </span>
        </div>
        <div className="pw-text-left pw-text-zinc-700 pw-text-xs pw-font-medium pw-max-w-[300px] pw-truncate-2 pw-mt-1">
          {subtext()}
        </div>
      </div>
      <div className="pw-flex pw-flex-col pw-items-end">
        <div className="pw-text-right pw-text-zinc-700 pw-text-xs pw-font-bold">
          {' '}
          {statement?.createdAt
            ? format(new Date(statement?.createdAt ?? Date.now()), 'PPpp', {
                locale: locale === 'pt-BR' ? ptBR : enUS,
              })
            : null}
        </div>
        <div className="pw-mt-2"></div>
        {statement?.loyaltieTransactions?.map((loyaltieTransaction) => (
          <div
            key={generateRandomUUID()}
            className="pw-text-right pw-text-zinc-700 pw-text-xs pw-font-medium pw-max-w-[300px] pw-truncate-2 pw-mb-1"
          >
            {loyaltieTransaction?.metadata?.description}
          </div>
        ))}
        <div></div>
      </div>
    </div>
  );
};
