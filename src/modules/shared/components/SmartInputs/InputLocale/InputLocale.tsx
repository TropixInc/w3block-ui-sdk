/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import _ from 'lodash';

import useTranslation from '../../../hooks/useTranslation';
import { BaseSelect } from '../../BaseSelect';
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
  useEffect(() => {
    if (docValue) {
      setSelectCountry(docValue.country);
      setRegion(docValue.region);
    }
  }, [docValue]);

  return (
    <div className="pw-mb-4">
      <LabelWithRequired name={name} required={required}>
        {label}
      </LabelWithRequired>
      <div className="pw-my-2 pw-flex pw-gap-5">
        <div className="pw-w-full">
          <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
            {translate('shared>unputLocale>contry')}
          </p>
          <BaseSelect
            options={optionsLocale}
            placeholder={translate('shared>unputLocale>selectContry')}
            value={
              optionsLocale.find((res) => res.value === selectCountry)?.label
            }
            onChangeValue={(e) => setSelectCountry(e)}
          />
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
