import { Dimensions2DValue, Dimensions3DValue } from './DimensionsValue';
import { ImageValue } from './ImageValue';

export type DynamicFormFieldValue =
  | string
  | Dimensions3DValue
  | Dimensions2DValue
  | boolean
  | ImageValue
  | Date;

export interface DynamicFormFieldState {
  value: DynamicFormFieldValue;

  disabled?: boolean;
}
