import { ValidationsValues } from './getValidationsTypesForSignup';

export const createSchemaSignupForm = (validates: Array<ValidationsValues>) => {
  const valuesSchema = validates.map(({ validations, yupKey }) => ({
    [yupKey]: validations,
  }));

  return valuesSchema.reduce((acumulador, objeto) => {
    return {
      ...acumulador,
      ...objeto,
    };
  }, {});
};
