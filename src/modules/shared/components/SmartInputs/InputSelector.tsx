/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';

import { DataTypesEnum } from '@w3block/sdk-id';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { getDynamicString } from '../../../storefront/hooks/useDynamicString';
import { usePaginatedGenericApiGet } from '../../hooks/usePaginatedGenericApiGet';
import { useRouterConnect } from '../../hooks/useRouterConnect';
import { BaseSelect } from '../BaseSelect';
import LabelWithRequired from '../LabelWithRequired';
import { InputDataDTO, InputError } from '../SmartInputsController';
import { Spinner } from '../Spinner';
import InputStatus from './InputStatus';

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
  const [selectedValue, setSelectedValue] = useState<string | undefined>();
  const [multipleSelected, setMultipleSelected] = useState<
    Array<string | undefined>
  >([]);
  const handleTextChange = (value: any) => {
    if (value) {
      setSelectedValue(value);
      field?.onChange({
        inputId: name,
        value: configData?.approverPath ? JSON.parse(value) : value,
      });
    } else {
      field?.onChange({
        inputId: undefined,
        value: undefined,
      });
    }
  };
  const [searchValue, setSearchValue] = useState<string | undefined>();

  const valueToUse = useMemo(() => {
    if (configData?.approverPath) return (docValue as any)?.id;
    else return docValue;
  }, [configData?.approverPath, docValue]);

  const [{ data }] = usePaginatedGenericApiGet({
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
              image:
                _.get(item, configData?.imagePath || '', '') !== ''
                  ? configData?.imageBase +
                    _.get(item, configData?.imagePath || '', '')
                  : _.get(item, configData?.imagePath || '', ''),
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
              image:
                _.get(item, configData?.imagePath || '', '') !== ''
                  ? configData?.imageBase +
                    _.get(item, configData?.imagePath || '', '')
                  : _.get(item, configData?.imagePath || '', ''),
              value: _.get(item, configData?.valuePath || '', '').toString(),
            };
          });
      } else return [];
    } else return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (docValue) {
      if (!configData?.isMultiple) {
        setSelectedValue(docValue as string);
      }
      field?.onChange({ inputId: name, value: docValue });
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

  return (
    <div>
      <LabelWithRequired name={name} required={required}>
        {label}
      </LabelWithRequired>
      <BaseSelect
        disableClasses={readonly}
        invalid={fieldState.invalid}
        valid={!!field?.value && !fieldState.invalid}
        disabled={readonly}
        options={type === DataTypesEnum.SimpleSelect ? options : dynamicOptions}
        onChangeValue={(e) => {
          if (configData?.isMultiple) {
            setMultipleSelected(e);
          } else {
            handleTextChange(e);
          }
        }}
        value={selectedValue ?? multipleSelected?.join(', ') ?? docValue}
        multiple={configData?.isMultiple}
        search={configData?.search}
        searchValue={searchValue}
        setSearch={setSearchValue}
        autoComplete="new-password"
        placeholder={translate('shared>inputSelector>selectOption')}
      />
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
};
