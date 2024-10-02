import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { countries } from '../../../utils/countries';
import LabelWithRequired from '../../LabelWithRequired';
import { Selectinput } from '../../SelectInput/SelectInput';
import CityAutoComplete from '../InputLocale/CityAutoComplete';

interface InputCompletedAddressProps {
  onChangeRegion?: (value: string | undefined) => void;
  name: string;
  apiValue?: any;
  type: string;
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
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (apiValue) {
      setCountry(apiValue?.country);
    }
  }, [apiValue]);

  return (
    <div className="pw-mt-4">
      <LabelWithRequired name={name} required={required} haveColon={false}>
        {inputLabel}
      </LabelWithRequired>
      <Selectinput
        options={countries ?? []}
        selected={country ?? ''}
        onChange={setCountry}
        className="pw-w-full !pw-h-14"
        placeholder={translate('shared>inputCompletedAddress>selectCountry')}
      />
      {country ? (
        <CityAutoComplete
          country={country ?? ''}
          name={name}
          apiValue={apiValue}
          type={type ?? 'food'}
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
