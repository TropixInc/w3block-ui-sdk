import { useEffect, useState } from 'react';

import _ from 'lodash';

import { FormItemContainer } from '../../Form/FormItemContainer';
import CityAutoComplete from './CityAutoComplete';

interface LocaleProps {
  label: string;
  name: string;
  docValue?: string;
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
  const [apiSavedValue, setApiSavedValue] = useState<any>();

  useEffect(() => {
    if (docValue) {
      setApiSavedValue(JSON.parse(docValue));
    }
  }, [docValue]);

  useEffect(() => {
    if (apiSavedValue) {
      setSelectCountry(apiSavedValue.country);
      setRegion(apiSavedValue.region);
    }
  }, [apiSavedValue]);

  return (
    <div className="pw-mb-7">
      <p className="pw-text-lg pw-font-semibold">{label}</p>
      <div className="pw-mt-2 pw-flex pw-gap-2">
        <div className="pw-w-full">
          <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
            País
          </p>
          <FormItemContainer className="pw-p-[0.6rem]">
            <select
              onChange={(e) => setSelectCountry(e.target.value)}
              className="pw-max-h-[180px] pw-w-full pw-h-6 pw-overflow-y-auto pw-bg-white pw-outline-none"
            >
              <option value={''}>Selecione um país..</option>
              {optionsLocale.map((val) => (
                <option
                  selected={
                    apiSavedValue ? apiSavedValue.country === val.value : false
                  }
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
              Estado
            </p>
            <p className="pw-text-[15px] pw-mt-3">{region}</p>
          </div>
        ) : null}
      </div>
      <CityAutoComplete
        key={selectCountry}
        country={selectCountry ?? ''}
        name={name}
        onChangeRegion={setRegion}
        apiValue={apiSavedValue?.placeId}
      />
    </div>
  );
};

export default InputLocale;
