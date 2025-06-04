/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, useMemo } from "react";

import { Combobox, Listbox, Transition } from "@headlessui/react";
import classNames from "classnames";
import _ from "lodash";

import ArrowDown from "../assets/icons/arrowDown.svg";
import CheckBoxIcon from "../assets/icons/checkOutlined.svg";

import { BaseInputLayout, BaseInputProps } from "./BaseInput";

import { ImageSDK } from "./ImageSDK";
import { IOption } from "../interfaces/IOption";
import { useTranslation } from "react-i18next";

interface Props extends Partial<BaseInputProps> {
  options: Array<IOption>;
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
  multipleSelected?: IOption[];
  isTranslatable?: boolean;
  translatePrefix?: string;
  setSearch?: (value: string) => void;
  searchValue?: string;
  onChangeValue?: (value: any) => void;
  value?: any;
  readonly?: boolean;
}

const MultipleSelect = ({
  options,
  disabled = false,
  classes = {},
  placeholder,
  isTranslatable,
  translatePrefix,
  onChangeValue,
  value,
  ...props
}: Props) => {
  const [translate] = useTranslation();
  const displayValue =
    value && value?.length > 0
      ? value
          .map(
            (res: any) =>
              res?.label ?? options?.find((e) => e.value === res)?.label ?? res
          )
          .join(", ")
      : undefined;
  return (
    <div
      className={classNames(
        "pw-flex pw-items-start pw-justify-center pw-min-w-[200px] pw-h-[32px]",
        classes.root ?? ""
      )}
    >
      <Listbox
        as="div"
        className={`pw-relative pw-w-full`}
        value={value}
        onChange={onChangeValue}
        multiple
        disabled={disabled}
      >
        {() => (
          <>
            <BaseInputLayout {...props} disabled={disabled}>
              <Listbox.Button
                className={classNames(
                  "pw-flex pw-justify-between pw-items-center pw-w-full pw-text-black focus:pw-outline-none",
                  classes.button ?? ""
                )}
              >
                <div className="pw-text-base pw-leading-4 pw-flex pw-items-center pw-pr-2 pw-truncate">
                  {displayValue ?? placeholder}
                </div>
                <ArrowDown className="pw-stroke-black" />
              </Listbox.Button>
            </BaseInputLayout>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="pw-bg-white pw-cursor-default pw-flex pw-flex-col pw-py-1 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-absolute pw-w-full pw-max-h-[300px] pw-overflow-y-auto pw-z-50"
              >
                {options.map((option, index) => {
                  return (
                    <Listbox.Option
                      key={`${index}-${option.value}`}
                      value={option.value}
                      disabled={option.disabled}
                      className={({ active }) => {
                        return classNames(
                          `pw-truncate pw-flex pw-items-center ${
                            active ? "pw-bg-gray-300" : "pw-bg-white"
                          }`,
                          classes.option ?? "",
                          !!option.subtitle || !!option.image || !!option.icon
                            ? "pw-min-h-[44px]"
                            : "pw-min-h-[32px]"
                        );
                      }}
                    >
                      {({ disabled, selected }) => (
                        <div
                          className={classNames(
                            "pw-select-none pw-flex pw-gap-x-2 pw-items-center pw-mx-[6px]",
                            disabled
                              ? "pw-text-[#969696] pw-bg-[#F4F4F4] pw-cursor-not-allowed"
                              : "pw-text-black pw-cursor-pointer",
                            classes.option ?? ""
                          )}
                        >
                          <div
                            className={classNames(
                              "pw-w-[16px] pw-h-[16px] pw-border pw-rounded-[4px] pw-shrink-0",
                              disabled
                                ? "pw-border-[#D1D1D1]"
                                : "pw-border-[#CED4DA]"
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
                            <p className="pw-flex pw-flex-col pw-text-base pw-leading-4 pw-truncate">
                              {isTranslatable
                                ? translate(
                                    `${translatePrefix || ""}${option.label}`
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
  multiple = false,
  ...props
}: Props) => {
  const [translate] = useTranslation();

  return (
    <div
      className={classNames(
        "pw-flex pw-items-start pw-justify-center pw-min-w-[200px] pw-h-[32px]",
        classes.root ?? ""
      )}
    >
      <Combobox
        value={value}
        multiple={multiple as any}
        onChange={(val) => {
          onChangeValue?.(val);
        }}
      >
        <div className={`pw-relative pw-w-full`}>
          <BaseInputLayout {...props} disabled={disabled}>
            <Combobox.Button
              className={`${classes.button} pw-flex pw-outline-none pw-justify-between pw-items-center pw-w-full`}
            >
              <Combobox.Input
                className={classNames(
                  "pw-flex pw-justify-between pw-items-center pw-w-full pw-h-full pw-text-black focus:pw-outline-none",
                  classes.button ?? ""
                )}
                displayValue={(val: any) => val?.label}
                onChange={(event) => setSearch?.(event?.target?.value ?? "")}
                placeholder={placeholder}
              ></Combobox.Input>
              <ArrowDown className="pw-stroke-black" />
            </Combobox.Button>
          </BaseInputLayout>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setSearch?.("")}
          >
            <Combobox.Options
              static
              className="pw-bg-white pw-cursor-default pw-flex pw-flex-col pw-py-1 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-absolute pw-w-full pw-max-h-[300px] pw-overflow-y-auto pw-z-50"
            >
              {options.length === 0 && searchValue !== "" ? (
                <Combobox.Option
                  className={({ active }) => {
                    return classNames(
                      `pw-p-2 pw-truncate pw-min-h-[32px] ${
                        active ? "pw-bg-gray-300" : "pw-bg-white"
                      }`,
                      classes.option ?? ""
                    );
                  }}
                  value=""
                >
                  {translate("shared>baseSelect>notFound")}
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
                          `pw-truncate pw-flex pw-items-center ${
                            active ? "pw-bg-gray-300" : "pw-bg-white"
                          }`,
                          classes.option ?? "",
                          !!option.subtitle || !!option.image || !!option.icon
                            ? "pw-min-h-[44px]"
                            : "pw-min-h-[32px]"
                        );
                      }}
                    >
                      {({ disabled, selected }) => (
                        <div
                          className={classNames(
                            "pw-select-none pw-flex pw-gap-x-2 pw-items-center pw-mx-[6px]",
                            disabled
                              ? "pw-text-[#969696] pw-bg-[#F4F4F4] pw-cursor-not-allowed"
                              : "pw-text-black pw-cursor-pointer",
                            classes.option ?? ""
                          )}
                        >
                          {multiple ? (
                            <div
                              className={classNames(
                                "pw-w-[16px] pw-h-[16px] pw-border pw-rounded-[4px] pw-shrink-0",
                                disabled
                                  ? "pw-border-[#D1D1D1]"
                                  : "pw-border-[#CED4DA]"
                              )}
                            >
                              {selected && (
                                <CheckBoxIcon className="pw-w-[16px] pw-h-[16px] pw-stroke-[#CED4DA] pw-shrink-0" />
                              )}
                            </div>
                          ) : null}
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
                            <p className="pw-flex pw-flex-col pw-text-base pw-leading-4 pw-truncate">
                              {isTranslatable
                                ? translate(
                                    `${translatePrefix || ""}${option.label}`
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
  readonly,
  ...props
}: Props) => {
  const [translate] = useTranslation();
  const displayValue = useMemo(() => {
    if (value?.label) return value?.label;
    else if (options.some((res) => res.value === value))
      return options.find((res) => res.value === value)?.label;
    else if (typeof value === "string" && value != "") return value;
    else return placeholder;
  }, [options, placeholder, value]);
  return (
    <div
      className={classNames(
        "pw-flex pw-items-start pw-justify-center pw-min-w-[200px] pw-h-[32px]",
        classes.root ?? ""
      )}
    >
      <Listbox
        as="div"
        className={`pw-relative pw-w-full`}
        value={value}
        onChange={(val) => {
          onChangeValue?.(val);
        }}
        disabled={disabled}
      >
        {() => (
          <>
            <BaseInputLayout {...props} readonly={readonly} disabled={disabled}>
              <Listbox.Button
                className={classNames(
                  "pw-flex pw-justify-between pw-items-center pw-h-full pw-w-full pw-text-black focus:pw-outline-none",
                  classes.button ?? "",
                  readonly ? "!pw-outline-white" : ""
                )}
              >
                <div className="pw-text-base pw-leading-4 pw-flex pw-items-center pw-pr-2 pw-truncate">
                  {displayValue}
                </div>
                {readonly ? null : <ArrowDown className="pw-stroke-black" />}
              </Listbox.Button>
            </BaseInputLayout>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="pw-bg-white pw-cursor-default pw-flex pw-flex-col pw-py-1 pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md pw-text-black pw-absolute pw-w-full pw-max-h-[300px] pw-overflow-y-auto pw-z-50"
              >
                {options.map((option, index) => {
                  return (
                    <Listbox.Option
                      key={`${index}-${option.value}`}
                      value={option.value}
                      disabled={option.disabled}
                      className={({ active }) => {
                        return classNames(
                          `pw-p-2 pw-truncate pw-text-left pw-flex pw-items-center pw-gap-2 ${
                            active ? "pw-bg-gray-300" : "pw-bg-white"
                          }`,
                          classes.option ?? "",
                          !!option.subtitle || !!option.image || !!option.icon
                            ? "pw-min-h-[44px]"
                            : "pw-min-h-[32px]"
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
                      {option.icon ? option?.icon : null}
                      <p className="pw-flex pw-flex-col pw-text-base pw-leading-4 pw-truncate">
                        {isTranslatable
                          ? translate(`${translatePrefix || ""}${option.label}`)
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
  if (props.search) return <SearchSelect {...props} />;
  else if (props.multiple) return <MultipleSelect {...props} />;
  else return <SimpleSelect {...props} />;
};
