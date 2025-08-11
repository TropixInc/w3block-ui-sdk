import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { UserDocumentStatus } from '@w3block/sdk-id';
import { getCountryData, TCountryCode } from 'countries-list';
import {
  AsYouType,
  CountryCode,
  getCountries,
  getCountryCallingCode,
} from 'libphonenumber-js';
import { validateIfStatusKycIsReadonly } from '../../../shared/utils/validReadOnlyKycStatus';
import { BaseInput } from '../BaseInput';
import { BaseSelect } from '../BaseSelect';
import LabelWithRequired from '../LabelWithRequired';
import { InputError } from '../SmartInputsController';
import InputStatus from './InputStatus';
import { Flag } from '../Flag';


interface InputPhoneProps {
  label: string;
  name: string;
  readonly?: boolean;
  docValue?: string;
  docStatus?: UserDocumentStatus;
  hidenValidations?: boolean;
  required?: boolean;
  defaultCountry?: string;
}

const InputPhone = ({
  label,
  name,
  docValue,
  docStatus,
  hidenValidations = false,
  required,
  readonly,
  defaultCountry,
}: InputPhoneProps) => {
  const { field, fieldState } = useController({ name });
  const [countryCode, setCountryCode] = useState<string | undefined>();
  const [country, setCountry] = useState<string | undefined>();
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const error = fieldState?.error as unknown as InputError;

  const getCountryName = (country: string) => {
    const overrides: Record<string, string> = {
      BR: 'Brasil',
      AC: 'Ascension Island',
    };
    return (
      overrides[country] ||
      getCountryData(country as TCountryCode)?.name ||
      country
    );
  };
  const countries = getCountries().map((country) => ({
    icon: <Flag country={country as CountryCode} />,
    value: country,
    label: `${getCountryName(country)} (+${getCountryCallingCode(
      country as CountryCode
    )})`,
    code: `+${getCountryCallingCode(country as CountryCode)}`,
  }));
  countries.sort((a, b) => a.label.localeCompare(b.label));

  const handleChange = (value: string) => {
    if (value) {
      const formattedText = new AsYouType(country as CountryCode).input(value);
      setPhoneNumber(formattedText);
      const newValue = `${countryCode} ${formattedText}`;
      field.onChange({ inputId: name, value: newValue });
    } else {
      setPhoneNumber('');
      field.onChange({
        inputId: undefined,
        value: undefined,
      });
    }
  };

  useEffect(() => {
    if (defaultCountry) {
      const countryData = countries.find(
        (c) => c.value === defaultCountry || c.code === defaultCountry
      );
      if (countryData) {
        setCountry(countryData.value);
        setCountryCode(countryData.code);
      } else {
        setCountry(undefined);
        setCountryCode(undefined);
      }
    }
  }, [defaultCountry, countries]);

  useEffect(() => {
    if (docValue && docStatus !== UserDocumentStatus.RequiredReview) {
      const doc = docValue.trim();
      const regex = /^(\+\d{1,4})\s*(.+)$/;
      const match = doc.match(regex);
      if (match) {
        if (match[1] === '+1') {
          setCountry('US');
        } else if (match[1] === '+44') {
          setCountry('GB');
        } else {
          setCountry(countries.find((c) => c.code === match[1])?.value);
        }
        setCountryCode(match[1]);
        setPhoneNumber(match[2]);
        field.onChange({ inputId: name, value: docValue });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  return (
    <div className="pw-w-full">
      <LabelWithRequired name={name} required={required}>
        {label}
      </LabelWithRequired>
      <div className="pw-flex pw-w-full pw-gap-[10px]">
        <BaseSelect
          options={countries}
          value={country}
          disabled={!!defaultCountry || readonly}
          onChangeValue={(value) => {
            setCountry(value);
            setCountryCode(countries.find((c) => c.value === value)?.code);
          }}
        />
        <BaseInput
          disableClasses={readonly}
          invalid={fieldState.invalid}
          valid={!!field?.value && !fieldState.invalid}
          disabled={
            (docStatus && validateIfStatusKycIsReadonly(docStatus)) || readonly
          }
          readOnly={
            (docStatus && validateIfStatusKycIsReadonly(docStatus)) || readonly
          }
          name={name}
          value={phoneNumber}
          onChange={(e) => handleChange(e.target.value)}
          className="pw-w-full"
        />
      </div>
      {!hidenValidations && (
        <p className="pw-mt-[5px] pw-h-[16px]">
          {field.value && (
            <InputStatus
              invalid={fieldState.invalid}
              errorMessage={error?.value?.message}
            />
          )}
        </p>
      )}
    </div>
  );
};

export default InputPhone;
