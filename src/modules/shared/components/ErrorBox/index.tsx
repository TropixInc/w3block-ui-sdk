/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import { FieldErrors } from 'react-hook-form';

import { Alert } from '../Alert';

interface Props {
  formErrors?: FieldErrors;
  submitCount?: number;
  customError?: { message: string; type: string };
  generalFieldMessage?: string;
  generalServerMessage?: string;
}
function processFieldError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entry: any,
  generalFieldMessage: string,
  generalServerMessage: string,
  errors: string[]
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { root, message, ref, type, ...fieldErrors } = entry;

  if (root?.serverError?.type === 'unkown')
    errors.push(generalServerMessage || defaultServerMessage);
  else if (root?.serverError)
    errors.push(
      root?.serverError?.message || generalServerMessage || defaultServerMessage
    );
  if (message) {
    if (type === 'unkown')
      errors.push(generalServerMessage || defaultServerMessage);
    else errors.push(message);
  }

  const fields = Object.entries(fieldErrors);
  if (fields.length) {
    if (generalFieldMessage) {
      if (fields.length) errors.push(generalFieldMessage);
    } else {
      fields.forEach(([_name, val]) => {
        processFieldError(
          val,
          generalFieldMessage,
          generalServerMessage,
          errors
        );
      });
    }
  }
}

const defaultServerMessage =
  'Erro ao processar solicitação. Por favor, tente novamente mais tarde';
export function ErrorBox({
  formErrors,
  submitCount = 1,
  customError,
  generalServerMessage = '',
  generalFieldMessage = '',
}: Props) {
  const errorMessages = useMemo(() => {
    const errors: string[] = [];
    console.log('*** error changed', formErrors, customError, submitCount);
    submitCount;
    if (formErrors) {
      processFieldError(
        formErrors,
        generalFieldMessage,
        generalServerMessage,
        errors
      );
    }
    if (customError)
      errors.push(
        customError.message || generalServerMessage || defaultServerMessage
      );
    return errors;
  }, [
    customError,
    Object.keys(formErrors ?? {}),
    generalFieldMessage,
    generalServerMessage,
    submitCount,
  ]);

  console.log(errorMessages, 'errorMessages');

  return errorMessages.length ? (
    <div>
      {errorMessages.map((e, i) => (
        <Alert className="mb-2" variant="error" key={i}>
          <Alert.Icon className="mr-3" />
          {e}
        </Alert>
      ))}
    </div>
  ) : (
    <></>
  );
}
