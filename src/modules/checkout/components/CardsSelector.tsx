/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState } from 'react';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react';
import { isBefore, isAfter } from 'date-fns';

import ArrowDown from '../../shared/assets/icons/arrowDown.svg';
import { useTranslation } from 'react-i18next';
import { AvailableCreditCards } from '../interface/interface';


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
          setValue(e as NoInfer<AvailableCreditCards>);
          onChange(e?.id);
        }}
      >
        <div className="pw-relative">
          <ComboboxButton className="pw-flex pw-justify-between pw-items-center pw-p-3 pw-w-full pw-rounded-lg pw-border pw-border-slate-300 pw-shadow-md pw-text-sm pw-text-slate-700 focus:pw-outline-none">
            <ComboboxInput
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
          </ComboboxButton>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ComboboxOptions className="pw-bg-white pw-cursor-default pw-flex pw-flex-col pw-py-1 pw-rounded-lg pw-border pw-border-slate-300 pw-shadow-md pw-text-sm pw-text-slate-700 pw-absolute pw-w-full pw-max-w-[1032px] pw-z-[1000]">
            {sortedData.map((res) => (
              <ComboboxOption
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
              </ComboboxOption>
            ))}
            <ComboboxOption
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
            </ComboboxOption>
          </ComboboxOptions>
        </Transition>
      </Combobox>
    </div>
  );
};
