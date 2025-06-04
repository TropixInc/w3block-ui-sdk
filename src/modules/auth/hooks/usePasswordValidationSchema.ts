import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { string } from 'yup';



const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

interface ErrorMessages {
  required?: string;
  pattern?: string;
}

interface Params {
  messageConfig?: ErrorMessages;
  isPasswordless?: boolean;
}

export const usePasswordValidationSchema = ({
  messageConfig,
  isPasswordless = false,
}: Params) => {
  const [translate] = useTranslation();
  return useMemo(() => {
    if (isPasswordless) return string();
    else
      return string()
        .required(
          messageConfig?.required ??
            translate('components>form>requiredFieldValidation')
        )
        .min(8, 'Minimo 8 caracteres')
        .matches(
          passwordRegex,
          messageConfig?.pattern ??
            translate('auth>passwordErrorFeedback>genericInvalidMessage')
        );
  }, [translate, messageConfig, isPasswordless]);
};
