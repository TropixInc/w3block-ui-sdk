import { DataTypesEnum, TenantInputEntityDto } from '@w3block/sdk-id';
import { AnySchema, object, string } from 'yup';

import useTranslation from '../../../../dist/src/modules/shared/hooks/useTranslation';

export interface ValidationsValues {
  yupKey: string;
  validations: AnySchema<any, any, any>;
}

const validates: Array<ValidationsValues> = [];

export const useGetValidationsTypesForSignup = (
  values: Array<TenantInputEntityDto>
) => {
  const [translate] = useTranslation();
  values.forEach(({ type, id }) => {
    switch (type) {
      case DataTypesEnum.Email:
        validates.push({
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: string()
              .email(
                translate('auth>getValidationsTypesForSignup>insertValidEmail')
              )
              .required(
                translate(
                  'companyAuth>requestPasswordChange>emailFieldPlaceholder'
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
            value: string()
              .required(
                translate('auth>getValidationsTypesForSignup>insertYourCPF')
              )
              .min(
                11,
                translate('auth>getValidationsTypesForSignup>insertValidCPF')
              )
              .max(
                11,
                translate('auth>getValidationsTypesForSignup>insertValidCPF')
              ),
          }),
        });
        break;
      case DataTypesEnum.Phone:
        validates.push({
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: string()
              .required(
                translate('auth>getValidationsTypesForSignup>insertYourPhone')
              )
              .min(
                10,
                translate('auth>getValidationsTypesForSignup>insertValidPhone')
              ),
          }),
        });
        break;
      case DataTypesEnum.Url:
        validates.push({
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: string().required(
              translate('auth>getValidationsTypesForSignup>insertUrl')
            ),
          }),
        });
        break;
      case DataTypesEnum.Text:
        validates.push({
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: string().required(
              translate('auth>getValidationsTypesForSignup>insertText')
            ),
          }),
        });
        break;
    }
  });

  return validates;
};
