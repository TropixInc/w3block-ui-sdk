/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import _ from 'lodash';

import { FormItemContainer } from '../../Form/FormItemContainer';
import LabelWithRequired from '../../LabelWithRequired';
import CityAutoComplete from './CityAutoComplete';

interface LocaleProps {
  label: string;
  name: string;
  docValue?: any;
  required?: boolean;
  hideRegion?: boolean;
  readonly?: boolean;
}

const optionsLocale = [
  {
    label: 'Brasil',
    value: 'BR',
  },
  {
    label: 'Portugal',
    value: 'PT',
  },
  {
    label: 'United States',
    value: 'US',
  },
  {
    label: 'United Kingdom',
    value: 'GB',
  },
];

const InputLocale = ({
  name,
  label,
  docValue,
  required,
  hideRegion = false,
  readonly,
}: LocaleProps) => {
  const [selectCountry, setSelectCountry] = useState<string | undefined>();
  const [region, setRegion] = useState<string | undefined>();
  const [translate] = useTranslation();
  const { fieldState } = useController({ name });
  useEffect(() => {
    if (docValue) {
      setSelectCountry(docValue.country);
      setRegion(docValue.region);
    }
  }, [docValue]);

  return (
    <div className="pw-mb-7">
      <LabelWithRequired
        classes={{ root: '!pw-text-lg' }}
        name={name}
        required={required}
      >
        {label}
      </LabelWithRequired>
      <div className="pw-mt-2 pw-flex pw-gap-5">
        <div className="pw-w-full">
          <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
            {translate('shared>unputLocale>contry')}
          </p>
          <FormItemContainer
            disableClasses={readonly}
            invalid={fieldState.invalid}
            className="pw-px-[0.6rem] pw-mb-3"
          >
            <select
              onChange={(e) => setSelectCountry(e.target.value)}
              disabled={readonly}
              className="pw-max-h-[180px] pw-h-12 pw-w-full  pw-overflow-y-auto pw-bg-white pw-outline-none pw-text-black"
            >
              <option value={''}>
                {translate('shared>unputLocale>selectContry')}
              </option>
              {optionsLocale?.map((val) => (
                <option
                  selected={docValue ? docValue.country === val.value : false}
                  key={val.value}
                  value={val.value}
                >
                  {val.label}
                </option>
              ))}
            </select>
          </FormItemContainer>
        </div>
        {region && !hideRegion ? (
          <div className="pw-w-[160px]">
            <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
              {translate('shared>unputLocale>state')}
            </p>
            <p className="pw-text-[15px] pw-mt-3 pw-text-black">{region}</p>
          </div>
        ) : null}
      </div>
      {selectCountry ? (
        <CityAutoComplete
          key={selectCountry}
          country={selectCountry ?? ''}
          name={name}
          onChangeRegion={setRegion}
          apiValue={docValue?.placeId}
          type="(cities)"
          readonly={readonly}
          hidenValidations={readonly}
        />
      ) : null}
    </div>
  );
};

export default InputLocale;
