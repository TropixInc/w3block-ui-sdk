/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import ArrowDown from '../../shared/assets/icons/arrowDown.svg?react';
interface Props {
  onClick: (value: any) => void;
  title: string;
  data: any;
  initialValue?: string;
}

export const Selector = ({ data, onClick, initialValue, title }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const [value, setValue] = useState(initialValue ?? '');

  const refToClickAway = useRef<HTMLDivElement>(null);
  useClickAway(refToClickAway, () => {
    if (isOpened) {
      setIsOpened(false);
    }
  });

  return (
    <div ref={refToClickAway} className="pw-mt-4">
      <p className="pw-font-[600] pw-text-lg pw-text-[#35394C] pw-mt-5 pw-mb-2">
        {title}
      </p>
      <div
        onClick={() => setIsOpened(!isOpened)}
        className="pw-flex pw-items-center pw-rounded-lg pw-justify-between pw-cursor-pointer pw-p-3 pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black"
      >
        <p className="pw-text-xs pw-font-[600] pw-text-black pw-truncate">
          {value}
        </p>
        <ArrowDown className="pw-stroke-black" />
      </div>
      {isOpened && (
        <div className="pw-relative">
          <div className="pw-absolute pw-bg-white -pw-mt-1 pw-flex pw-flex-col pw-py-1 pw-rounded-b-l ">
            <div className="pw-border-t pw-bg-slate-400 pw-mx-3 pw-h-px"></div>
            <div className=""></div>
            <div className="pw-max-h-[180px] pw-overflow-y-auto">
              {data?.map(
                (res: {
                  attributes: {
                    walletAddress: string;
                    name: string;
                  };
                }) => (
                  <p
                    onClick={() => {
                      onClick(res.attributes.walletAddress);
                      setValue(res.attributes.name);
                    }}
                    key={res.attributes.walletAddress}
                    className="pw-px-3 pw-py-2 pw-truncate pw-text-sm pw-cursor-pointer hover:pw-bg-slate-100 pw-text-black"
                  >
                    {res.attributes.name}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
