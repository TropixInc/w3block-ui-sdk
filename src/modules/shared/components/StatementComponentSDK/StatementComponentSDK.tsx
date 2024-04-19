/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { Disclosure } from '@headlessui/react';
import classNames from 'classnames';
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import { Grade, gradeMap } from '../../../custom';
import { ReceiptQRCode } from '../../../dashboard/components/ReceiptQRCode/ReceiptQRCode';
import ChevronDown from '../../../shared/assets/icons/arrowDown.svg?react';
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
  isAdmin?: boolean;
}

export const StatementComponentSDK = ({
  statement,
  future,
  isAdmin,
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
    if (!future) {
      if (
        statement?.loyaltieTransactions?.[0]?.metadata.action === 'split_payees'
      ) {
        return (
          <WjjcText metadata={statement?.loyaltieTransactions?.[0]?.metadata} />
        );
      }
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
        (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]
          ?.isFinalRecipient
      ) {
        return (
          <p>
            Crédito referente ao pagamento{' '}
            <button
              className="!pw-font-bold pw-underline"
              onClick={() => setOpenReceipt(true)}
            >
              #
              {
                (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]
                  ?.commerce?.deliverId
              }
            </button>{' '}
            para{' '}
            {
              (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]
                ?.operatorName
            }
          </p>
        );
      }
      if (
        (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]?.action ===
        'cashback_multilevel'
      ) {
        return (
          <p>
            Cashback no pagamento{' '}
            <button
              className="!pw-font-bold pw-underline"
              onClick={() => setOpenReceipt(true)}
            >
              #
              {
                (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]
                  ?.commerce?.deliverId
              }
            </button>{' '}
            para{' '}
            {
              (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]
                ?.operatorName
            }
          </p>
        );
      } else if (
        statement?.commerce &&
        statement?.request?.from ===
          '0x0000000000000000000000000000000000000000'
      ) {
        return (
          <p>
            Carga de Zuca para pagamento{' '}
            <button
              className="!pw-font-bold pw-underline"
              onClick={() => setOpenReceipt(true)}
            >
              #{statement?.commerce?.deliverId}
            </button>{' '}
            a {statement?.commerce?.destinationUserName}
          </p>
        );
      } else if (statement?.commerce) {
        return (
          <p>
            Pagamento{' '}
            <button
              className="!pw-font-bold pw-underline"
              onClick={() => setOpenReceipt(true)}
            >
              #{statement?.commerce?.deliverId}
            </button>{' '}
            no valor total de {statement?.commerce?.erc20PurchaseAmount} ZUCA
            para {statement?.commerce?.destinationUserName}
          </p>
        );
      } else
        return (
          (statement?.request?.metadata?.description ||
            statement?.metadata?.description) ??
          ''
        );
    } else return '';
  };

  const shareText = (metadata: any) => {
    if (metadata.action === 'split_payees') {
      if (metadata.commerce?.type === 'master')
        return 'Responsible Instructor’s Share';
      if (metadata.commerce?.type === 'academy') return 'Academy’s Share';
      if (metadata.commerce?.type === 'ambassador')
        return 'Responsible Instructor Ambassador’s Share';
      if (metadata.commerce?.type === 'ambassadorPool')
        return 'Ambassador’s Share';
      if (metadata.commerce?.type === 'grandMasterCouncil')
        return 'Council of Grand Masters Member’s Share';
    }
    return '';
  };

  const WjjcText = ({ metadata }: { metadata: any }) =>
    useMemo(() => {
      const supportText = () => {
        return (
          <>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="pw-flex pw-items-center pw-gap-3">
                    {shareText(metadata)} - {metadata?.commerce?.share}% * R$
                    {metadata?.commerce?.netValue} = R$
                    {statement?.pointsPrecision == 'integer'
                      ? statement?.amount?.toFixed(0)
                      : statement?.amount?.toFixed(2)}
                    <ChevronDown
                      className={classNames(
                        'pw-stroke-[#000000]',
                        open ? 'pw-rotate-180' : ''
                      )}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    <div className="pw-my-5">
                      <p>
                        <b>(a) Amount:</b> R$
                        {parseFloat(metadata?.commerce?.price).toFixed(2)}
                      </p>
                      <p>
                        <b>
                          (b) Tax Provisioning (-{' '}
                          {metadata?.commerce?.taxProvisioningFee || '14.25'}%):
                        </b>{' '}
                        -R${metadata?.commerce?.taxProvisioningFeeAmount}
                      </p>
                      <p>
                        <b>
                          (c) Payment Method Fee (-{' '}
                          {metadata?.commerce?.paymentMethodFee || '2.49'}%):
                        </b>{' '}
                        -R${metadata?.commerce?.paymentMethodFeeAmount}
                      </p>
                      <p className="pw-my-5">
                        <b>Net amount:</b> a + b + c = R$
                        {metadata?.commerce?.netValue}
                      </p>
                      <p>
                        {shareText(metadata)} - {metadata?.commerce?.share}% *{' '}
                        Net amount
                      </p>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </>
        );
      };

      if (metadata?.action === 'split_payees') {
        if (metadata?.commerce?.isAffiliation) {
          return (
            <div className="pw-text-black pw-text-xs pw-font-medium">
              <p>Affiliation - {metadata?.commerce?.athleteName}</p>
              {supportText()}
            </div>
          );
        }
        return (
          <div className="pw-text-black pw-text-xs pw-font-medium">
            <p>
              {gradeMap[metadata.commerce?.degree as Grade]}{' '}
              {metadata.commerce?.beltColor} Belt Certification -{' '}
              {metadata.commerce?.athleteName}
            </p>
            {supportText()}
          </div>
        );
      }
      return null;
    }, [metadata]);

  const [openReceipt, setOpenReceipt] = useState(false);
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
            statement?.metadata?.action === 'split_payees' ? (
              <WjjcText metadata={statement.metadata} />
            ) : (
              <p className="pw-text-black pw-text-xs pw-font-medium">
                Comprador: {statement?.buyerName}
              </p>
            )
          ) : (
            <>
              <p className="pw-text-[#777E8F] pw-text-xs pw-font-medium">
                tx: {statement?.txHash?.substring(0, 6)}
                {'...'}
                {statement?.txHash?.substring(
                  statement?.txHash?.length - 4,
                  statement?.txHash?.length
                )}
              </p>
              <button onClick={handleCopy}>
                <CopyIcon className="pw-stroke-[#777E8F] pw-w-[13px] pw-h-[13px]" />
              </button>
            </>
          )}
        </div>
        {future && statement?.metadata?.operatorName && isAdmin ? (
          <div className="pw-flex pw-items-center pw-gap-2">
            <p className="pw-text-black pw-text-xs pw-font-medium">
              Para: {statement?.metadata?.operatorName}
            </p>
          </div>
        ) : null}
        {isCopied && (
          <span className="pw-absolute pw-right-3 pw-top-5 pw-bg-[#E6E8EC] pw-py-1 pw-px-2 pw-rounded-md">
            Copiado!
          </span>
        )}
        {future ? (
          <>
            {statement?.metadata?.commerce?.deliverId ? (
              <div className="pw-flex pw-items-center pw-gap-2">
                <p className="pw-text-black pw-text-xs pw-font-medium">
                  Compra: {statement?.metadata?.commerce?.deliverId}
                </p>
              </div>
            ) : null}
            {statement?.metadata?.amount ? (
              <div className="pw-flex pw-items-center pw-gap-2">
                <p className="pw-text-black pw-text-xs pw-font-medium">
                  Valor pago: R$
                  {parseFloat(statement?.metadata?.amount).toFixed(2)}
                </p>
              </div>
            ) : null}
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
          </>
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
        <div className="pw-text-left pw-text-zinc-700 pw-text-xs pw-font-medium pw-max-w-[300px] pw-mt-1">
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
        {statement?.metadata?.commerce?.action !== 'split_payees' &&
          statement?.loyaltieTransactions?.map(
            (loyaltieTransaction) =>
              loyaltieTransaction.metadata.action !== 'split_payees' && (
                <div
                  key={generateRandomUUID()}
                  className="pw-text-right pw-text-zinc-700 pw-text-xs pw-font-medium pw-max-w-[300px] pw-truncate pw-mb-1"
                >
                  {loyaltieTransaction?.metadata?.description}
                </div>
              )
          )}
        <div></div>
      </div>
      <ReceiptQRCode
        deliverId={
          (statement?.loyaltieTransactions?.[0]?.metadata as any)?.[0]?.commerce
            ?.deliverId
        }
        isOpen={openReceipt}
        onClose={() => setOpenReceipt(false)}
      />
    </div>
  );
};
