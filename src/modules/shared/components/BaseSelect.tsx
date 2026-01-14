/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";

import {
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import classNames from "classnames";

import CheckBoxIcon from "../assets/icons/checkOutlined.svg";

import { BaseInputLayout, BaseInputProps } from "./BaseInput";

import { ImageSDK } from "./ImageSDK";
import { IOption } from "../interfaces/IOption";
import useTranslation from "../hooks/useTranslation";


interface Props extends Partial<BaseInputProps> {
  options: Array<IOption>;
  multiple?: boolean;
  search?: boolean;
  disabled?: boolean;
  classes?: {
    root?: string;
    rootSize?: string;
    button?: string;
    option?: string;
    input?: string;
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
  showSelectedInInput?: boolean;
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

  const selectedValues = useMemo(() => {
    if (!value || !Array.isArray(value)) return [];
    return value.map((res: any) => {
      if (typeof res === "string" || typeof res === "number") {
        return res;
      }
      return res?.value ?? res;
    });
  }, [value]);

  const getDisplayValue = (selected: string[]) => {
    if (selected.length === 0) {
      return placeholder || "";
    }
    return selected
      .map((val) => {
        const option = options.find((opt) => opt.value === val);
        return option?.label ?? val;
      })
      .join(", ");
  };

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selected = event.target.value as string[];
    const selectedOptions = selected.map((val) => {
      const option = options.find((opt) => opt.value === val);
      return option || val;
    });
    onChangeValue?.(selectedOptions);
  };

  return (
    <div
      className={classNames(
        "pw-flex pw-items-start pw-justify-center  pw-h-[32px]",
        classes.root ? classes.root : "",
        classes.rootSize ? classes.rootSize : "pw-min-w-[200px]",
      )}
    >
      <BaseInputLayout fullWidth={true} className={classes.input ?? ""} {...props} disabled={disabled}>
        <Select
          multiple
          value={selectedValues}
          onChange={handleChange}
          disabled={disabled}
          displayEmpty
          renderValue={(selected) => (
            <div className="pw-text-base pw-leading-4 pw-flex pw-items-center pw-pr-2 pw-truncate pw-w-full" style={{ pointerEvents: "none" }}>
              {getDisplayValue(selected as string[])}
            </div>
          )}
          className={classNames("pw-w-full", classes.button ?? "")}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiSelect-select": {
              padding: 0,
              display: "flex",
              alignItems: "center",
              cursor: disabled ? "auto" : "pointer",
            },
            "& .MuiSelect-icon": {
              pointerEvents: "none",
            },
            cursor: disabled ? "auto" : "pointer",
            boxShadow: "none",
            backgroundColor: disabled ? "#E9ECEF" : "transparent",
            "&:hover": {
              boxShadow: "none",
            },
            "&.Mui-focused": {
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              backgroundColor: "#E9ECEF",
              cursor: "auto",
              "& .MuiSelect-select": {
                cursor: "auto",
              },
            },
          }}
          MenuProps={{
            PaperProps: {
              className: classNames(
                "pw-bg-white pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md",
                classes.option ?? ""
              ),
              sx: {
                maxHeight: 300,
                "& .MuiMenuItem-root": {
                  padding: "8px",
                  minHeight: "32px",
                },
              },
            },
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }}
        >
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            const label = isTranslatable
              ? translate(`${translatePrefix || ""}${option.label}`)
              : option.label;

            return (
              <MenuItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={classNames(
                  "pw-flex pw-gap-x-2 pw-items-center",
                  classes.option ?? "",
                  option.disabled
                    ? "pw-text-[#969696] pw-bg-[#F4F4F4] pw-cursor-not-allowed"
                    : "pw-text-black pw-cursor-pointer",
                  !!option.subtitle || !!option.image || !!option.icon
                    ? "pw-min-h-[44px]"
                    : "pw-min-h-[32px]"
                )}
                sx={{
                  "&:hover": {
                    backgroundColor: option.disabled ? "#F4F4F4" : "#E5E7EB",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "white",
                    "&:hover": {
                      backgroundColor: "#E5E7EB",
                    },
                  },
                }}
              >
                <div
                  className={classNames(
                    "pw-w-[16px] pw-h-[16px] pw-border pw-rounded-[4px] pw-shrink-0 pw-flex pw-items-center pw-justify-center",
                    option.disabled
                      ? "pw-border-[#D1D1D1]"
                      : "pw-border-[#CED4DA]"
                  )}
                >
                  {isSelected && (
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
                    {label}
                    {option.subtitle ? (
                      <span className="pw-text-xs pw-text-[#676767]">
                        {option.subtitle}
                      </span>
                    ) : null}
                  </p>
                </div>
              </MenuItem>
            );
          })}
        </Select>
      </BaseInputLayout>
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
  showSelectedInInput = true,
  ...props
}: Props) => {
  const [translate] = useTranslation();
  const [inputValue, setInputValue] = useState(searchValue || "");

  const handleInputChange = (_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
    setSearch?.(newInputValue);
  };

  const handleChange = (_event: any, newValue: any) => {
    onChangeValue?.(newValue);
  };

  // Normaliza o value para garantir que seja sempre IOption ou array de IOption
  const normalizedValue = useMemo(() => {
    if (!value) {
      return multiple ? [] : null;
    }

    if (multiple) {
      if (Array.isArray(value)) {
        return value.map((val) => {
          if (typeof val === "string" || typeof val === "number") {
            const foundOption = options.find((opt) => opt.value === val);
            return foundOption || { label: String(val), value: val };
          }
          return val;
        });
      }
      return [];
    } else {
      if (typeof value === "string" || typeof value === "number") {
        const foundOption = options.find((opt) => opt.value === value);
        return foundOption || { label: String(value), value };
      }
      return value;
    }
  }, [value, options, multiple]);

  const getOptionLabel = (option: IOption | string) => {
    // Se option for uma string, tenta encontrar a opção correspondente
    if (typeof option === "string") {
      const foundOption = options.find((opt) => opt.value === option);
      if (foundOption) {
        return isTranslatable
          ? translate(`${translatePrefix || ""}${foundOption.label}`) || foundOption.label || String(option)
          : foundOption.label || String(option);
      }
      return String(option);
    }

    // Se option for um objeto IOption
    const label = option?.label;
    if (!label) {
      // Se não tiver label, tenta usar o value como fallback
      return String(option?.value ?? "");
    }

    if (isTranslatable) {
      const translated = translate(`${translatePrefix || ""}${label}`);
      return translated || label || String(option?.value ?? "");
    }

    return label;
  };

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: IOption,
    state: { selected: boolean }
  ) => {
    const label = getOptionLabel(option);
    const isDisabled = option.disabled;

    return (
      <li
        {...props}
        className={classNames(
          "pw-flex pw-gap-x-2 pw-items-center pw-mx-[6px]",
          classes.option ?? "",
          isDisabled
            ? "pw-text-[#969696] pw-bg-[#F4F4F4] pw-cursor-not-allowed"
            : "pw-text-black pw-cursor-pointer",
          !!option.subtitle || !!option.image || !!option.icon
            ? "pw-min-h-[44px]"
            : "pw-min-h-[32px]"
        )}
      >
        {multiple && (
          <div
            className={classNames(
              "pw-w-[16px] pw-h-[16px] pw-border pw-rounded-[4px] pw-shrink-0 pw-flex pw-items-center pw-justify-center",
              isDisabled
                ? "pw-border-[#D1D1D1]"
                : "pw-border-[#CED4DA]"
            )}
          >
            {state.selected && (
              <CheckBoxIcon className="pw-w-[16px] pw-h-[16px] pw-stroke-[#CED4DA] pw-shrink-0" />
            )}
          </div>
        )}
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
            {label}
            {option.subtitle ? (
              <span className="pw-text-xs pw-text-[#676767]">
                {option.subtitle}
              </span>
            ) : null}
          </p>
        </div>
      </li>
    );
  };

  return (
    <div
      className={classNames(
        "pw-flex pw-items-start pw-justify-center  pw-h-[32px]",
        classes.root ?? "",
        classes.rootSize ? classes.rootSize : "pw-min-w-[200px]"
      )}
    >
      <BaseInputLayout className={classes.input ?? ""} {...props} disabled={disabled} fullWidth={true}>
        <Autocomplete
          multiple={multiple}
          options={options}
          value={normalizedValue}
          onChange={handleChange}
          onInputChange={handleInputChange}
          inputValue={inputValue}
          disabled={disabled}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          isOptionEqualToValue={(option: IOption, val: IOption | string) => {
            if (typeof val === "string") {
              return option.value === val;
            }
            return option.value === val?.value;
          }}
          noOptionsText={translate("shared>baseSelect>notFound")}
          clearIcon={showSelectedInInput ? undefined : false}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              variant="standard"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              className={classNames("pw-w-full", classes.button ?? "")}
              sx={{
                "& .MuiInputBase-root": {
                  padding: 0,
                },
                "& .MuiInputBase-input": {
                  padding: 0,
                  fontSize: "16px",
                  lineHeight: "16px",
                },
              }}
            />
          )}
          renderTags={
            multiple && !showSelectedInInput
              ? () => null
              : undefined
          }
          className={classNames("pw-w-full", classes.button ?? "")}
          sx={{
            "& .MuiAutocomplete-inputRoot": {
              padding: 0,
              backgroundColor: disabled ? "#E9ECEF" : "transparent",
              cursor: disabled ? "auto" : "pointer",
            },
            "&.Mui-disabled": {
              backgroundColor: "#E9ECEF",
              cursor: "auto",
              "& .MuiAutocomplete-inputRoot": {
                backgroundColor: "#E9ECEF",
                cursor: "auto",
              },
            },
          }}
          PaperComponent={({ children, ...other }) => (
            <div
              {...other}
              className={classNames(
                "pw-bg-white pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md",
                classes.option ?? ""
              )}
            >
              {children}
            </div>
          )}
          ListboxProps={{
            sx: {
              maxHeight: 300,
              "& .MuiAutocomplete-option": {
                padding: "6px",
              },
            },
          }}
        />
      </BaseInputLayout>
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

  const selectedValue = useMemo(() => {
    if (value?.value !== undefined) return value.value;
    if (value?.label) {
      const option = options.find((opt) => opt.label === value.label);
      return option?.value ?? value.value;
    }
    if (options.some((res) => res.value === value)) {
      return value;
    }
    return "";
  }, [options, value]);

  const displayValue = useMemo(() => {
    if (value?.label) return value?.label;
    else if (options.some((res) => res.value === value)) {
      const option = options.find((res) => res.value === value);
      return isTranslatable
        ? translate(`${translatePrefix || ""}${option?.label || ""}`)
        : option?.label;
    } else if (typeof value === "string" && value != "") return value;
    else return placeholder || "";
  }, [options, placeholder, value, isTranslatable, translatePrefix, translate]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selected = event.target.value;
    const option = options.find((opt) => opt.value === selected);
    onChangeValue?.(option || selected);
  };

  return (
    <div
      className={classNames(
        "pw-flex pw-items-start pw-justify-center pw-h-[32px] pw-w-full",
        classes.root ? classes.root : "",
        classes.rootSize ? classes.rootSize : "pw-min-w-[200px]"
      )}
    >
      <BaseInputLayout
        className={classes.input ?? ""}
        {...props}
        readonly={readonly}
        disabled={disabled}
        fullWidth={true}
      >
        <Select
          value={selectedValue}
          onChange={handleChange}
          disabled={disabled || readonly}
          displayEmpty
          renderValue={() => (
            <div className="pw-text-base pw-leading-4 pw-flex pw-items-center pw-truncate pw-w-full" style={{ pointerEvents: "none" }}>
              {displayValue}
            </div>
          )}
          
          className={classNames(
            "pw-w-full pw-p-0",
            classes.button ?? "",
            readonly ? "!pw-outline-white" : ""
          )}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiSelect-select": {
              padding: "0px !important",
              paddingRight: "32px",
              display: "flex",
              alignItems: "center",
              cursor: disabled ? "auto" : "pointer",
            },
            "& .MuiSelect-icon": {
              right: "8px",
            },
            padding: 0,
            cursor: disabled ? "auto" : "pointer",
            boxShadow: "none",
            backgroundColor: disabled ? "#E9ECEF" : "transparent",
            "&:hover": {
              boxShadow: "none",
            },
            "&.Mui-focused": {
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              backgroundColor: "#E9ECEF",
              cursor: "auto",
              "& .MuiSelect-select": {
                cursor: "auto",
              },
            },
          }}
          MenuProps={{
            PaperProps: {
              className: classNames(
                "pw-bg-white pw-rounded-lg pw-border pw-border-[#DCDCDC] pw-shadow-md",
                classes.option ?? ""
              ),
              sx: {
                maxHeight: 300,
                "& .MuiMenuItem-root": {
                  padding: "8px",
                  minHeight: "32px",
                },
              },
            },
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }}
        >
          {options.map((option, index) => {
            const label = isTranslatable
              ? translate(`${translatePrefix || ""}${option.label}`)
              : option.label;

            return (
              <MenuItem
                key={`${index}-${option.value}`}
                value={option.value}
                disabled={option.disabled}
                className={classNames(
                  "pw-flex pw-gap-2 pw-items-center !pw-min-w-[50px]",
                  classes.option ?? "",
                  !!option.subtitle || !!option.image || !!option.icon
                    ? "pw-min-h-[44px]"
                    : "pw-min-h-[32px]"
                )}
                sx={{
                  "&:hover": {
                    backgroundColor: option.disabled ? "#F4F4F4" : "#E5E7EB",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "white",
                    "&:hover": {
                      backgroundColor: "#E5E7EB",
                    },
                  },
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
                  {label}
                  {option.subtitle ? (
                    <span className="pw-text-xs pw-text-[#676767]">
                      {option.subtitle}
                    </span>
                  ) : null}
                </p>
              </MenuItem>
            );
          })}
        </Select>
      </BaseInputLayout>
    </div>
  );
};

export const BaseSelect = ({ ...props }: Props) => {
  if (props.search) return <SearchSelect {...props} />;
  else if (props.multiple) return <MultipleSelect {...props} />;
  else return <SimpleSelect {...props} />;
};
