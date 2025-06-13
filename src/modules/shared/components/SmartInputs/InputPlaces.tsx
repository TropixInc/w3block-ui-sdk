
import useTranslation from "../../hooks/useTranslation";
import CityAutoComplete from "./CityAutoComplete";
import InputCompletedAddress from "./InputCompletedAddress";

/* eslint-disable @typescript-eslint/no-explicit-any */
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
      {placeType === 'full_address' ? (
        <InputCompletedAddress
          name={name}
          apiValue={docValue}
          type={'postal_code'}
          inputLabel={label}
          inputPlaceholder={
            placeholder ?? translate('shared>inputPlaces>inputPlaceholder')
          }
          required={required}
          readonly={readonly}
          hidenValidations={readonly}
        />
      ) : (
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
          hidenValidations={readonly}
        />
      )}
    </div>
  );
};

export default InputPlaces;
