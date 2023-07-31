import { ReactComponent as PendingIcon } from '../../assets/icons/clock.svg';
import { ReactComponent as CopyIcon } from '../../assets/icons/copy.svg';
import { ReactComponent as RejectIcon } from '../../assets/icons/minusCircle.svg';
import { ReactComponent as ApprovedIcon } from '../../assets/icons/plusCircle.svg';
import {
  Statement,
  StatementStatusType,
} from '../../interface/Statement/Statement';

interface StatementComponentSDKProps {
  statement: Statement;
}

export const StatementComponentSDK = ({
  statement,
}: StatementComponentSDKProps) => {
  const getStatementColorAndIcon = () => {
    switch (statement.type) {
      case StatementStatusType.APPROVED:
        return {
          color: 'pw-text-blue-800',
          icon: (
            <ApprovedIcon className="pw-stroke-blue-800 pw-w-[16px] pw-h-[16px]" />
          ),
          text: 'Crédito',
        };
      case StatementStatusType.PENDING:
        return {
          color: 'pw-text-orange-600',
          icon: (
            <PendingIcon className="pw-stroke-orange-600 pw-w-[16px] pw-h-[16px]" />
          ),
          text: 'Crédito',
        };
      default:
        return {
          color: 'pw-text-rose-500',
          icon: (
            <RejectIcon className="pw-stroke-rose-500 pw-w-[16px] pw-h-[16px]" />
          ),
          text: 'Débito',
        };
    }
  };
  return (
    <div className="pw-p-[28px] pw-bg-white pw-rounded-[14px] pw-shadow pw-flex pw-items- pw-justify-between">
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
          <CopyIcon className="pw-fill-blue-800 pw-w-[13px] pw-h-[13px]" />
        </div>
        <div>
          <span className="pw-text-black pw-text-sm pw-font-semibold">
            {statement.type == StatementStatusType.REJECTED ? '-' : '+'} 10{' '}
          </span>
          <span className="pw-text-black pw-text-[13px] pw-font-normal">
            coins
          </span>
        </div>
      </div>
      <div className="pw-flex pw-flex-col pw-items-end">
        <div className="pw-text-right pw-text-zinc-700 pw-text-xs pw-font-bold">
          {' '}
          {new Date(statement.createdAt).toDateString()}
        </div>
        <div className="pw-text-right pw-text-zinc-700 pw-text-xs pw-font-medium pw-max-w-[300px] pw-truncate-2">
          {statement.description}
        </div>
      </div>
    </div>
  );
};
