import { TokenizationFieldTypes } from '../enums/TokenizationFieldTypes';

export type TokenizationRequiredField = boolean | 'NEED_CONFIRMATION';

export interface GenericConfig {
  required: TokenizationRequiredField;
  label: string;
  tooltip?: string;
  placeholder?: string;
  order?: number;
}

export interface SelectOption<ValueType> {
  value: ValueType;
  label: string;
}

export interface SelectConfig extends GenericConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Array<SelectOption<any>>;
  showLearnMore?: boolean;
}

export interface NumbersTextFieldConfig extends GenericConfig {
  float?: boolean;
}

export interface YearConfig extends GenericConfig {
  range: {
    min: number;
    max?: number;
  };
}

export interface DynamicFormItemConfiguration {
  type: TokenizationFieldTypes;
  config: GenericConfig | SelectConfig | NumbersTextFieldConfig;
}
export interface DynamicFormConfiguration {
  [fieldName: string]: DynamicFormItemConfiguration;
}
