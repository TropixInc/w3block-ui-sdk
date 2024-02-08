import React, { useState, useRef, useEffect } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useClickAway } from 'react-use';

import { Listbox, Transition } from '@headlessui/react';
import classNames from 'classnames';
import _ from 'lodash';

import ArrowDownOutlined from '../../assets/icons/arrowDown.svg?react';
import CheckBoxIcon from '../../assets/icons/checkOutlined.svg?react';
import { Option } from '../GenericSearchFilter/GenericSearchFilter';

interface Props {
  options: Array<Option>;
  disabled?: boolean;
  name: string;
  classes?: {
    root?: string;
    button?: string;
    option?: string;
  };
  placeholder: string;
  onChangeMultipleSelected?: (value: Array<string | undefined>) => void;
  multipleSelected?: Array<string | undefined>;
  isTranslatable?: boolean;
  translatePrefix?: string;
}

export const MultipleSelect = ({
  options,
  name,
  disabled = false,
  classes = {},
  placeholder,
  onChangeMultipleSelected,
  multipleSelected,
  isTranslatable,
  translatePrefix,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [translate] = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  useClickAway(containerRef, () => {
    if (isOpen) setIsOpen(false);
  });

  const {
    field: { onChange, value },
    fieldState,
  } = useController({ name: name });

  const isSelected = (selectedValue: string) => {
    if (multipleSelected && multipleSelected?.length > 0) {
      return multipleSelected.includes(selectedValue);
    } else {
      if (value && value?.length > 0) return value.includes(selectedValue);
    }

    return false;
  };

  const removeValuesNotInOptions = () => {
    const newValues: Array<string> = [];

    value.forEach((val: string) => {
      const hasValue = options.some((option) => option.value === val);

      if (hasValue) newValues.push(val);
    });

    if (_.isEqual(newValues, value)) {
      if (onChangeMultipleSelected) {
        onChangeMultipleSelected(newValues);
      } else {
        onChange(newValues);
      }
    }
  };

  useEffect(() => {
    if (options) {
      if (options?.length < 1) {
        if (onChangeMultipleSelected) {
          onChangeMultipleSelected([]);
        } else {
          onChange([]);
        }
      } else if (value?.length) {
        removeValuesNotInOptions();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const handleOptionChange = (selectedValue: string) => {
    if (!isSelected(selectedValue)) {
      handleSelect(selectedValue);
    } else {
      handleDeselect(selectedValue);
    }
    setIsOpen(true);
  };

  const handleSelect = (newValue: string) => {
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
      onChange(selectedUpdated);
    }
  };

  const handleDeselect = (deselectValue: string) => {
    const selectedUpdated =
      multipleSelected && multipleSelected.length > 0
        ? (multipleSelected as Array<string>).filter(
            (el: string) => el !== deselectValue
          )
        : value.filter((el: string) => el !== deselectValue);
    if (selectedUpdated?.length > 0) {
      if (onChangeMultipleSelected) {
        onChangeMultipleSelected(selectedUpdated);
      } else {
        onChange(selectedUpdated);
      }
    } else {
      if (onChangeMultipleSelected) {
        onChangeMultipleSelected([]);
      } else {
        onChange([]);
      }
    }
  };

  const error = fieldState.error?.message || '';

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
        className="pw-relative pw-w-full"
        value={value}
        disabled={disabled}
      >
        {() => (
          <>
            <Listbox.Button
              className={classNames(
                'pw-relative pw-w-full pw-h-10 pw-border pw-text-left pw-px-[14px] pw-text-[15px] pw-leading-[18px] pw-z-10',
                disabled
                  ? '!pw-border-[#D1D1D1] pw-bg-[#F4F4F4] pw-text-[#969696] pw-cursor-not-allowed'
                  : 'pw-border-[#B9D1F3] pw-bg-white pw-text-black pw-cursor-pointer',
                isOpen
                  ? 'pw-rounded-[8px_8px_0_0] pw-border-b-white pw-shadow-[0_4px_15px_#00000011]'
                  : 'pw-rounded-lg',
                classes.button ?? '',
                error ? '!pw-border-[#FF0505]' : ''
              )}
              onClick={() => (!disabled ? setIsOpen(!isOpen) : null)}
            >
              <span className="pw-block pw-truncate">{placeholder}</span>

              <ArrowDownOutlined
                className={classNames(
                  'pw-w-[20px] pw-h-[10px] pw-stroke-[3px] pw-absolute pw-right-[14px] pw-top-[50%] pw-translate-y-[-50%]',
                  disabled ? 'pw-stroke-[#969696]' : 'pw-stroke-[#5682C3]',
                  isOpen ? 'pw-rotate-180' : ''
                )}
              />
            </Listbox.Button>

            <Transition
              show={isOpen}
              leave="pw-transition pw-ease-in pw-duration-100"
              leaveFrom="pw-opacity-100"
              leaveTo="pw-opacity-0"
              className="pw-absolute pw-top-[100%] pw-mt-0 pw-w-full pw-rounded-[0_0_8px_8px] pw-bg-white pw-shadow-[0_4px_15px_#00000011] pw-z-30 pw-border-[0_1px_1px_1px] pw-border-[#B9D1F3] pw-p-2"
            >
              <Listbox.Options
                static
                className="pw-max-h-60 pw-overflow-auto before:pw-absolute before:pw-w-[calc(100%_-_28px)] before:pw-left-[50%] before:pw-top-0 before:pw-translate-x-[-50%] before:pw-h-[1px] before:pw-bg-[#B9D1F3] before:pw-content-[''] pw-scrollbar-thin pw-scrollbar-track-rounded-full pw-scrollbar-track-[#F4F4F4] pw-scrollbar-thumb-[#B9D1F3] pw-scrollbar-thumb-rounded-full hover:pw-scrollbar-thumb-[#5682C3]"
              >
                {options.map((option, index) => {
                  const selected = isSelected(option.value);
                  return (
                    <Listbox.Option
                      key={`${index}-${option.value}`}
                      value={option.value}
                      disabled={option.disabled}
                      onClick={() => handleOptionChange(option.value)}
                    >
                      {({ disabled }) => (
                        <div
                          className={classNames(
                            'pw-select-none pw-flex pw-gap-x-2 pw-items-center pw-h-[36px] pw-my-3 pw-mx-[6px]',
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
                                : 'pw-border-[#94B8ED]'
                            )}
                          >
                            {selected && (
                              <CheckBoxIcon className="pw-w-[16px] pw-h-[16px] pw-stroke-[#94B8ED] pw-shrink-0" />
                            )}
                          </div>

                          {option.icon && option.icon}

                          <span className="pw-text-sm pw-leading-4 pw-block pw-truncate">
                            {isTranslatable
                              ? translate(
                                  `${translatePrefix || ''}${option.label}`
                                )
                              : option.label}
                          </span>
                        </div>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
            {error && (
              <span className="pw-text-[#FF0505] pw-text-xs pw-mb-2">
                {error}
              </span>
            )}
          </>
        )}
      </Listbox>
    </div>
  );
};
