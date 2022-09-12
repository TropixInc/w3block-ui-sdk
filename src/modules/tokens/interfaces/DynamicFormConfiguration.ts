import { TokenizationFieldTypes } from '../enums/tokenizationFieldTypes';
import { TokenizationRequiredField } from './TokenizationRequiredField';

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
