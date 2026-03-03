import { useMemo } from 'react';

import { string } from 'yup';
import useTranslation from '../../shared/hooks/useTranslation';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '../utils/passwordConstants';

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
        .min(PASSWORD_MIN_LENGTH, 'Minimo 8 caracteres')
        .matches(
          PASSWORD_REGEX,
          messageConfig?.pattern ??
            translate('auth>passwordErrorFeedback>genericInvalidMessage')
        );
  }, [translate, messageConfig, isPasswordless]);
};
