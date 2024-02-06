/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import _ from 'lodash';

import { FormItemContainer } from '../../Form/FormItemContainer';
import CityAutoComplete from './CityAutoComplete';

interface LocaleProps {
  label: string;
  name: string;
  docValue?: any;
}

const optionsLocale = [
  {
    label: 'Brasil',
    value: 'BR',
  },
  {
    label: 'Potugal',
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

const InputLocale = ({ name, label, docValue }: LocaleProps) => {
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
    <div className="pw-mb-7">
      <p className="pw-text-lg pw-font-semibold pw-text-black">{label}</p>
      <div className="pw-mt-2 pw-flex pw-gap-5">
        <div className="pw-w-full">
          <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
            {translate('shared>unputLocale>contry')}
          </p>
          <FormItemContainer className="pw-p-[0.6rem]">
            <select
              onChange={(e) => setSelectCountry(e.target.value)}
              className="pw-max-h-[180px] pw-w-full pw-h-6 pw-overflow-y-auto pw-bg-white pw-outline-none pw-text-black"
            >
              <option value={''}>
                {translate('shared>unputLocale>selectContry')}
              </option>
              {optionsLocale.map((val) => (
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
        {region ? (
          <div className="pw-w-[160px]">
            <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
              {translate('shared>unputLocale>state')}
            </p>
            <p className="pw-text-[15px] pw-mt-3 pw-text-black">{region}</p>
          </div>
        ) : null}
      </div>
      <CityAutoComplete
        key={selectCountry}
        country={selectCountry ?? ''}
        name={name}
        onChangeRegion={setRegion}
        apiValue={docValue?.placeId}
      />
    </div>
  );
};

export default InputLocale;
