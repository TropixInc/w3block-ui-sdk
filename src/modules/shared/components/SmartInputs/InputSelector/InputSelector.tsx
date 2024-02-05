/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';

import { DataTypesEnum } from '@w3block/sdk-id';
import _ from 'lodash';

import { usePaginatedGenericApiGet } from '../../../hooks/usePaginatedGenericApiGet/usePaginatedGenericApiGet';
import { FormItemContainer } from '../../Form/FormItemContainer';
import { MultipleSelect } from '../../MultipleSelect';
import { InputDataDTO } from '../../SmartInputsController';

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
  docValue,
}: Props) => {
  const { field } = useController({ name });
  const [firstInput, setFirstInput] = useState(true);
  const [multipleSelected, setMultipleSelected] = useState<
    Array<string | undefined>
  >([]);
  const handleTextChange = (value: string) => {
    if (value) {
      field.onChange({ inputId: name, value: value });
    } else {
      field.onChange({
        inputId: undefined,
        value: undefined,
      });
    }
  };

  const [{ data }] = usePaginatedGenericApiGet({
    url: configData?.url ?? '',
    isPublicApi: configData?.isPublicApi,
    ...paginationMapping[configData?.paginationType || 'internal'],
    enabled: Boolean(configData && configData.url),
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

  useEffect(() => {
    if (firstInput) {
      field.onChange({ inputId: name, value: options[0].value });
      setFirstInput(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className="pw-mt-4 pw-mb-3">
      <label className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
        {label}
      </label>
      <FormItemContainer className="pw-p-[0.6rem]">
        {configData?.isMultiple ? (
          <MultipleSelect
            options={dynamicOptions}
            name={name}
            placeholder={getPlaceholderForMultipleSelect(field?.value || [])}
            classes={{ button: '!pw-border-none', root: '-pw-mt-2' }}
            onChangeMultipleSelected={setMultipleSelected}
            multipleSelected={multipleSelected}
          />
        ) : (
          <select
            name={name}
            onChange={(e) => handleTextChange(e.target.value)}
            className="pw-max-h-[180px] pw-w-full pw-overflow-y-auto pw-text-black"
          >
            <option value="">Selecione uma opção</option>
            {type === DataTypesEnum.SimpleSelect
              ? options.map((val) => (
                  <option
                    key={val.value}
                    selected={docValue === val.value}
                    value={val.value}
                  >
                    {val.label}
                  </option>
                ))
              : dynamicOptions.map((val) => (
                  <option
                    key={val.value}
                    value={val.value}
                    selected={docValue === val.value}
                  >
                    {val.label}
                  </option>
                ))}
          </select>
        )}
      </FormItemContainer>
    </div>
  );
};
