import { DataTypesEnum, TenantInputEntityDto } from '@w3block/sdk-id';
import { AnySchema, object, string } from 'yup';

//import * from 'yup';

export interface ValidationsValues {
  yupKey: string;
  validations: AnySchema<any, any, any>;
}

const validates: Array<ValidationsValues> = [];

export const getValidationsTypesForSignup = (
  values: Array<TenantInputEntityDto>
) => {
  values.forEach(({ type, id }) => {
    switch (type) {
      case DataTypesEnum.Email:
        validates.push({
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: string()
              .email('insira um email valido')
              .required('insira um email valido'),
          }),
        });
        break;
      case DataTypesEnum.Cpf:
        validates.push({
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: string()
              .required('insira um CPF valido')
              .min(11, 'insira um CPF valido'),
          }),
        });
        break;
      case DataTypesEnum.Phone:
        validates.push({
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: string()
              .required('insira um telefone valido')
              .min(9, 'insira um telefone valido'),
          }),
        });
        break;
      case DataTypesEnum.Url:
        validates.push({
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: string()
              .matches(
                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                'Insira uma URL valida!'
              )
              .required('Insira uma URL'),
          }),
        });
        break;
      case DataTypesEnum.Text:
        validates.push({
          yupKey: id,
          validations: object().shape({
            inputId: string(),
            value: string().required('insira um texto'),
          }),
        });
        break;
    }
  });

  return validates;
};
