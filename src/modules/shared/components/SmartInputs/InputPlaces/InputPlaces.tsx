import { useTranslation } from 'react-i18next';

import CityAutoComplete from '../InputLocale/CityAutoComplete';

interface PlacesProps {
  label: string;
  name: string;
  docValue?: any;
  placeType?: string;
  placeCountry?: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
}

const InputPlaces = ({
  label,
  name,
  docValue,
  placeCountry,
  placeType,
  placeholder,
  required,
  readonly,
}: PlacesProps) => {
  const [translate] = useTranslation();
  return (
    <div>
      <CityAutoComplete
        country={placeCountry ?? ''}
        name={name}
        apiValue={docValue?.placeId}
        type={placeType ?? 'food'}
        inputLabel={label}
        inputPlaceholder={
          placeholder ?? translate('shared>inputPlaces>inputPlaceholder')
        }
        required={required}
        readonly={readonly}
      />
    </div>
  );
};

export default InputPlaces;
