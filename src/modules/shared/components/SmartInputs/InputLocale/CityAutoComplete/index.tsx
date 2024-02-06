import { useEffect, useState } from 'react';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import _ from 'lodash';

import { FormItemContainer } from '../../../Form/FormItemContainer';

interface Address {
  [key: string]: string;
}

interface CityAutocompleteProps {
  country: string;
  onChangeRegion: (value: string | undefined) => void;
  name: string;
  apiValue?: string;
}

function getAddressObject(address_components: any) {
  const ShouldBeComponent = {
    home: ['street_number'],
    postal_code: ['postal_code'],
    street: ['street_address', 'route'],
    region: [
      'administrative_area_level_1',
      'administrative_area_level_2',
      'administrative_area_level_3',
      'administrative_area_level_4',
      'administrative_area_level_5',
    ],
    city: [
      'locality',
      'sublocality',
      'sublocality_level_1',
      'sublocality_level_2',
      'sublocality_level_3',
      'sublocality_level_4',
    ],
    country: ['country'],
  };

  const address = {
    home: '',
    postal_code: '',
    street: '',
    region: '',
    city: '',
    country: '',
  };
  address_components.forEach((component: any) => {
    for (const shouldBe in ShouldBeComponent) {
      if (
        _.get(ShouldBeComponent, shouldBe).indexOf(component.types[0]) !== -1
      ) {
        (address as Address)[shouldBe] = component.short_name;
      }
    }
  });
  return address;
}

const CityAutoComplete = ({
  country,
  onChangeRegion,
  name,
  apiValue,
}: CityAutocompleteProps) => {
  const { field, fieldState } = useController({ name });
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [translate] = useTranslation();
  const [placeId, setPlaceId] = useState<string | undefined>();
  const [showOptions, setShowOptions] = useState(false);
  const { placesService, placePredictions, getPlacePredictions } =
    usePlacesService({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      options: {
        componentRestrictions: { country: country },
        types: ['(cities)'],
      },
      language: 'pt-br',
      debounce: 400,
    });

  useEffect(() => {
    getPlacePredictions({ input: '' });
    setInputValue(undefined);
    setShowOptions(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const onChangeInputValue = (value: string | undefined) => {
    getPlacePredictions({ input: value });
    setInputValue(value);
    setShowOptions(Boolean(value));
  };
  useEffect(() => {
    if (placeId) {
      placesService?.getDetails(
        {
          placeId: placeId,
        },
        (placeDetails: any) => {
          const components = getAddressObject(placeDetails.address_components);
          setInputValue(`${components.city}, ${components.region}`);
          onChangeRegion(components.region);
          field.onChange({
            inputId: name,
            value: { ...components, placeId: placeId },
          });
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId]);

  useEffect(() => {
    if (apiValue) {
      setPlaceId(apiValue);
    }
  }, [apiValue]);

  const options = () => {
    if (placePredictions.length) {
      return placePredictions.map((item) => {
        const option = item.terms.slice(0, -1);
        const labelOption = option.map((item: any) => item.value);
        return {
          label: labelOption.join(', '),
          value: item.place_id,
        };
      });
    }
  };

  return (
    <div className="pw-mt-3 pw-relative">
      <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
        {translate('shared>cityAutoComplete>city')}
      </p>
      <FormItemContainer
        invalid={fieldState.invalid}
        className="pw-p-[0.6rem] pw-h-11"
      >
        <input
          type="text"
          className="pw-w-full pw-outline-none"
          value={inputValue}
          placeholder={translate('shared>cityAutoComplete>searchCity')}
          onChange={(e) => onChangeInputValue(e.target.value)}
          disabled={!country.length}
        />
      </FormItemContainer>
      {showOptions ? (
        <div className="pw-max-h-[180px] pw-w-full pw-absolute pw-border pw-overflow-y-auto pw-border-[#94B8ED] pw-bg-white pw-p-2 pw-rounded-lg">
          {placePredictions.length ? (
            <ul>
              {options()?.map((item) => {
                return (
                  <li
                    key={item.label}
                    className="pw-px-3 pw-py-2 pw-cursor-pointer pw-rounded-md hover:pw-bg-[#94B8ED]"
                  >
                    <button
                      className="pw-w-full pw-h-full"
                      onClick={(e) => {
                        setPlaceId(item.value);
                        setShowOptions(false);
                        e.preventDefault();
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Não há resultados</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default CityAutoComplete;
