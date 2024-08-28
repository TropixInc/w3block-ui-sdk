/* eslint-disable i18next/no-literal-string */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { Disclosure } from '@headlessui/react';
import classNames from 'classnames';
import { format, getTime } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import { Grade, gradeMap } from '../../../custom';
import { ReceiptQRCode } from '../../../dashboard/components/ReceiptQRCode/ReceiptQRCode';
import ChevronDown from '../../../shared/assets/icons/arrowDown.svg?react';
import PendingIcon from '../../../shared/assets/icons/clock.svg?react';
import CopyIcon from '../../../shared/assets/icons/copyIconOutlined.svg?react';
import RejectIcon from '../../../shared/assets/icons/minusCircle.svg?react';
import ApprovedIcon from '../../../shared/assets/icons/plusCircle.svg?react';
import { useLocale } from '../../../shared/hooks/useLocale';
import useTranslation from '../../../shared/hooks/useTranslation';
import { Erc20ActionStatus } from '../../../shared/interface/Statement/Statement';
import {
  StatementScreenTransaction,
  StatementScreenTransactionType,
} from '../../../shared/utils/getSubtransactions';

interface StatementComponentProps {
  statement: StatementScreenTransaction;
  currency: string;
}

export const StatementComponent = ({
  statement,
  currency,
}: StatementComponentProps) => {
  const locale = useLocale();
  const [state, copyToClipboard] = useCopyToClipboard();
  const [translate] = useTranslation();
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    copyToClipboard(statement?.hash ?? '');
    if (!state.error) setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const getStatementColorAndIcon = () => {
    if (statement?.type == StatementScreenTransactionType.RECEIVING) {
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
    if (statement?.description === 'split_payees') {
      return <WjjcText metadata={statement.metadata} />;
    }
    if (statement?.description === 'comission') {
      return 'Comissão por pagamento de indicado';
    }
    if (statement?.description === 'final_recipient') {
      return (
        <p>
          {translate('dashboard>statementComponent>creditReferPayment')}{' '}
          <button
            className="!pw-font-bold pw-underline"
            onClick={() => setOpenReceipt(true)}
          >
            #{statement.deliveryId}
          </button>{' '}
          {translate('dashboard>statementComponent>for')}{' '}
          {statement.operatorName}
        </p>
      );
    }
    if (statement?.description === 'cashback') {
      return (
        <p>
          {translate('dashboard>statementComponent>cashbackInPayment')}{' '}
          <button
            className="!pw-font-bold pw-underline"
            onClick={() => setOpenReceipt(true)}
          >
            #{statement.deliveryId}
          </button>{' '}
          {translate('dashboard>statementComponent>for')}{' '}
          {statement.operatorName}
        </p>
      );
    } else if (statement?.description === 'credit_purchase') {
      return (
        <p>
          {translate('dashboard>statementComponent>loadZucaPayment')}{' '}
          <button
            className="!pw-font-bold pw-underline"
            onClick={() => setOpenReceipt(true)}
          >
            #{statement?.metadata?.commerce?.deliverId}
          </button>{' '}
          {translate('dashboard>statementComponent>for')}{' '}
          {statement?.metadata?.commerce?.destinationUserName}
        </p>
      );
    } else if (statement?.description === 'payment') {
      return (
        <p>
          {translate('checkout>components>checkoutInfo>payment')}{' '}
          <button
            className="!pw-font-bold pw-underline"
            onClick={() => setOpenReceipt(true)}
          >
            #{statement?.metadata?.commerce?.deliverId}
          </button>{' '}
          {translate('dashboard>statementComponent>inTotalValue')}{' '}
          {statement?.metadata?.commerce?.erc20PurchaseAmount} ZUCA{' '}
          {translate('dashboard>statementComponent>for')}{' '}
          {statement?.metadata?.commerce?.destinationUserName}
        </p>
      );
    } else return statement?.description ?? '';
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
                    {parseFloat(statement?.value).toFixed(2)}
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

  const showScheduledAt = () => {
    const diferenca = Math.abs(
      getTime(Date.parse(statement.scheduledAt ?? '')) -
        Date.parse(statement.createdAt ?? '')
    );
    const horas = diferenca / (1000 * 60 * 60);

    return horas > 1;
  };
  return (
    <div className="pw-p-[28px] pw-bg-white pw-rounded-[14px] pw-shadow pw-flex pw-justify-between">
      <div className="pw-flex pw-flex-col pw-items-start">
        <div className="pw-flex pw-items-center pw-gap-2">
          {getStatementColorAndIcon().icon}
          <p
            className={`pw-text-sm pw-font-semibold ${
              getStatementColorAndIcon().color
            }`}
          >
            {getStatementColorAndIcon().text}
          </p>
        </div>
        <div className="pw-flex pw-items-center pw-gap-2">
          <p className="pw-text-[#777E8F] pw-text-xs pw-font-medium">
            tx: {statement?.hash?.substring(0, 6)}
            {'...'}
            {statement?.hash?.substring(
              statement?.hash?.length - 4,
              statement?.hash?.length
            )}
          </p>
          <button onClick={handleCopy}>
            <CopyIcon className="pw-stroke-[#777E8F] pw-w-[13px] pw-h-[13px]" />
          </button>
        </div>
        {isCopied && (
          <span className="pw-absolute pw-right-3 pw-top-5 pw-bg-[#E6E8EC] pw-py-1 pw-px-2 pw-rounded-md">
            {translate('components>menu>copied')}
          </span>
        )}
        <div>
          <span className="pw-text-black pw-text-sm pw-font-semibold">
            {statement?.type == StatementScreenTransactionType.RECEIVING
              ? '+'
              : '-'}{' '}
            {statement?.value}{' '}
          </span>
          <span className="pw-text-black pw-text-[13px] pw-font-normal">
            {currency}
          </span>
        </div>
        <div className="pw-text-left pw-text-zinc-700 pw-text-xs pw-font-medium pw-max-w-[500px] pw-mt-1">
          {subtext()}
        </div>
      </div>
      <div className="pw-flex pw-flex-col pw-items-end">
        <div className="pw-text-right pw-text-zinc-700 pw-text-xs pw-font-bold">
          {' '}
          {statement?.createdAt
            ? format(Date.parse(statement?.createdAt ?? Date.now()), 'PPpp', {
                locale: locale === 'pt-BR' ? ptBR : enUS,
              })
            : null}
        </div>
        {showScheduledAt() ? (
          <div className="pw-text-right pw-text-zinc-700 pw-text-xs">
            {translate('dashboard>statementComponent>scheduledOn')}:{' '}
            {statement?.scheduledAt
              ? format(
                  Date.parse(statement?.scheduledAt ?? Date.now()),
                  'PPpp',
                  {
                    locale: locale === 'pt-BR' ? ptBR : enUS,
                  }
                )
              : null}
          </div>
        ) : null}
      </div>
      <ReceiptQRCode
        deliverId={statement?.deliveryId}
        isOpen={openReceipt}
        onClose={() => setOpenReceipt(false)}
      />
    </div>
  );
};
