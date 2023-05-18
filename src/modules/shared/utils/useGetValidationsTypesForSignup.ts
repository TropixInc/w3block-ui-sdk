import { useCallback, useEffect } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { DataTypesEnum, TenantInputEntityDto } from '@w3block/sdk-id';
import { cpf } from 'cpf-cnpj-validator';
import isURL from 'validator/lib/isURL';
import { AnySchema, object, string } from 'yup';
import * as yup from 'yup';

import useTranslation from '../hooks/useTranslation';

export interface ValidationsValues {
  yupKey: string;
  contextId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validations: AnySchema<any, any, any>;
}

const validates: Array<ValidationsValues> = [];

const validateBirthdate = (date: string | undefined): boolean => {
  const today = new Date();
  if (date) {
    const birthdate = new Date(date);
    let age = today.getFullYear() - birthdate.getFullYear();
    const month = today.getMonth() - birthdate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    return age >= 18;
  } else return false;
};

export const useGetValidationsTypesForSignup = (
  values: Array<TenantInputEntityDto>,
  valueContextId?: string
) => {
  const [translate] = useTranslation();

  const getValidations = useCallback(() => {
    const arrayValid: Array<ValidationsValues> = [];
    values.forEach(({ id, contextId, type, mandatory }) => {
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
                      translate(
                        'auth>getValidationsTypesForSignup>insertYourCPF'
                      )
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
                    translate(
                      'auth>getValidationsTypesForSignup>insertValidCPF'
                    ),
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
              value: mandatory
                ? yup
                    .string()
                    .test(
                      'phone',
                      translate(
                        'auth>getValidationsTypesForSignup>insertValidPhone'
                      ),
                      (value) => {
                        return value ? isValidPhoneNumber(value) : true;
                      }
                    )
                    .required(
                      translate(
                        'auth>getValidationsTypesForSignup>insertYourPhone'
                      )
                    )
                : yup
                    .string()
                    .test(
                      'phone',
                      translate(
                        'auth>getValidationsTypesForSignup>insertValidPhone'
                      ),
                      (value) => {
                        return value ? isValidPhoneNumber(value) : true;
                      }
                    ),
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
                        return value ? isURL(value) : true;
                      }
                    )
                    .required(
                      translate('auth>getValidationsTypesForSignup>insertUrl')
                    )
                : string().test(
                    'url',
                    translate('auth>getValidationsTypesForSignup>insertUrl'),
                    (value) => {
                      return value ? isURL(value) : true;
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
                      'Você precisa ter 18 anos ou mais.',
                      (value) => validateBirthdate(value)
                    )
                : string().test(
                    'birthdate',
                    'Você precisa ter 18 anos ou mais.',
                    (value) => validateBirthdate(value)
                  ),
            }),
          });
          break;
      }
    });

    validates.push(...arrayValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (values) {
      getValidations();
    }
  }, [getValidations, values]);

  return validates.filter(({ contextId }) => contextId === valueContextId);
};
