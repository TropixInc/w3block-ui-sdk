/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useController } from 'react-hook-form';

import { DataTypesEnum } from '@w3block/sdk-id';
import _ from 'lodash';

import { useRouterConnect } from '../../../hooks';
import { usePaginatedGenericApiGet } from '../../../hooks/usePaginatedGenericApiGet/usePaginatedGenericApiGet';
import { FormItemContainer } from '../../Form/FormItemContainer';
import LabelWithRequired from '../../LabelWithRequired';
import { MultipleSelect } from '../../MultipleSelect';
import { InputDataDTO } from '../../SmartInputsController';
import { Spinner } from '../../Spinner';

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
  docValue?: string;
  profilePage?: boolean;
  required?: boolean;
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
}: Props) => {
  const { field, fieldState } = useController({ name });
  const router = useRouterConnect();
  // const [firstInput, setFirstInput] = useState(true);
  const [multipleSelected, setMultipleSelected] = useState<
    Array<string | undefined>
  >([]);
  const handleTextChange = (value: string) => {
    if (value) {
      field.onChange({ inputId: name, value: value.toString() });
    } else {
      field.onChange({
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
  const [{ data, isLoading }] = usePaginatedGenericApiGet({
    url: configData?.url ?? '',
    isPublicApi: configData?.isPublicApi,
    ...paginationMapping[configData?.paginationType || 'internal'],
    enabled: Boolean(configData && configData.url),
    disableParams: configData?.disableParams,
    search: searchValue,
    searchType: configData?.searchType,
  });
  useEffect(() => {
    if (multipleSelected.length) {
      field.onChange({
        inputId: name,
        value: JSON.stringify({ values: multipleSelected }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multipleSelected]);

  const dynamicOptions = useMemo(() => {
    if (data) {
      const response = _.get(data, configData?.responsePath || '', []);
      if (response.length) {
        return response.map((item) => ({
          label: _.get(item, configData?.labelPath || '', ''),
          value: _.get(item, configData?.valuePath || '', ''),
        }));
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

  const getPlaceholderForMultipleSelect = (selectedArray: any) => {
    if (
      selectedArray.value &&
      selectedArray.value !== 'Option value' &&
      multipleSelected.length > 0
    ) {
      const jsonValues = JSON.parse(selectedArray.value);

      if (jsonValues.values.length > 0) {
        const selected = (jsonValues.values as Array<string>).map((item) => {
          return dynamicOptions?.find(({ value }) => value === item);
        });

        if (selected.length > 0) {
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
    if (docValue && dynamicOptions) {
      const value = dynamicOptions.find(
        (val) => val.value.toString() === docValue
      )?.label;
      setInputValue(value);
    }
  }, [docValue, dynamicOptions]);

  useEffect(() => {
    if (docValue) {
      field.onChange({ inputId: name, value: docValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docValue]);

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
          invalid={fieldState.invalid}
          className="pw-p-[0.6rem]"
        >
          <input
            type="text"
            className="pw-w-full pw-py-1 pw-outline-none pw-text-black"
            value={inputValue}
            placeholder={'Selecione uma opção'}
            onChange={(e) => onChangeInputValue(e.target.value)}
            autoComplete="off"
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
            ) : dynamicOptions.length ? (
              <ul>
                {dynamicOptions?.map((item) => {
                  return (
                    <li
                      key={item.label}
                      className="pw-px-3 pw-py-2 pw-cursor-pointer pw-rounded-md hover:pw-bg-[#94B8ED]"
                    >
                      <button
                        className="pw-w-full pw-h-full pw-text-left"
                        onClick={(e) => {
                          handleTextChange(item.value);
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
              <p>Não há resultados</p>
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
          invalid={fieldState.invalid}
        >
          {configData?.isMultiple ? (
            <MultipleSelect
              options={dynamicOptions}
              name={name}
              placeholder={getPlaceholderForMultipleSelect(field?.value || [])}
              classes={{
                button: '!pw-border-none pw-h-[48px]',
                root: '-pw-mt-2 ',
              }}
              onChangeMultipleSelected={setMultipleSelected}
              multipleSelected={multipleSelected}
            />
          ) : (
            <select
              name={name}
              onChange={(e) => handleTextChange(e.target.value)}
              className="pw-max-h-[180px] pw-h-[32px] pw-w-full pw-overflow-y-auto pw-bg-inherit pw-text-black pw-outline-none"
            >
              <option className="!pw-p-0" value="">
                Selecione uma opção
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
                      key={val.value}
                      value={val.value}
                      selected={docValue === val.value}
                      className="!pw-p-0"
                    >
                      {val.label}
                    </option>
                  ))}
            </select>
          )}
        </FormItemContainer>
      </div>
    );
  }
};
