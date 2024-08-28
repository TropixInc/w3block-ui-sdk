/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState } from 'react';

import { Combobox, Transition } from '@headlessui/react';
import { isBefore, isAfter } from 'date-fns';

import ArrowDown from '../../../shared/assets/icons/arrowDown.svg?react';
import useTranslation from '../../../shared/hooks/useTranslation';
import { AvailableCreditCards } from '../../interface/interface';

interface Props {
  onChange: (value: any) => void;
  data: AvailableCreditCards[];
  initialValue?: string;
  disabled?: boolean;
}

export const CardsSelector = ({ data, onChange, disabled }: Props) => {
  const sortedData = data.sort(function (a: any, b: any) {
    const dateA = new Date(a?.createdAt);
    const dateB = new Date(b?.createdAt);
    if (isAfter(dateA, dateB)) return -1;
    if (isBefore(dateA, dateB)) return 1;
    return 0;
  });
  const [value, setValue] = useState(sortedData[0]);
  const [translate] = useTranslation();

  return (
    <div className="pw-relative">
      <Combobox
        disabled={disabled}
        value={value}
        onChange={(e) => {
          setValue(e);
          onChange(e.id);
        }}
      >
        <div className="pw-relative">
          <Combobox.Button className="pw-flex pw-justify-between pw-items-center pw-p-3 pw-w-full pw-rounded-lg pw-border pw-border-slate-300 pw-shadow-md pw-text-sm pw-text-slate-700 focus:pw-outline-none">
            <Combobox.Input
              className="pw-outline-none pw-cursor-pointer pw-w-full pw-truncate"
              readOnly
              displayValue={(res: {
                name: string;
                lastNumbers: string;
                text?: string;
                brand: string;
              }) => {
                if (typeof res.text === 'string') return res.text;
                else if (typeof res.name === 'string')
                  return `${res.name} ${res.brand} (Final ${res.lastNumbers})`;
                else return `${res.brand} (Final ${res.lastNumbers})`;
              }}
            />
            <ArrowDown className="pw-stroke-slate-700" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="pw-bg-white pw-cursor-default pw-flex pw-flex-col pw-py-1 pw-rounded-lg pw-border pw-border-slate-300 pw-shadow-md pw-text-sm pw-text-slate-700 pw-absolute pw-w-full pw-max-w-[1032px] pw-z-[1000]">
            {sortedData.map((res) => (
              <Combobox.Option
                key={res.id}
                value={res}
                className={({ active }) =>
                  `pw-p-3 pw-truncate ${
                    active ? 'pw-bg-gray-300' : 'pw-bg-white'
                  }`
                }
              >
                {res.name
                  ? `${res.name} ${res.brand} (Final ${res.lastNumbers})`
                  : `${res.brand} (Final ${res.lastNumbers})`}
              </Combobox.Option>
            ))}
            <Combobox.Option
              value={{
                id: 'newCard',
                text: translate('checkout>cardSelector>payOtherCard'),
              }}
              className={({ active }) =>
                `pw-p-3 pw-truncate ${
                  active ? 'pw-bg-gray-300' : 'pw-bg-white'
                }`
              }
            >
              {translate('checkout>cardSelector>payOtherCard')}
            </Combobox.Option>
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
};
