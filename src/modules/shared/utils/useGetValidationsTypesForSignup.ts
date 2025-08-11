/* eslint-disable @typescript-eslint/no-explicit-any */
import { isValidPhoneNumber } from 'react-phone-number-input';

import { DataTypesEnum, TenantInputEntityDto } from '@w3block/sdk-id';
import { cpf } from 'cpf-cnpj-validator';
import { AnySchema, object, string } from 'yup';
import * as yup from 'yup';


import { isValidUrl } from './validators';
import useTranslation from '../hooks/useTranslation';


export interface ValidationsValues {
  yupKey: string;
  contextId: string;
  validations: AnySchema<any, any, any>;
}

const validateBirthdate = (
  date: string | undefined,
  minimumAge?: number
): boolean => {
  const today = new Date();
  if (date) {
    const birthdate = new Date(date);
    let age = today.getFullYear() - birthdate.getFullYear();
    const month = today.getMonth() - birthdate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    if (minimumAge) return age >= minimumAge;
    else return age >= 18;
  } else return false;
};

export const useGetValidationsTypesForSignup = (
  values: Array<TenantInputEntityDto>,
  valueContextId?: string,
  keyPage?: boolean
) => {
  const [translate] = useTranslation();
  const birthdateText = (age?: number) => {
    if (age && age === 1) return `Você precisa ter ${age} ano ou mais`;
    else if (age && age > 1) return `Você precisa ter ${age} anos ou mais`;
    else return 'Você precisa ter 18 anos ou mais';
  };

  const arrayValid: Array<ValidationsValues> = [];
  values.forEach(({ id, contextId, type, mandatory, data }) => {
    const phoneValidations = () => {
      if (keyPage) {
        if (mandatory) {
          return yup.array().of(
            yup
              .string()
              .test(
                'phone',
                translate('auth>getValidationsTypesForSignup>insertValidPhone'),
                (value) => {
                  return value ? isValidPhoneNumber(value) : true;
                }
              )
              .required(
                translate('auth>getValidationsTypesForSignup>insertYourPhone')
              )
          );
        } else {
          return yup.array().of(
            yup
              .string()
              .test(
                'phone',
                translate('auth>getValidationsTypesForSignup>insertValidPhone'),
                (value) => {
                  return value ? isValidPhoneNumber(value) : true;
                }
              )
          );
        }
      } else {
        if (mandatory) {
          return yup
            .string()
            .test(
              'phone',
              translate('auth>getValidationsTypesForSignup>insertValidPhone'),
              (value) => {
                return value ? isValidPhoneNumber(value) : true;
              }
            )
            .required(
              translate('auth>getValidationsTypesForSignup>insertYourPhone')
            );
        } else {
          return yup
            .string()
            .test(
              'phone',
              translate('auth>getValidationsTypesForSignup>insertValidPhone'),
              (value) => {
                return value ? isValidPhoneNumber(value) : true;
              }
            );
        }
      }
    };
    switch (type) {
      case DataTypesEnum.File || DataTypesEnum.MultifaceSelfie:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            assetId: mandatory
              ? string().required(
                  translate('auth>getValidationsTypesForSignup>insertFile')
                )
              : string(),
          }),
        });
        break;
      case DataTypesEnum.Email:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: mandatory
              ? string()
                  .email(
                    translate(
                      'auth>getValidationsTypesForSignup>insertValidEmail'
                    )
                  )
                  .required(
                    translate(
                      'companyAuth>requestPasswordChange>emailFieldPlaceholder'
                    )
                  )
              : string().email(
                  translate(
                    'auth>getValidationsTypesForSignup>insertValidEmail'
                  )
                ),
          }),
        });
        break;
      case DataTypesEnum.Cpf:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: mandatory
              ? string()
                  .required(
                    translate('auth>getValidationsTypesForSignup>insertYourCPF')
                  )
                  .test(
                    'cpf',
                    translate(
                      'auth>getValidationsTypesForSignup>insertValidCPF'
                    ),
                    (value) => {
                      return value ? cpf.isValid(value) : true;
                    }
                  )
              : string().test(
                  'cpf',
                  translate('auth>getValidationsTypesForSignup>insertValidCPF'),
                  (value) => {
                    return value ? cpf.isValid(value) : true;
                  }
                ),
          }),
        });
        break;
      case DataTypesEnum.Phone:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: phoneValidations(),
          }),
        });
        break;
      case DataTypesEnum.Url:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: mandatory
              ? string()
                  .test(
                    'url',
                    translate('auth>getValidationsTypesForSignup>insertUrl'),
                    (value) => {
                      return value ? isValidUrl(value) : true;
                    }
                  )
                  .required(
                    translate('auth>getValidationsTypesForSignup>insertUrl')
                  )
              : string().test(
                  'url',
                  translate('auth>getValidationsTypesForSignup>insertUrl'),
                  (value) => {
                    return value ? isValidUrl(value) : true;
                  }
                ),
          }),
        });
        break;
      case DataTypesEnum.Text:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: mandatory
              ? string().required(
                  translate('auth>getValidationsTypesForSignup>insertText')
                )
              : string(),
          }),
        });
        break;
      case DataTypesEnum.Birthdate:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: mandatory
              ? string()
                  .required(
                    translate('auth>getValidationsTypesForSignup>insertText')
                  )
                  .test(
                    'birthdate',
                    birthdateText((data as any)?.minimumAge),
                    (value) =>
                      validateBirthdate(value, (data as any)?.minimumAge)
                  )
              : string().test(
                  'birthdate',
                  birthdateText((data as any)?.minimumAge),
                  (value) => validateBirthdate(value, (data as any)?.minimumAge)
                ),
          }),
        });
        break;
      case DataTypesEnum.SimpleLocation:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: mandatory
              ? object().shape({
                  city: string().required(
                    translate('auth>getValidationsTypesForSignup>insertText')
                  ),
                  country: string().required(
                    translate('auth>getValidationsTypesForSignup>insertText')
                  ),
                  home: string(),
                  placeId: string(),
                  postal_code: string(),
                  region: string().required(
                    translate('auth>getValidationsTypesForSignup>insertText')
                  ),
                  street: string(),
                })
              : object().shape({
                  city: string(),
                  country: string(),
                  home: string(),
                  placeId: string(),
                  postal_code: string(),
                  region: string(),
                  street: string(),
                }),
          }),
        });
        break;
      case DataTypesEnum.IdentificationDocument:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: mandatory
              ? object().shape({
                  docType: string().required(
                    translate('auth>getValidationsTypesForSignup>insertText')
                  ),
                  document: string().required(
                    translate('auth>getValidationsTypesForSignup>insertText')
                  ),
                })
              : object().shape({
                  docType: string(),
                  document: string(),
                }),
          }),
        });
        break;
      case DataTypesEnum.Checkbox:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: mandatory
              ? yup
                  .boolean()
                  .required(
                    translate('auth>getValidationsTypesForSignup>insertText')
                  )
              : yup.boolean(),
          }),
        });
        break;
      case DataTypesEnum.SimpleSelect:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: mandatory
              ? string().required(
                  translate('auth>getValidationsTypesForSignup>insertText')
                )
              : string(),
          }),
        });
        break;
      case DataTypesEnum.UserName:
        arrayValid.push({
          contextId: contextId,
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: mandatory
              ? string().required(
                  translate('auth>getValidationsTypesForSignup>insertText')
                )
              : string(),
          }),
        });
        break;
    }
  });
  return arrayValid;
};
