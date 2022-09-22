import { useEffect, useState } from 'react';
import { useToggle } from 'react-use';

import classNames from 'classnames';
import { format } from 'date-fns';

import { ReactComponent as ArrowIcon } from '../../../shared/assets/icons/arrowOutlined.svg';
import { ReactComponent as EthIcon } from '../../../shared/assets/icons/Eth.svg';
import { ReactComponent as ExternalLinkIcon } from '../../../shared/assets/icons/externalLink.svg';
import { ReactComponent as MaticIcon } from '../../../shared/assets/icons/maticFilled.svg';
import Skeleton from '../../../shared/components/Skeleton/Skeleton';
import useTranslation from '../../../shared/hooks/useTranslation';

type typeCoin = 'ETH' | 'Polygon';

interface iExtract {
  id: string;
  cashIn: boolean;
  walletIn: string;
  walletOut: string;
  matic: string;
  value: string;
  transactionDate: string;
  type: typeCoin;
}
const extractData: iExtract[] = [
  {
    id: '1',
    cashIn: true,
    walletIn: '0x4f47a2218ee5c786943f1476a6b75624b3a7eee0',
    walletOut: '0x4f47a2218ee5c786943f1476a6b75624b3a7eee0',
    matic: '0.002',
    value: '5500',
    transactionDate: '01/01/2022',
    type: 'ETH',
  },
  {
    id: '2',
    cashIn: false,
    walletIn: '0x4f47a2218ee5c786943f1476a6b75624b3a7eee0',
    walletOut: '0x4f47a2218ee5c786943f1476a6b75624b3a7eee0',
    matic: '0.00023',
    value: '5500',
    transactionDate: '01/01/2022',
    type: 'Polygon',
  },
  {
    id: '3',
    cashIn: false,
    walletIn: '0x4f47a2218ee5c786943f1476a6b75624b3a7eee0',
    walletOut: '0x4f47a2218ee5c786943f1476a6b75624b3a7eee0',
    matic: '0.000048',
    value: '5000',
    transactionDate: '01/01/2022',
    type: 'ETH',
  },
  {
    id: '4',
    cashIn: false,
    walletIn: '0x4f47a2218ee5c786943f1476a6b75624b3a7eee0',
    walletOut: '0x4f47a2218ee5c786943f1476a6b75624b3a7eee0',
    matic: '0.00023',
    value: '5000',
    transactionDate: '01/01/2022',
    type: 'Polygon',
  },
];

export const WalletExtract = () => {
  const [type, toggleType] = useToggle(false);
  const [filteredData, setFilteredData] = useState<iExtract[]>([]);
  const [translate] = useTranslation();

  useEffect(() => {
    const filter = type ? 'ETH' : 'Polygon';
    const filtered = extractData.filter((e) => e.type === filter);
    setFilteredData(filtered);
  }, [type]);
  return (
    <>
      <div className="pw-flex pw-justify-between pw-text-[#777E8F] pw-font-bold pw-text-[18px] pw-leading-[23px] pw-my-[30px]">
        {translate('wallet>page>extract')}
        <div
          className="pw-bg-white pw-border pw-border-[#E6E8EC] pw-rounded-full pw-flex pw-flex-nowrap pw-gap-1 pw-p-1 pw-items-center pw-justify-center pw-cursor-pointer"
          onClick={toggleType}
        >
          <EthIcon />
          <div
            className={classNames(
              'pw-rounded-full pw-w-[48px] pw-bg-[#E6E8EC] pw-flex pw-p-[2px]',
              type ? 'pw-justify-start' : 'pw-justify-end'
            )}
          >
            <div className="pw-rounded-full pw-w-[19px] pw-h-[19px] pw-bg-[#B09C60]"></div>
          </div>
          <MaticIcon className="pw-fill-[#8247E5]" />
        </div>
      </div>
      <div className="pw-flex pw-flex-col pw-gap-2">
        {filteredData.map((e) => (
          <ExtractItem
            key={e.id}
            cashIn={e.cashIn}
            transactionDate={new Date(e.transactionDate)}
            matic={e.matic}
            value={e.value}
            walletIn={e.walletIn}
            walletOut={e.walletOut}
            type={e.type}
          />
        ))}
      </div>
    </>
  );
};

const ExtractItem = ({
  type,
  cashIn,
  walletIn,
  walletOut,
  matic,
  value,
  transactionDate,
}: {
  type: typeCoin;
  cashIn: boolean;
  walletIn: string;
  walletOut: string;
  matic: string;
  value: string;
  transactionDate: Date;
}) => {
  const [translate] = useTranslation();
  return (
    <div className="pw-shadow-[0px_4px_15px_rgba(0,0,0,0.15)] pw-rounded-[8px] pw-border pw-border-[#E6E8EC] pw-bg-white pw-flex pw-gap-[68.6px] pw-items-center pw-py-[9px] pw-pl-[16px] pw-pr-[28px] text-[#777E8F]">
      <div className="pw-flex pw-flex-col sm:pw-flex-row sm:pw-gap-[68.6px]">
        <div className="pw-flex pw-gap-[9px] pw-text-[13px] pw-leading-[13px] pw-font-semibold pw-min-w-[90px]">
          <ArrowIcon
            className={classNames(
              'pw-stroke-[#353945]',
              cashIn ? '' : 'pw-rotate-180'
            )}
          />
          {cashIn ? 'Cash In' : 'Cash Out'}
        </div>
        <div className="pw-flex pw-flex-row pw-gap-1 sm:pw-gap-0 sm:pw-flex-col pw-items-start pw-justify-start sm:pw-justify-center">
          <span className="pw-text-[12px] sm:pw-text-[13px] pw-leading-[15px] sm:pw-leading-[19.5px] pw-font-medium">
            {translate('wallet>page>from')}
          </span>
          <span className="pw-text-[12px] sm:pw-text-[15px] pw-leading-[15px] sm:pw-leading-[22.5px] pw-font-semibold">
            {walletOut.substring(0, 10)}...
          </span>
        </div>
        <div className="pw-flex pw-flex-row pw-gap-1 sm:pw-gap-0 sm:pw-flex-col pw-items-start pw-justify-start sm:pw-justify-center">
          <span className="pw-text-[12px] sm:pw-text-[13px] pw-leading-[15px] sm:pw-leading-[19.5px] pw-font-medium">
            {translate('wallet>page>for')}
          </span>
          <span className="pw-text-[12px] sm:pw-text-[15px] pw-leading-[15px] sm:pw-leading-[22.5px] pw-font-semibold">
            {walletIn.substring(0, 10)}...
          </span>
        </div>
      </div>
      <div className="pw-flex pw-flex-col pw-items-start pw-justify-center">
        <span className="pw-text-[13px] pw-leading-[19.5px] pw-font-medium pw-flex pw-gap-[6px] pw-w-[75px]">
          {type === 'Polygon' ? (
            <MaticIcon className="pw-fill-[#8247E5]" />
          ) : (
            <EthIcon />
          )}
          {parseFloat(matic).toFixed(5)}
        </span>
        <span className="pw-text-[13px] pw-leading-[20px] pw-font-semibold ">
          R${parseFloat(value).toFixed(2)}
        </span>
      </div>
      <div className="pw-flex pw-flex-col pw-items-center pw-justify-center">
        <span className="pw-text-[13px] pw-leading-[13px] pw-font-medium">
          {format(transactionDate, 'dd/MM/yyyy')}
        </span>
      </div>
      <a className="flex pw-justify-center pw-items-center">
        <ExternalLinkIcon className="pw-stroke-[#777E8F]" />
      </a>
    </div>
  );
};

const ExtractItemSkeleton = () => (
  <div className="pw-shadow-[0px_4px_15px_rgba(0,0,0,0.15)] pw-rounded-[8px] pw-border pw-border-[#E6E8EC] pw-bg-white pw-flex pw-justify-between pw-items-center pw-py-[15px] pw-pl-[16px] pw-pr-[28px] text-[#777E8F]">
    <Skeleton className="pw-w-[120px] pw-h-[17px]" />

    <div className="pw-flex pw-flex-col pw-items-start pw-justify-center pw-gap-1">
      <Skeleton className="pw-w-[120px] pw-h-[13px]" />
      <Skeleton className="pw-w-[120px] pw-h-[15px]" />
    </div>
    <div className="pw-flex pw-flex-col pw-items-start pw-justify-center pw-gap-1">
      <Skeleton className="pw-w-[120px] pw-h-[13px]" />
      <Skeleton className="pw-w-[120px] pw-h-[15px]" />
    </div>
    <div className="pw-flex pw-flex-col pw-items-start pw-justify-center pw-gap-1">
      <Skeleton className="pw-w-[120px] pw-h-[13px]" />
      <Skeleton className="pw-w-[120px] pw-h-[15px]" />
    </div>
    <Skeleton className="pw-w-[120px] pw-h-[17px]" />
    <Skeleton className="pw-w-[17px] pw-h-[17px]" />
  </div>
);
ExtractItem.Skeleton = ExtractItemSkeleton;
