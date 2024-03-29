/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState } from 'react';

import { Combobox, Transition } from '@headlessui/react';

import ArrowDown from '../../shared/assets/icons/arrowDown.svg?react';

interface Props {
  onChange: (value: any) => void;
  title: string;
  data: any;
  initialValue?: string;
}

export const Selector = ({ data, onChange, initialValue, title }: Props) => {
  const [value, setValue] = useState(
    data.filter((e: { id: string }) => e.id == initialValue)[0]
  );
  const [query, setQuery] = useState('');

  const filteredPeople =
    query === ''
      ? data
      : data.filter((res: { attributes: { name: string } }) => {
          return res.attributes.name
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  return (
    <div className="pw-relative">
      <p className="pw-font-[600] pw-text-lg pw-text-[#35394C] pw-mt-5 pw-mb-2">
        {title}
      </p>
      <Combobox
        value={value}
        onChange={(e) => {
          setValue(e);
          onChange(e.attributes.walletAddress);
        }}
      >
        <div className="pw-relative">
          <Combobox.Input
            className="pw-p-2 pw-w-full pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black focus:pw-outline-none"
            displayValue={(res: { attributes: { name: string } }) =>
              res.attributes.name
            }
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="pw-absolute pw-inset-y-0 pw-right-0 pw-flex pw-items-center pw-pr-2">
            <ArrowDown className="pw-stroke-black" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="pw-bg-white pw-cursor-default pw-flex pw-flex-col pw-py-1 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-absolute pw-w-full pw-max-w-[1032px]">
            {filteredPeople.map(
              (res: {
                attributes: { name: string; walletAddress: string };
                id: string;
              }) => (
                <Combobox.Option
                  key={res.id}
                  value={res}
                  className={({ active }) =>
                    `pw-p-2 pw-truncate ${
                      active ? 'pw-bg-gray-300' : 'pw-bg-white'
                    }`
                  }
                >
                  {res.attributes.name}
                </Combobox.Option>
              )
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
};
