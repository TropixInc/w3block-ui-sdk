/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useClickAway } from 'react-use';

import { Combobox, Listbox, Transition } from '@headlessui/react';
import classNames from 'classnames';
import _ from 'lodash';

import ArrowDown from '../../assets/icons/arrowDown.svg?react';
import CheckBoxIcon from '../../assets/icons/checkOutlined.svg?react';
import { Option } from '../GenericSearchFilter/GenericSearchFilter';
import { ImageSDK } from '../ImageSDK';

interface Props {
  options: Array<Option>;
  multiple?: boolean;
  search?: boolean;
  disabled?: boolean;
  classes?: {
    root?: string;
    button?: string;
    option?: string;
  };
  placeholder?: string;
  onChangeMultipleSelected?: (value: Array<string | undefined>) => void;
  multipleSelected?: Option[];
  isTranslatable?: boolean;
  translatePrefix?: string;
  setSearch?: (value: string) => void;
  searchValue?: string;
  onChangeValue?: (value: any) => void;
  value?: any;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
}

const MultipleSelect = ({
  options,
  disabled = false,
  classes = {},
  placeholder,
  onChangeMultipleSelected,
  multipleSelected,
  isTranslatable,
  translatePrefix,
  onChangeValue,
  value,
  onFocus,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [translate] = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  useClickAway(containerRef, () => {
    if (isOpen) setIsOpen(false);
  });

  const isSelected = (selectedValue: Option) => {
    if (multipleSelected && multipleSelected?.length > 0) {
      return multipleSelected?.some(
        (res) => res?.value === selectedValue?.value
      );
    } else {
      if (value && value?.length > 0)
        return value?.includes(selectedValue?.value);
    }

    return false;
  };

  const handleOptionChange = (selectedValue: Option) => {
    if (!isSelected(selectedValue)) {
      handleSelect(selectedValue);
    } else {
      handleDeselect(selectedValue);
    }
    setIsOpen(true);
  };

  const handleSelect = (newValue: Option) => {
    const selectedUpdated = multipleSelected
      ? multipleSelected && multipleSelected?.length > 0
        ? [...multipleSelected, newValue]
        : [newValue]
      : value && value?.length > 0
      ? [...value, newValue]
      : [newValue];

    if (onChangeMultipleSelected) {
      onChangeMultipleSelected(selectedUpdated);
    } else {
      onChangeValue?.(selectedUpdated);
    }
  };

  const handleDeselect = (deselectValue: Option) => {
    const selectedUpdated =
      multipleSelected && multipleSelected?.length > 0
        ? multipleSelected?.filter((el) => el?.value !== deselectValue?.value)
        : value?.filter((el: any) => el?.value !== deselectValue?.value);
    if (selectedUpdated?.length > 0) {
      if (onChangeMultipleSelected) {
        onChangeMultipleSelected(selectedUpdated);
      } else {
        onChangeValue?.(selectedUpdated);
      }
    } else {
      if (onChangeMultipleSelected) {
        onChangeMultipleSelected([]);
      } else {
        onChangeValue?.([]);
      }
    }
  };
  const displayValue =
    multipleSelected && multipleSelected?.length > 0
      ? multipleSelected.map((res) => res?.label).join(', ')
      : undefined;
  return (
    <div
      className={classNames(
        'pw-flex pw-items-start pw-justify-center pw-min-w-[200px] pw-h-[32px]',
        classes.root ?? ''
      )}
      ref={containerRef}
    >
      <Listbox
        as="div"
        className={`pw-relative pw-w-full ${
          disabled
            ? '!pw-bg-[#E9ECEF] !pw-outline-[#CED4DA]'
            : 'pw-rounded-lg pw-outline pw-transition-all pw-duration-200 pw-outline-[#CED4DA] focus:pw-outline-[#6EA8FE] focus:pw-shadow-[4px_#6EA8FE] pw-outline-1'
        }`}
        value={value}
        disabled={disabled}
      >
        {() => (
          <>
            <Listbox.Button
              onFocus={onFocus}
              className={classNames(
                'pw-flex pw-justify-between pw-items-center pw-p-2 pw-w-full pw-shadow-md pw-text-black focus:pw-outline-none',
                classes.button ?? ''
              )}
            >
              <div className="pw-text-sm pw-leading-4 pw-flex pw-items-center pw-pr-2 pw-truncate">
                {displayValue ?? placeholder}
              </div>
              <ArrowDown className="pw-stroke-black" />
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="pw-bg-white pw-cursor-default pw-flex pw-flex-col pw-py-1 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-absolute pw-w-full pw-max-h-[300px] pw-overflow-y-scroll pw-z-50"
              >
                {options.map((option, index) => {
                  const selected = isSelected(option);
                  return (
                    <Listbox.Option
                      key={`${index}-${option.value}`}
                      value={option.value}
                      disabled={option.disabled}
                      onClick={() => {
                        handleOptionChange(option);
                        onChangeValue?.(option.value);
                      }}
                      className={({ active }) => {
                        return classNames(
                          `pw-truncate pw-min-h-[36px] ${
                            active ? 'pw-bg-gray-300' : 'pw-bg-white'
                          }`,
                          classes.option ?? ''
                        );
                      }}
                    >
                      {({ disabled }) => (
                        <div
                          className={classNames(
                            'pw-select-none pw-flex pw-gap-x-2 pw-items-center pw-h-[36px] pw-mx-[6px]',
                            disabled
                              ? 'pw-text-[#969696] pw-bg-[#F4F4F4] pw-cursor-not-allowed'
                              : 'pw-text-black pw-cursor-pointer',
                            classes.option ?? ''
                          )}
                        >
                          <div
                            className={classNames(
                              'pw-w-[16px] pw-h-[16px] pw-border pw-rounded-[4px] pw-shrink-0',
                              disabled
                                ? 'pw-border-[#D1D1D1]'
                                : 'pw-border-[#CED4DA]'
                            )}
                          >
                            {selected && (
                              <CheckBoxIcon className="pw-w-[16px] pw-h-[16px] pw-stroke-[#CED4DA] pw-shrink-0" />
                            )}
                          </div>
                          <div className="pw-text-left pw-flex pw-items-center pw-gap-2">
                            {option.image ? (
                              <ImageSDK
                                alt="avatarImage"
                                src={`${option.image}`}
                                height={30}
                                width={24}
                                className="pw-w-[24px] pw-h-[30px] pw-rounded-sm"
                              />
                            ) : null}
                            <p className="pw-flex pw-flex-col pw-text-sm pw-leading-4 pw-truncate">
                              {isTranslatable
                                ? translate(
                                    `${translatePrefix || ''}${option.label}`
                                  )
                                : option.label}
                              {option.subtitle ? (
                                <span className="pw-text-xs pw-text-[#676767]">
                                  {option.subtitle}
                                </span>
                              ) : null}
                            </p>
                          </div>
                        </div>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
};

const SearchSelect = ({
  options,
  disabled = false,
  classes = {},
  isTranslatable,
  translatePrefix,
  setSearch,
  searchValue,
  value,
  onChangeValue,
  placeholder,
}: Props) => {
  const [translate] = useTranslation();

  return (
    <div
      className={classNames(
        'pw-flex pw-items-start pw-justify-center pw-min-w-[200px] pw-h-[32px]'
      )}
    >
      <Combobox
        value={value}
        onChange={(val) => {
          onChangeValue?.(val);
        }}
      >
        <div
          className={`pw-relative pw-w-full ${
            disabled
              ? '!pw-bg-[#E9ECEF] pw-outline-[#CED4DA]'
              : `${classes.root} pw-rounded-lg pw-outline pw-transition-all pw-duration-200 pw-outline-[#CED4DA] focus:pw-outline-[#6EA8FE] focus:pw-shadow-[4px_#6EA8FE] pw-outline-1`
          }`}
        >
          <Combobox.Button
            className={`${classes.button} pw-flex pw-justify-between pw-items-center pw-pr-2`}
          >
            <Combobox.Input
              className={classNames(
                'pw-flex pw-justify-between pw-items-center pw-p-2 pw-w-full pw-shadow-md pw-text-black focus:pw-outline-none pw-text-sm pw-leading-4',
                classes.button ?? ''
              )}
              displayValue={(val: any) => val?.label}
              onChange={(event) => setSearch?.(event?.target?.value ?? '')}
              placeholder={placeholder}
            ></Combobox.Input>
            <ArrowDown className="pw-stroke-black" />
          </Combobox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setSearch?.('')}
          >
            <Combobox.Options
              static
              className="pw-bg-white pw-cursor-default pw-flex pw-flex-col pw-py-1 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-absolute pw-w-full pw-max-h-[300px] pw-overflow-y-scroll pw-z-50"
            >
              {options.length === 0 && searchValue !== '' ? (
                <Combobox.Option
                  className={({ active }) => {
                    return classNames(
                      `pw-p-2 pw-truncate ${
                        active ? 'pw-bg-gray-300' : 'pw-bg-white'
                      }`,
                      classes.option ?? ''
                    );
                  }}
                  value=""
                >
                  {translate('shared>baseSelect>notFound')}
                </Combobox.Option>
              ) : (
                options.map((option, index) => {
                  return (
                    <Combobox.Option
                      key={`${index}-${option?.value}`}
                      value={option}
                      disabled={option?.disabled}
                      className={({ active }) => {
                        return classNames(
                          `pw-p-2 pw-truncate pw-text-left pw-flex pw-items-center pw-gap-2 ${
                            active ? 'pw-bg-gray-300' : 'pw-bg-white'
                          }`,
                          classes.option ?? ''
                        );
                      }}
                    >
                      {option.image ? (
                        <ImageSDK
                          alt="avatarImage"
                          src={`${option.image}`}
                          height={30}
                          width={24}
                          className="pw-w-[24px] pw-h-[30px] pw-rounded-sm"
                        />
                      ) : null}
                      <p className="pw-flex pw-flex-col pw-text-sm pw-leading-4 pw-truncate">
                        {isTranslatable
                          ? translate(
                              `${translatePrefix || ''}${option?.label}`
                            )
                          : option?.label}
                        {option.subtitle ? (
                          <span className="pw-text-xs pw-text-[#676767]">
                            {option.subtitle}
                          </span>
                        ) : null}
                      </p>
                    </Combobox.Option>
                  );
                })
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

const SimpleSelect = ({
  options,
  disabled = false,
  classes = {},
  placeholder,
  isTranslatable,
  translatePrefix,
  onChangeValue,
  value,
}: Props) => {
  const [translate] = useTranslation();

  return (
    <div
      className={classNames(
        'pw-flex pw-items-start pw-justify-center pw-min-w-[200px] pw-h-[32px]',
        classes.root ?? ''
      )}
    >
      <Listbox
        as="div"
        className={`pw-relative pw-w-full ${
          disabled
            ? '!pw-bg-[#E9ECEF] pw-outline-[#CED4DA]'
            : 'pw-rounded-lg pw-outline pw-transition-all pw-duration-200 pw-outline-[#CED4DA] focus:pw-outline-[#6EA8FE] focus:pw-shadow-[4px_#6EA8FE] pw-outline-1'
        }`}
        value={value}
        disabled={disabled}
      >
        {() => (
          <>
            <Listbox.Button
              className={classNames(
                'pw-flex pw-justify-between pw-items-center pw-p-2 pw-w-full pw-shadow-md pw-text-black focus:pw-outline-none',
                classes.button ?? ''
              )}
            >
              <div className="pw-text-sm pw-leading-4 pw-flex pw-items-center pw-pr-2">
                {typeof value === 'string' && value !== ''
                  ? value
                  : placeholder}
              </div>
              <ArrowDown className="pw-stroke-black" />
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="pw-bg-white pw-cursor-default pw-flex pw-flex-col pw-py-1 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-absolute pw-w-full pw-max-h-[300px] pw-overflow-y-scroll pw-z-50"
              >
                {options.map((option, index) => {
                  return (
                    <Listbox.Option
                      key={`${index}-${option.value}`}
                      value={option.value}
                      disabled={option.disabled}
                      onClick={() => {
                        onChangeValue?.(option.value);
                      }}
                      className={({ active }) => {
                        return classNames(
                          `pw-p-2 pw-truncate pw-text-left pw-flex pw-items-center pw-gap-2 ${
                            active ? 'pw-bg-gray-300' : 'pw-bg-white'
                          }`,
                          classes.option ?? ''
                        );
                      }}
                    >
                      {option.image ? (
                        <ImageSDK
                          alt="avatarImage"
                          src={`${option.image}`}
                          height={30}
                          width={24}
                          className="pw-w-[24px] pw-h-[30px] pw-rounded-sm"
                        />
                      ) : null}
                      <p className="pw-flex pw-flex-col pw-text-sm pw-leading-4 pw-truncate">
                        {isTranslatable
                          ? translate(`${translatePrefix || ''}${option.label}`)
                          : option.label}
                        {option.subtitle ? (
                          <span className="pw-text-xs pw-text-[#676767]">
                            {option.subtitle}
                          </span>
                        ) : null}
                      </p>
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
};

export const BaseSelect = ({ ...props }: Props) => {
  if (props.multiple) return <MultipleSelect {...props} />;
  else if (props.search) return <SearchSelect {...props} />;
  else return <SimpleSelect {...props} />;
};
