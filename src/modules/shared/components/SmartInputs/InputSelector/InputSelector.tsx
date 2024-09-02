/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useController } from 'react-hook-form';

import { DataTypesEnum } from '@w3block/sdk-id';
import _ from 'lodash';

import { getDynamicString } from '../../../../storefront/hooks/useDynamicString/useDynamicString';
import { useRouterConnect } from '../../../hooks';
import { usePaginatedGenericApiGet } from '../../../hooks/usePaginatedGenericApiGet/usePaginatedGenericApiGet';
import useTranslation from '../../../hooks/useTranslation';
import { FormItemContainer } from '../../Form/FormItemContainer';
import { ImageSDK } from '../../ImageSDK';
import LabelWithRequired from '../../LabelWithRequired';
import { MultipleSelect } from '../../MultipleSelect';
import { InputDataDTO, InputError } from '../../SmartInputsController';
import { Spinner } from '../../Spinner';
import InputStatus from '../InputStatus';

export interface Options {
  label: string;
  value: string;
}

interface Props {
  options: Options[];
  name: string;
  label: string;
  type: DataTypesEnum;
  configData?: InputDataDTO;
  docValue?: string | object | undefined;
  profilePage?: boolean;
  required?: boolean;
  hidenValidations?: boolean;
  readonly?: boolean;
}

const paginationMapping = {
  internal: {},
  external: {
    inputMap: (data: any) => {
      if (data) {
        return {
          totalItems: data?.meta?.pagination?.total,
          totalPages: data?.meta?.pagination?.pageCount,
        };
      }
    },
    outputMap: (params: any) => {
      const newParams = { ...params, page: undefined };
      newParams['pagination[pageSize]'] = 50;
      newParams['pagination[page]'] = params?.page;

      return newParams;
    },
  },
};

export const InputSelector = ({
  options,
  name,
  label,
  configData,
  type,
  // profilePage = false,
  docValue,
  required,
  hidenValidations,
  readonly,
}: Props) => {
  const { field, fieldState } = useController({ name });
  const error = fieldState?.error as unknown as InputError;
  const router = useRouterConnect();
  const [translate] = useTranslation();
  // const [firstInput, setFirstInput] = useState(true);
  const [multipleSelected, setMultipleSelected] = useState<
    Array<string | undefined>
  >([]);
  const handleTextChange = (value: any) => {
    if (value) {
      field?.onChange({ inputId: name, value: value });
    } else {
      field?.onChange({
        inputId: undefined,
        value: undefined,
      });
    }
  };
  const [showOptions, setShowOptions] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const onChangeInputValue = (value: string | undefined) => {
    setSearchValue(value);
    setInputValue(value);
    setShowOptions(Boolean(value));
  };

  const valueToUse = useMemo(() => {
    if (configData?.approverPath) return (docValue as any)?.id;
    else return docValue;
  }, [configData?.approverPath, docValue]);

  const [{ data, isLoading }] = usePaginatedGenericApiGet({
    url: configData?.url ?? '',
    isPublicApi: configData?.isPublicApi,
    ...paginationMapping[configData?.paginationType || 'internal'],
    enabled: Boolean(configData && configData.url),
    disableParams: configData?.disableParams,
    search: docValue && configData?.search ? valueToUse : searchValue,
    searchType:
      docValue && configData?.search
        ? 'filters[id][$eqi]'
        : configData?.searchType,
  });

  useEffect(() => {
    if (multipleSelected?.length) {
      // if (type === DataTypesEnum.SimpleSelect) {
      //   field?.onChange({
      //     inputId: name,
      //     value: multipleSelected,
      //   });
      // } else
      field?.onChange({
        inputId: name,
        value: JSON.stringify({ values: multipleSelected }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multipleSelected]);

  const dynamicOptions = useMemo(() => {
    if (data) {
      const response = _.get(data, configData?.responsePath || '', []);
      if (response?.length) {
        if (configData?.approverPath) {
          return response.map((item) => {
            const { text: subtitle } = getDynamicString(
              configData?.subtitlePath,
              item
            );
            return {
              label: _.get(item, configData?.labelPath || '', ''),
              subtitle: subtitle,
              image: _.get(item, configData?.imagePath || '', ''),
              value: {
                id: _.get(item, configData?.valuePath || '', '').toString(),
                userId: _.get(item, configData?.approverPath || '', ''),
              },
            };
          });
        } else
          return response.map((item) => {
            const { text: subtitle } = getDynamicString(
              configData?.subtitlePath,
              item
            );
            return {
              label: _.get(item, configData?.labelPath || '', ''),
              subtitle: subtitle,
              image: _.get(item, configData?.imagePath || '', ''),
              value: _.get(item, configData?.valuePath || '', '').toString(),
            };
          });
      } else return [];
    } else return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // useEffect(() => {
  //   if (firstInput && !profilePage) {
  //     field.onChange({ inputId: name, value: options[0].value });
  //     setFirstInput(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const getPlaceholderForMultipleSelectWithValue = (selectedArray: any) => {
    const selected = (selectedArray as Array<string>).map((item) => {
      if (type === DataTypesEnum.DynamicSelect)
        if (dynamicOptions.length) {
          return (dynamicOptions as any)?.find(
            (value: any) => value.value === item
          );
        } else return [];
      else
        return options?.find((value: any) => {
          return value.value === item;
        });
    });
    if (selected?.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (selected as Array<any>)?.map(({ label }) => label).join(', ');
    } else {
      return 'Selecione';
    }
  };

  const getPlaceholderForMultipleSelect = (selectedArray: any) => {
    if (
      selectedArray.value &&
      selectedArray.value !== 'Option value' &&
      multipleSelected?.length > 0
    ) {
      const jsonValues =
        // type === DataTypesEnum.SimpleSelect
        //   ? selectedArray.value
        //   :
        JSON.parse(selectedArray.value)?.values;
      if (jsonValues?.length > 0) {
        const selected = (jsonValues as Array<string>).map((item) => {
          if (type === DataTypesEnum.DynamicSelect)
            return (dynamicOptions as any)?.find(
              (value: any) => value.value === item
            );
          else
            return options?.find((value: any) => {
              return value.value === item;
            });
        });
        if (selected && selected?.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (selected as Array<any>).map(({ label }) => label).join(', ');
        } else {
          return 'Selecione';
        }
      } else {
        return 'Selecione';
      }
    } else {
      return 'Selecione';
    }
  };

  useEffect(() => {
    if (docValue && dynamicOptions.length) {
      const value = (dynamicOptions as any).find((val: any) => {
        if (configData?.approverPath && val?.value?.id) {
          return val?.value?.id === (docValue as any)?.id;
        } else return val?.value === docValue;
      })?.label;
      setInputValue(value);
    }
  }, [configData?.approverPath, docValue, dynamicOptions]);

  useEffect(() => {
    if (docValue) {
      field?.onChange({ inputId: name, value: docValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

  const placeholder = useMemo(() => {
    if (configData?.isMultiple) {
      if (docValue) {
        if (type === DataTypesEnum.DynamicSelect) {
          const jsonValues = JSON.parse(docValue as string);
          return getPlaceholderForMultipleSelectWithValue(jsonValues?.values);
        } else if (typeof docValue === 'string') return docValue;
        else return getPlaceholderForMultipleSelectWithValue(docValue);
      } else return getPlaceholderForMultipleSelect(field?.value || []);
    } else return 'Selecione';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configData?.isMultiple, docValue, field?.value, dynamicOptions]);

  if (router.query.delay) {
    return (
      <div className="pw-mb-6 pw-mx-auto pw-w-full">
        <Spinner />
      </div>
    );
  }

  if (configData?.search) {
    return (
      <div className="pw-relative pw-mb-6">
        <LabelWithRequired name={name} required={required}>
          {label}
        </LabelWithRequired>
        <FormItemContainer
          disableClasses={readonly}
          invalid={fieldState?.invalid}
          className="pw-p-[0.6rem]"
        >
          <input
            type="text"
            className="pw-w-full pw-py-1 pw-outline-none pw-text-black"
            value={inputValue}
            placeholder={translate('shared>inputSelector>selectOption')}
            onChange={(e) => onChangeInputValue(e.target.value)}
            readOnly={readonly}
            autoComplete="new-password"
          />
        </FormItemContainer>
        {showOptions ? (
          <div
            ref={divRef}
            className="pw-max-h-[180px] pw-w-full pw-absolute pw-border pw-overflow-y-auto pw-border-[#94B8ED] pw-bg-white pw-p-2 pw-rounded-lg pw-text-black pw-z-[999]"
          >
            {isLoading ? (
              <div className="pw-mb-6 pw-mx-auto pw-w-full">
                <Spinner />
              </div>
            ) : dynamicOptions?.length ? (
              <ul>
                {dynamicOptions?.map((item) => {
                  return (
                    <li
                      key={item.label}
                      className="pw-px-3 pw-py-2 pw-cursor-pointer pw-rounded-md hover:pw-bg-[#94B8ED]"
                    >
                      <button
                        className="pw-w-full pw-h-full pw-text-left pw-flex pw-items-center pw-gap-2"
                        onClick={(e) => {
                          handleTextChange(item.value);
                          setInputValue(item.label);
                          setShowOptions(false);
                          e.preventDefault();
                        }}
                      >
                        {(item as any).image ? (
                          <ImageSDK
                            alt="avatarImage"
                            src={`${
                              configData?.imageBase + (item as any).image
                            }`}
                            height={30}
                            width={24}
                            className="pw-w-[24px] pw-h-[30px] pw-rounded-sm"
                          />
                        ) : null}
                        <p className="pw-flex pw-flex-col">
                          {item.label}
                          {(item as any).subtitle ? (
                            <span className="pw-text-xs pw-text-[#676767]">
                              {(item as any).subtitle}
                            </span>
                          ) : null}
                        </p>
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
      </div>
    );
  } else {
    return (
      <div className="pw-mb-6">
        <LabelWithRequired name={name} required={required}>
          {label}
        </LabelWithRequired>
        <FormItemContainer
          className="!pw-p-[0.6rem]"
          disableClasses={configData?.isMultiple || readonly}
          invalid={fieldState?.invalid}
        >
          {configData?.isMultiple ? (
            <MultipleSelect
              options={
                type === DataTypesEnum.SimpleSelect ? options : dynamicOptions
              }
              name={name}
              placeholder={placeholder ?? 'Selecione'}
              classes={{
                button: '!pw-border-none pw-h-[48px]',
                root: '!pw-mb-2',
              }}
              onChangeMultipleSelected={setMultipleSelected}
              multipleSelected={multipleSelected}
              disabled={readonly}
            />
          ) : (
            <select
              name={name}
              disabled={readonly}
              onChange={(e) => handleTextChange(e.target.value)}
              className="pw-max-h-[180px] pw-h-[32px] pw-w-full pw-overflow-y-auto pw-bg-inherit pw-text-black pw-outline-none"
            >
              <option className="!pw-p-0" value="">
                {translate('shared>inputSelector>selectOption')}
              </option>
              {type === DataTypesEnum.SimpleSelect
                ? options.map((val) => (
                    <option
                      key={val.value}
                      selected={docValue === val.value}
                      value={val.value}
                      className="!pw-p-0"
                    >
                      {val.label}
                    </option>
                  ))
                : dynamicOptions.map((val) => (
                    <option
                      key={val.value.toString()}
                      value={val.value.toString()}
                      selected={docValue === val.value}
                      className="!pw-p-0"
                    >
                      {val.label}
                    </option>
                  ))}
            </select>
          )}
        </FormItemContainer>
        {!hidenValidations && (
          <div
            className={`${
              configData?.isMultiple ? 'pw-mt-[20px]' : 'pw-mt-[5px]'
            } pw-h-[16px]`}
          >
            {field.value && (
              <InputStatus
                invalid={fieldState.invalid}
                errorMessage={error?.value?.message}
              />
            )}
          </div>
        )}
      </div>
    );
  }
};
