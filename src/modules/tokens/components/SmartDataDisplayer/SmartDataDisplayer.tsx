import { format } from 'date-fns';

import { imageFieldTypes } from '../../../shared/utils/imageFieldTypes';
import { selectionFieldTypes } from '../../../shared/utils/selectionFieldTypes';
import { TokenizationFieldTypes } from '../../enums/tokenizationFieldTypes';
import useFormConfiguration from '../../hooks/useFormConfiguration';
import {
  Dimensions2DValue,
  Dimensions3DValue,
} from '../../interfaces/DimensionsValue';
import {
  DynamicFormConfiguration,
  SelectConfig,
} from '../../interfaces/DynamicFormConfiguration';
import { DynamicFormFieldValue } from '../../interfaces/DynamicFormFieldValue';
import {
  TextFieldDisplay,
  TextFieldDisplayClasses,
} from '../SmartDisplay/TextFieldDisplay';
import { TextFieldEncrypted } from '../SmartDisplay/TextFieldEncrypted';

interface DataDisplayProps {
  fieldName: string;
  value: DynamicFormFieldValue;
  inline?: boolean;
  classes?: TextFieldDisplayClasses;
}

const getDisplayValue = (
  formConfig: DynamicFormConfiguration,
  value: DynamicFormFieldValue,
  fieldType: TokenizationFieldTypes,
  fieldName: string
): string => {
  if (fieldType === TokenizationFieldTypes.DIMENSIONS_3D) {
    const typedValue = value as Dimensions3DValue;
    return `${typedValue.x} x ${typedValue.y} x ${typedValue.z} cm`;
  }
  if (fieldType === TokenizationFieldTypes.DIMENSIONS_2D) {
    const typedValue = value as Dimensions2DValue;
    return `${typedValue.x} x ${typedValue.y} cm`;
  }
  if (fieldType === TokenizationFieldTypes.DATE) {
    return format(new Date(value as string), 'dd/MM/yyyy');
  }
  if (selectionFieldTypes.includes(fieldType)) {
    const { options } = formConfig[fieldName].config as SelectConfig;
    return (
      options.find((option) => option.value === value)?.label ?? String(value)
    );
  }
  return value as string;
};

export const SmartDataDisplayer = ({
  fieldName,
  value,
  inline = false,
  classes = {},
}: DataDisplayProps) => {
  const formConfig = useFormConfiguration();
  const {
    type,
    config: { label },
  } = formConfig[fieldName];
  const displayValue = getDisplayValue(formConfig, value, type, fieldName);

  if (imageFieldTypes.includes(type)) return null;
  return type === TokenizationFieldTypes.ENCRYPTED_TEXT ? (
    <TextFieldEncrypted
      label={label}
      inline={inline}
      value={displayValue}
      classes={classes}
    />
  ) : (
    <TextFieldDisplay
      label={label}
      inline={inline}
      value={displayValue}
      classes={classes}
    />
  );
};
