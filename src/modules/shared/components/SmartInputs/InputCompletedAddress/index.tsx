/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';

import useTranslation from '../../../hooks/useTranslation';
import { countries } from '../../../utils/countries';
import { BaseSelect } from '../../BaseSelect';
import LabelWithRequired from '../../LabelWithRequired';
import CityAutoComplete from '../InputLocale/CityAutoComplete';

interface InputCompletedAddressProps {
  onChangeRegion?: (value: string | undefined) => void;
  name: string;
  apiValue?: any;
  type: Array<string>;
  inputLabel?: string;
  inputPlaceholder?: string;
  hidenValidations?: boolean;
  required?: boolean;
  readonly?: boolean;
}

const InputCompletedAddress = ({
  name,
  type,
  apiValue,
  hidenValidations,
  inputLabel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inputPlaceholder,
  readonly,
  required,
}: InputCompletedAddressProps) => {
  const [translate] = useTranslation();
  const [country, setCountry] = useState<{ value: string; label: string }>();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (apiValue) {
      setCountry({
        value: apiValue?.country,
        label:
          countriesFiltered?.find((res) => res.value === apiValue?.country)
            ?.label ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiValue]);

  const countriesFiltered = useMemo(() => {
    if (search !== '')
      return countries.filter((res) =>
        res?.label?.toLowerCase()?.includes(search?.toLowerCase())
      );
    else return countries;
  }, [search]);

  return (
    <div className="pw-flex pw-flex-col pw-gap-5 pw-mb-3">
      <div>
        <LabelWithRequired name={name} required={required} haveColon={false}>
          {inputLabel}
        </LabelWithRequired>
        <BaseSelect
          options={countriesFiltered}
          value={country}
          search
          searchValue={search}
          setSearch={setSearch}
          onChangeValue={(e) => setCountry(e)}
          placeholder={translate('shared>inputCompletedAddress>selectCountry')}
          classes={{ root: 'pw-mb-2' }}
        />
      </div>
      {country ? (
        <CityAutoComplete
          country={country.value ?? ''}
          name={name}
          apiValue={apiValue}
          type={type}
          inputLabel={translate('shared>inputCompletedAddress>enterZipCode')}
          inputPlaceholder={translate('shared>inputCompletedAddress>zipCode')}
          required={required}
          readonly={readonly}
          hidenValidations={hidenValidations}
        />
      ) : null}
    </div>
  );
};

export default InputCompletedAddress;
