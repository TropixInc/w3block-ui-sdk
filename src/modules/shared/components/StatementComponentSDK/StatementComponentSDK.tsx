import PendingIcon from '../../assets/icons/clock.svg?react';
// import  CopyIcon  from '../../assets/icons/copy.svg?react';
import RejectIcon from '../../assets/icons/minusCircle.svg?react';
import ApprovedIcon from '../../assets/icons/plusCircle.svg?react';
import {
  Erc20ActionStatus,
  Statement,
} from '../../interface/Statement/Statement';
import { generateRandomUUID } from '../../utils/generateRamdomUUID';

interface StatementComponentSDKProps {
  statement: Statement;
}

export const StatementComponentSDK = ({
  statement,
}: StatementComponentSDKProps) => {
  const getStatementColorAndIcon = () => {
    if (statement.transactionType == 'receiving') {
      if (statement.status == Erc20ActionStatus.SUCCESS) {
        return {
          color: 'pw-text-blue-800',
          icon: (
            <ApprovedIcon className="pw-stroke-blue-800 pw-w-[16px] pw-h-[16px]" />
          ),
          text: 'Crédito',
        };
      } else {
        return {
          color: 'pw-text-orange-600',
          icon: (
            <PendingIcon className="pw-stroke-orange-600 pw-w-[16px] pw-h-[16px]" />
          ),
          text: 'Crédito',
        };
      }
    } else {
      if (statement.status == Erc20ActionStatus.SUCCESS) {
        return {
          color: 'pw-stroke-rose-500',
          icon: (
            <RejectIcon className="pw-stroke-rose-500 pw-w-[16px] pw-h-[16px]" />
          ),
          text: 'Débito',
        };
      } else {
        return {
          color: 'pw-text-orange-600',
          icon: (
            <RejectIcon className="pw-stroke-orange-600 pw-w-[16px] pw-h-[16px]" />
          ),
          text: 'Débito',
        };
      }
    }
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
          <p className="pw-text-black pw-text-xs pw-font-medium">
            ID: {statement.id}
          </p>
          {/* <CopyIcon className="pw-fill-blue-800 pw-w-[13px] pw-h-[13px]" /> */}
        </div>
        <div>
          <span className="pw-text-black pw-text-sm pw-font-semibold">
            {statement.transactionType == 'sending' ? '-' : '+'}{' '}
            {statement.pointsPrecision == 'integer'
              ? statement.amount.toFixed(0)
              : statement.amount.toFixed(2)}{' '}
          </span>
          <span className="pw-text-black pw-text-[13px] pw-font-normal">
            {statement.currency}
          </span>
        </div>
      </div>
      <div className="pw-flex pw-flex-col pw-items-end">
        <div className="pw-text-right pw-text-zinc-700 pw-text-xs pw-font-bold">
          {' '}
          {new Date(statement.createdAt).toDateString()}
        </div>
        <div className="pw-mt-2"></div>
        {statement.loyaltieTransactions?.map((loyaltieTransaction) => (
          <div
            key={generateRandomUUID()}
            className="pw-text-right pw-text-zinc-700 pw-text-xs pw-font-medium pw-max-w-[300px] pw-truncate-2 pw-mb-1"
          >
            {loyaltieTransaction.metadata.description}
          </div>
        ))}
        <div></div>
      </div>
    </div>
  );
};
