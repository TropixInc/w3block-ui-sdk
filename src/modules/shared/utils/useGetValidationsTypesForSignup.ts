import { isValidPhoneNumber } from 'react-phone-number-input';

import { DataTypesEnum, TenantInputEntityDto } from '@w3block/sdk-id';
import { cpf } from 'cpf-cnpj-validator';
import isURL from 'validator/lib/isURL';
import { AnySchema, object, string } from 'yup';
import * as yup from 'yup';

import useTranslation from '../hooks/useTranslation';

export interface ValidationsValues {
  yupKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validations: AnySchema<any, any, any>;
}

const validates: Array<ValidationsValues> = [];

const validDate = (value: string) => {
  console.log(new Date(value));
  return true;
};

export const useGetValidationsTypesForSignup = (
  values: Array<TenantInputEntityDto>
) => {
  const [translate] = useTranslation();
  values.forEach(({ type, id, mandatory }) => {
    switch (type) {
      case DataTypesEnum.File || DataTypesEnum.MultifaceSelfie:
        validates.push({
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
        validates.push({
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
        validates.push({
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
        validates.push({
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
        validates.push({
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
        validates.push({
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
      case DataTypesEnum.Birthday:
        validates.push({
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: mandatory
              ? string()
                  .required(
                    translate('auth>getValidationsTypesForSignup>insertText')
                  )
                  .test(
                    'cpf',
                    translate(
                      'auth>getValidationsTypesForSignup>insertValidCPF'
                    ),
                    (value) => {
                      return value ? validDate(value) : true;
                    }
                  )
              : string(),
          }),
        });
        break;
    }
  });

  return validates;
};
