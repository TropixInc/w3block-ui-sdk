/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { useController } from 'react-hook-form';
import { useClickAway, useDebounce } from 'react-use';

import _ from 'lodash';
import { BaseInput } from '../BaseInput';
import LabelWithRequired from '../LabelWithRequired';
import { InputError } from '../SmartInputsController';
import InputStatus from './InputStatus';
import useTranslation from '../../hooks/useTranslation';

interface Address {
  [key: string]: string;
}

interface Components {
  home?: string;
  postal_code?: string;
  street_address_1?: string;
  region?: string;
  city?: string;
  country?: string;
}

interface CityAutocompleteProps {
  country: string;
  onChangeRegion?: (value: string | undefined) => void;
  name: string;
  apiValue?: any;
  type: Array<string>;
  inputLabel?: string;
  inputPlaceholder?: string;
  hidenValidations?: boolean;
  required?: boolean;
  readonly?: boolean;
  onlyZipCode?: boolean;
}

function getAddressObject(address_components: any) {
  const ShouldBeComponent = {
    home: ['street_number'],
    postal_code: ['postal_code'],
    street_address_1: ['street_address', 'route'],
    region: [
      'administrative_area_level_1',
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
      'administrative_area_level_2',
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
  onlyZipCode,
}: CityAutocompleteProps) => {
  const { field, fieldState } = useController({ name });
  const divRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string | undefined>();
  const error = fieldState?.error as unknown as InputError;
  const [translate, locale] = useTranslation();
  const [placeId, setPlaceId] = useState<string | undefined>();
  const [addressError, setAddressError] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [placeNumber, setPlaceNumber] = useState('');
  const [placeCompliment, setPlaceCompliment] = useState('');
  const [subLocality, setSubLocality] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [isStreetAddressFound, setIsStreetAddressFound] = useState(true);
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [isCityFound, setIsCityFound] = useState(true);
  const [isRegionFound, setIsRegionFound] = useState(true);
  const { placesService, placePredictions, getPlacePredictions } =
    usePlacesService({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? '',
      options: {
        componentRestrictions: { country: country ? country : '' },
        types: type,
      },
      language: locale.language ?? 'pt-BR',
      debounce: 400,
    });

  useEffect(() => {
    getPlacePredictions({ input: '' });
    setInputValue(undefined);
    setShowOptions(false);
    setSubLocality('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const onChangeInputValue = (value: string | undefined) => {
    getPlacePredictions({ input: value });
    setInputValue(value);
    setShowOptions(Boolean(value));
  };

  useDebounce(
    () => {
      if (type.includes('postal_code')) {
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
      if (type.includes('postal_code')) {
        field.onChange({
          ...field.value,
          value: { ...field?.value?.value, street_address_2: placeCompliment },
        });
      }
    },
    500,
    [placeCompliment]
  );

  useDebounce(
    () => {
      if (type.includes('postal_code')) {
        field.onChange({
          ...field.value,
          value: { ...field?.value?.value, street_address_1: streetAddress },
        });
      }
    },
    500,
    [streetAddress]
  );

  useDebounce(
    () => {
      if (type.includes('postal_code')) {
        field.onChange({
          ...field.value,
          value: { ...field?.value?.value, city: city },
        });
      }
    },
    500,
    [city]
  );

  useDebounce(
    () => {
      if (type.includes('postal_code')) {
        field.onChange({
          ...field.value,
          value: { ...field?.value?.value, region: region },
        });
      }
    },
    500,
    [region]
  );
  const transformComponents = (components: Components) => {
    const defaultComponents = {
      home: '',
      postal_code: '',
      street_address_1: '',
      region: '',
      city: '',
      country: '',
    };

    const result = { ...defaultComponents };

    for (const key in components) {
      const typedKey = key as keyof Components;
      result[typedKey] = components[typedKey] || '';
    }

    return result;
  };

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
            const transformedComponents = transformComponents(components);

            if (type.includes('(cities)')) {
              setInputValue(
                `${transformedComponents.city}, ${transformedComponents.region}`
              );
              onChangeRegion && onChangeRegion(transformedComponents.region);
              field.onChange({
                inputId: name,
                value: { ...transformedComponents, placeId: placeId },
              });
            } else if (type.includes('postal_code')) {
              const sublocalityName = placeDetails.address_components.find(
                (component: any) =>
                  component.types.includes('sublocality') &&
                  component.types.includes('sublocality_level_1')
              )?.long_name;
              setSubLocality(sublocalityName ?? '');
              setStreetAddress(transformedComponents.street_address_1 || '');
              setIsStreetAddressFound(!!transformedComponents.street_address_1);
              setCity(transformedComponents.city || '');
              setRegion(transformedComponents.region || '');
              setIsCityFound(!!transformedComponents.city);
              setIsRegionFound(!!transformedComponents.region);
              setInputValue(
                onlyZipCode
                  ? transformedComponents.postal_code
                  : `${transformedComponents.street_address_1}${
                      sublocalityName ? ` - ${sublocalityName}` : ''
                    }, ${transformedComponents.city} - ${
                      transformedComponents.region
                    }, ${transformedComponents.postal_code}, ${
                      transformedComponents.country
                    }`
              );
              field.onChange({
                inputId: name,
                value: {
                  ...transformedComponents,
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
                  ...transformedComponents,
                  home: `${placeDetails.name} - ${placeDetails.formatted_address}`,
                  placeId: placeId,
                },
              });
            }
            setAddressError(false);
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
      if (type.includes('postal_code')) {
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
        invalid={fieldState.invalid}
        valid={!!field?.value && !fieldState.invalid}
        disabled={readonly || !country.length}
        className="pw-mb-2 !pw-text-black"
        type="text"
        inputMode={onlyZipCode ? 'tel' : undefined}
        pattern={onlyZipCode ? '[0-9\\s-]*' : undefined}
        value={inputValue}
        placeholder={
          inputPlaceholder ?? translate('shared>cityAutoComplete>searchCity')
        }
        onChange={(e) => {
          const raw = e.target.value;
          const next = onlyZipCode ? raw.replace(/[^0-9\s-]/g, '') : raw;
          onChangeInputValue(next);
        }}
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
                        !type.includes('(cities)') &&
                          !onlyZipCode &&
                          setInputValue(item.label);
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
          {(addressError || field.value) && (
            <InputStatus
              invalid={addressError ? addressError : fieldState.invalid}
              errorMessage={
                addressError
                  ? translate('shared>cityAutoComplete>addressNotFound')
                  : error?.value?.message
              }
            />
          )}
        </p>
      )}

      {onlyZipCode && type.includes('postal_code') ? (
        <div className="pw-flex pw-flex-col pw-gap-y-2 pw-mt-2">
          <div className="pw-mb-3">
            <LabelWithRequired haveColon={false}>
              {translate('shared>cityAutoComplete>street')}
            </LabelWithRequired>
            <BaseInput
              value={streetAddress}
              placeholder={
                isStreetAddressFound
                  ? ''
                  : translate('shared>cityAutoComplete>street')
              }
              onChange={(e) => setStreetAddress(e.target.value)}
              className={
                isStreetAddressFound
                  ? '!pw-outline-none focus:!pw-outline-none !pw-p-0'
                  : ''
              }
              readOnly={readonly || isStreetAddressFound}
            />
          </div>
          <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-6 pw-gap-x-2 pw-mb-3">
            <div className="pw-flex-1">
              <LabelWithRequired required={required} haveColon={false}>
                {translate('shared>inputCompletedAddress>enterPlaceNumber')}
              </LabelWithRequired>
              <BaseInput
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
                invalid={fieldState.invalid}
                valid={!!field?.value && !fieldState.invalid}
                className="!pw-text-black"
                disabled={readonly}
                type="text"
                value={placeCompliment}
                placeholder={translate(
                  'shared>inputCompletedAddress>compliment'
                )}
                onChange={(e) => setPlaceCompliment(e.target.value)}
                readOnly={readonly}
              />
            </div>
          </div>
          {subLocality ? (
            <div className="pw-mb-3">
              <LabelWithRequired haveColon={false}>
                {translate('shared>cityAutoComplete>neighborhood')}
              </LabelWithRequired>
              <BaseInput readonly value={subLocality} />
            </div>
          ) : null}
          <div className="pw-flex pw-gap-6 pw-flex-col sm:pw-flex-row pw-gap-x-2 pw-mb-3">
            <div className="pw-flex-1">
              <LabelWithRequired haveColon={false}>
                {translate('shared>cityAutoComplete>city')}
              </LabelWithRequired>
              <BaseInput
                disabled={readonly}
                className={
                  isCityFound
                    ? '!pw-outline-none focus:!pw-outline-none !pw-p-0'
                    : ''
                }
                value={city}
                placeholder={
                  isCityFound ? '' : translate('shared>cityAutoComplete>city')
                }
                onChange={(e) => setCity(e.target.value)}
                readOnly={readonly || isCityFound}
              />
            </div>
            <div className="pw-flex-1">
              <LabelWithRequired haveColon={false}>
                {translate('shared>cityAutoComplete>region')}
              </LabelWithRequired>
              <BaseInput
                disabled={readonly}
                className={
                  isRegionFound
                    ? '!pw-outline-none focus:!pw-outline-none !pw-p-0'
                    : ''
                }
                value={region}
                placeholder={isRegionFound ? '' : translate('shared>cityAutoComplete>region')}
                onChange={(e) => setRegion(e.target.value)}
                readOnly={readonly || isRegionFound}
              />
            </div>
          </div>
        </div>
      ) : null}

      {!onlyZipCode && type.includes('postal_code') ? (
        <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-x-2 pw-mt-2">
          <div className="pw-w-full sm:pw-max-w-[255px]">
            <LabelWithRequired required={required} haveColon={false}>
              {translate('shared>inputCompletedAddress>enterPlaceNumber')}
            </LabelWithRequired>

            <BaseInput
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
