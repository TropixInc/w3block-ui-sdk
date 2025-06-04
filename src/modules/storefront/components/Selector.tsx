/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState } from "react";

import {
  Combobox,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import classNames from "classnames";

import ArrowDown from "../../shared/assets/icons/arrowDown.svg";

interface Props {
  onChange: (value: any) => void;
  title: string;
  data: any;
  initialValue?: string;
  disabled?: boolean;
  classes?: {
    title?: string;
    value?: string;
  };
}

export const Selector = ({
  data,
  onChange,
  initialValue,
  title,
  disabled,
  classes,
}: Props) => {
  const [value, setValue] = useState(
    data.filter((e: { id: string }) => e.id == initialValue)[0]
  );
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? data
      : data.filter((res: { attributes: { name: string } }) => {
          return res.attributes.name
            ?.toLowerCase()
            ?.includes(query?.toLowerCase());
        });

  return (
    <div className="pw-relative">
      <p
        className={classNames(
          "pw-font-[600] pw-text-base pw-text-[#35394C] pw-mt-5 pw-mb-1",
          classes?.title
        )}
      >
        {title}
      </p>
      {disabled ? (
        <div className="pw-flex pw-items-center pw-gap-3">
          <img
            alt="logo"
            src={`https://cms.foodbusters.com.br${value?.attributes?.image?.data?.attributes?.formats?.thumbnail?.url}`}
            className="pw-h-17 pw-w-17 pw-rounded-lg"
          />
          <p
            className={classNames(
              classes?.value,
              "pw-font-normal pw-text-base pw-text-[#35394C]"
            )}
          >
            {value?.attributes?.name}
          </p>
        </div>
      ) : (
        <Combobox
          disabled={disabled}
          value={value}
          onChange={(e) => {
            setValue(e);
            onChange(e.attributes.slug);
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
            <ComboboxButton className="pw-absolute pw-inset-y-0 pw-right-0 pw-flex pw-items-center pw-pr-2">
              <ArrowDown className="pw-stroke-black" />
            </ComboboxButton>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <ComboboxOptions className="pw-bg-white pw-cursor-default pw-flex pw-flex-col pw-py-1 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-absolute pw-w-full pw-max-w-[1032px]">
              {filteredPeople.map(
                (res: {
                  attributes: { name: string; slug: string };
                  id: string;
                }) => (
                  <ComboboxOption
                    key={res.id}
                    value={res}
                    className={({ active }) =>
                      `pw-p-2 pw-truncate ${
                        active ? "pw-bg-gray-300" : "pw-bg-white"
                      }`
                    }
                  >
                    {res.attributes.name}
                  </ComboboxOption>
                )
              )}
            </ComboboxOptions>
          </Transition>
        </Combobox>
      )}
    </div>
  );
};
