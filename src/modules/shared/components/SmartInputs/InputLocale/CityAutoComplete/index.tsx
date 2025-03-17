/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { useController } from 'react-hook-form';
import { useClickAway, useDebounce } from 'react-use';

import _ from 'lodash';

import useTranslation from '../../../../hooks/useTranslation';
import { BaseInput } from '../../../BaseInput';
import LabelWithRequired from '../../../LabelWithRequired';
import { InputError } from '../../../SmartInputsController';
import InputStatus from '../../InputStatus';

interface Address {
  [key: string]: string;
}

interface CityAutocompleteProps {
  country: string;
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

function getAddressObject(address_components: any) {
  const ShouldBeComponent = {
    home: ['street_number'],
    postal_code: ['postal_code'],
    street_address_1: ['street_address', 'route'],
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
    street_address_1: '',
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
  type,
  inputLabel,
  inputPlaceholder,
  hidenValidations,
  required,
  readonly,
}: CityAutocompleteProps) => {
  const { field, fieldState } = useController({ name });
  const divRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string | undefined>();
  const error = fieldState?.error as unknown as InputError;
  const [translate, locale] = useTranslation();
  const [placeId, setPlaceId] = useState<string | undefined>();
  const [showOptions, setShowOptions] = useState(false);
  const [placeNumber, setPlaceNumber] = useState('');
  const [placeCompliment, setPlaceCompliment] = useState('');
  const { placesService, placePredictions, getPlacePredictions } =
    usePlacesService({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? '',
      options: {
        componentRestrictions: { country: country ? country : '' },
        types: [type],
      },
      language: locale.language ?? 'pt-BR',
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

  useDebounce(
    () => {
      if (type === 'postal_code') {
        field.onChange({
          ...field.value,
          value: { ...field?.value?.value, street_number: placeNumber },
        });
      }
    },
    500,
    [placeNumber]
  );

  useDebounce(
    () => {
      if (type === 'postal_code') {
        field.onChange({
          ...field.value,
          value: { ...field?.value?.value, street_address_2: placeCompliment },
        });
      }
    },
    500,
    [placeCompliment]
  );

  const getDetails = useCallback(() => {
    if (placeId && placesService) {
      try {
        placesService?.getDetails(
          {
            placeId: placeId,
          },
          (placeDetails: any) => {
            const components = getAddressObject(
              placeDetails.address_components
            );

            if (type === '(cities)') {
              setInputValue(`${components.city}, ${components.region}`);
              onChangeRegion && onChangeRegion(components.region);
              field.onChange({
                inputId: name,
                value: { ...components, placeId: placeId },
              });
            } else if (type === 'postal_code') {
              setInputValue(`${placeDetails.formatted_address}`);
              field.onChange({
                inputId: name,
                value: {
                  ...components,
                  home: `${placeDetails.formatted_address}`,
                  placeId: placeId,
                },
              });
            } else {
              setInputValue(
                `${placeDetails.name} - ${placeDetails.formatted_address}`
              );
              field.onChange({
                inputId: name,
                value: {
                  ...components,
                  home: `${placeDetails.name} - ${placeDetails.formatted_address}`,
                  placeId: placeId,
                },
              });
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId, placesService]);

  const resolveInput = () => {
    if (placeId) {
      getDetails();
    } else {
      setInputValue('');
    }
  };

  useEffect(() => {
    if (placeId) getDetails();
  }, [placeId, getDetails]);

  useEffect(() => {
    if (apiValue) {
      if (type === 'postal_code') {
        setPlaceId(apiValue?.placeId);
        setPlaceNumber(apiValue?.street_number);
        setPlaceCompliment(apiValue?.street_address_2);
      } else {
        setPlaceId(apiValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useClickAway(divRef, () => {
    setShowOptions(false);
  });

  return (
    <div className="pw-relative">
      <LabelWithRequired name={name} required={required} haveColon={false}>
        {inputLabel ?? translate('shared>cityAutoComplete>city')}
      </LabelWithRequired>

      <BaseInput
        disableClasses={readonly}
        invalid={fieldState.invalid}
        valid={!!field?.value && !fieldState.invalid}
        disabled={readonly || !country.length}
        className="pw-mb-2 !pw-text-black"
        type="text"
        value={inputValue}
        placeholder={
          inputPlaceholder ?? translate('shared>cityAutoComplete>searchCity')
        }
        onChange={(e) => onChangeInputValue(e.target.value)}
        readOnly={readonly}
        autoComplete="new-password"
        onBlur={() => {
          resolveInput();
        }}
      />
      {showOptions ? (
        <div
          ref={divRef}
          className="pw-max-h-[180px] pw-w-full pw-absolute pw-border pw-overflow-y-auto pw-border-[#94B8ED] pw-bg-white pw-p-2 pw-rounded-lg pw-text-black pw-z-[999]"
        >
          {placePredictions.length ? (
            <ul>
              {options()?.map((item) => {
                return (
                  <li
                    key={item.label}
                    className="pw-px-3 pw-py-2 pw-cursor-pointer pw-rounded-md hover:pw-bg-[#94B8ED]"
                  >
                    <button
                      className="pw-w-full pw-h-full pw-text-left !pw-text-black"
                      onClick={(e) => {
                        setPlaceId(item.value);
                        type !== '(cities)' && setInputValue(item.label);
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
            <p>{translate('shared>inputLocale>notResults')}</p>
          )}
        </div>
      ) : null}
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

      {type === 'postal_code' ? (
        <div className="pw-flex pw-gap-x-2 pw-mt-2">
          <div className="pw-w-full sm:pw-max-w-[255px]">
            <LabelWithRequired required={required} haveColon={false}>
              {translate('shared>inputCompletedAddress>enterPlaceNumber')}
            </LabelWithRequired>

            <BaseInput
              disableClasses={readonly}
              invalid={fieldState.invalid}
              valid={!!field?.value && !fieldState.invalid}
              disabled={readonly}
              type="text"
              value={placeNumber}
              className="!pw-text-black"
              placeholder={translate(
                'shared>inputCompletedAddress>enterPlaceNumber'
              )}
              onChange={(e) => setPlaceNumber(e.target.value)}
              readOnly={readonly}
            />
          </div>
          <div className="pw-flex-1">
            <LabelWithRequired haveColon={false}>
              {translate('shared>inputCompletedAddress>enterCompliment')}
            </LabelWithRequired>
            <BaseInput
              disableClasses={readonly}
              invalid={fieldState.invalid}
              valid={!!field?.value && !fieldState.invalid}
              className="!pw-text-black"
              disabled={readonly}
              type="text"
              value={placeCompliment}
              placeholder={translate('shared>inputCompletedAddress>compliment')}
              onChange={(e) => setPlaceCompliment(e.target.value)}
              readOnly={readonly}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CityAutoComplete;
