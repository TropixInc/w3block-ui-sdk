/* eslint-disable no-useless-escape */
import { useEffect, useMemo, useState } from 'react';
import Cards from 'react-credit-cards-2';

import { cpf, cnpj } from 'cpf-cnpj-validator';

import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { Spinner } from '../../../shared/components/Spinner';
import { WeblockButton } from '../../../shared/components/WeblockButton/WeblockButton';
import { AvailableInstallmentInfo } from '../../interface/interface';
import { CheckoutCustomizableInput } from '../CheckoutCustomizableInput/CheckoutCustomizableInput';
import { CheckoutInstalments } from '../CheckoutInstallments/CheckoutInstalments';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

import cardValidator from 'card-validator';
interface CheckoutPaymentComponentProps {
  inputs: INPUTS_POSSIBLE[];
  installments?: AvailableInstallmentInfo[];
  setInstallment?: (installments: AvailableInstallmentInfo) => void;
  instalment?: AvailableInstallmentInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void;
  title?: string;
  onConcluded?: (val: any) => void;
  buttonText?: string;
  loading?: boolean;
  error?: string;
  currency?: string;
  buttonLoadingText?: string;
}

export enum INPUTS_POSSIBLE {
  cpf_cnpj = 'cpf_cnpj',
  transparent_checkout = 'transparent_checkout',
  credit_card_number = 'credit_card_number',
  credit_card_expiry = 'credit_card_expiry',
  credit_card_ccv = 'credit_card_ccv',
  credit_card_holder_name = 'credit_card_holder_name',
  credit_card_holder_cpf_cnpj = 'credit_card_holder_cpf_cnpj',
  credit_card_holder_postal_code = 'credit_card_holder_postal_code',
  credit_card_holder_phone = 'credit_card_holder_phone',
  installments = 'installments',
}

export const CheckoutPaymentComponent = ({
  inputs,
  onChange,
  onConcluded,
  currency,
  title,
  error,
  buttonText = 'Finalizar compra',
  loading = false,
  setInstallment,
  installments,
  instalment,
  buttonLoadingText,
}: CheckoutPaymentComponentProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [value, setValue] = useState<any>({});
  const [sameCpf, setSameCpf] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>({});
  const inputsObj = useMemo(
    () =>
      inputs.reduce((acc, input) => {
        acc[input] = '';
        return acc;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as any),
    [inputs]
  );

  const includeTwoCpfs = useMemo(() => {
    return (
      inputs.includes(INPUTS_POSSIBLE.cpf_cnpj) &&
      inputs.includes(INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj)
    );
  }, [inputs]);

  const validateBeforeProcced = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validatedErrors = {} as any;
    Object.keys(inputsObj).map((input) => {
      if (
        input == INPUTS_POSSIBLE.credit_card_number &&
        !isValidCreditCard(
          replaceAllPossibleWrongCharacters(value[input] ?? '')
        )
      ) {
        validatedErrors[input] = 'Número de cartão inválido';
        return false;
      } else if (
        input == INPUTS_POSSIBLE.credit_card_expiry &&
        !isValidExpiryDate(value[input] ?? '')
      ) {
        validatedErrors[input] = 'Data de expiração inválida';
        return false;
      } else if (
        input == INPUTS_POSSIBLE.credit_card_ccv &&
        !isValidCCV(replaceAllPossibleWrongCharacters(value[input] ?? ''))
      ) {
        validatedErrors[input] = 'Código de segurança inválido';
        return false;
      } else if (
        input == INPUTS_POSSIBLE.credit_card_holder_name &&
        (!value[input] || value[input]?.length < 3)
      ) {
        validatedErrors[input] = 'Nome inválido';
        return false;
      } else if (
        input == INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj &&
        !isValidCpfOrCnpj(value[input] ?? '')
      ) {
        validatedErrors[input] = 'Cpf ou CNPJ inválido';
        return false;
      } else if (
        input == INPUTS_POSSIBLE.credit_card_holder_postal_code &&
        !isValidPostalCode(value[input] ?? '')
      ) {
        validatedErrors[input] = 'Código postal inválido';
        return false;
      } else if (
        input == INPUTS_POSSIBLE.credit_card_holder_phone &&
        !isValidPhone(value[input] ?? '')
      ) {
        validatedErrors[input] = 'Telefone inválido';
        return false;
      } else if (
        input == INPUTS_POSSIBLE.cpf_cnpj &&
        !isValidCpfOrCnpj(value[input] ?? '') &&
        !sameCpf
      ) {
        validatedErrors[input] = 'Cpf ou CNPJ inválido';
        return false;
      } else return true;
    });
    if (Object.keys(validatedErrors).length) {
      setErrors(validatedErrors);
    } else {
      setErrors({});
      if (includeTwoCpfs && sameCpf) {
        setValue({
          ...value,
          [INPUTS_POSSIBLE.cpf_cnpj]:
            value[INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj],
        });
        onChange?.({
          ...value,
          [INPUTS_POSSIBLE.cpf_cnpj]:
            value[INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj],
        });
        onConcluded?.({
          ...value,
          [INPUTS_POSSIBLE.cpf_cnpj]:
            value[INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj],
        });
      } else {
        onConcluded?.(value);
      }
    }
  };

  useEffect(() => {
    onChange?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const replaceAllPossibleWrongCharacters = (value: string) => {
    return value
      .replaceAll('.', '')
      .replaceAll('-', '')
      .replaceAll('/', '')
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll(' ', '');
  };

  const creditCardInputs = useMemo(() => {
    if (INPUTS_POSSIBLE.credit_card_number in inputsObj) {
      return Object.keys(inputsObj).reduce((acc, input) => {
        if (
          input == INPUTS_POSSIBLE.credit_card_number ||
          input == INPUTS_POSSIBLE.credit_card_expiry ||
          input == INPUTS_POSSIBLE.credit_card_ccv ||
          input == INPUTS_POSSIBLE.credit_card_holder_name
        ) {
          acc[input] = inputsObj[input];
        }
        return acc;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as any);
    } else return null;
  }, [inputsObj]);

  const otherInputs = useMemo(() => {
    return Object.keys(inputsObj).reduce((acc, input) => {
      if (
        input !== INPUTS_POSSIBLE.credit_card_number &&
        input !== INPUTS_POSSIBLE.credit_card_expiry &&
        input !== INPUTS_POSSIBLE.credit_card_ccv &&
        input !== INPUTS_POSSIBLE.credit_card_holder_name &&
        input !== INPUTS_POSSIBLE.installments
      ) {
        if (
          includeTwoCpfs &&
          input !== INPUTS_POSSIBLE.cpf_cnpj &&
          input !== INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj
        ) {
          acc[input] = inputsObj[input];
        } else if (!includeTwoCpfs) {
          acc[input] = inputsObj[input];
        }
      }
      return acc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputsObj]);

  return (
    <div className="pw-p-4 sm:pw-p-6 pw-bg-white pw-rounded-lg pw-shadow-lg">
      <p className="pw-text-lg pw-text-slate-800 pw-font-[600] pw-mb-6">
        {title}
      </p>
      {creditCardInputs && (
        <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-4">
          <Cards
            cvc={value[INPUTS_POSSIBLE.credit_card_ccv] ?? ''}
            number={value[INPUTS_POSSIBLE.credit_card_number] ?? ''}
            expiry={value[INPUTS_POSSIBLE.credit_card_expiry] ?? ''}
            name={value[INPUTS_POSSIBLE.credit_card_holder_name] ?? ''}
          />
          <div className="pw-flex-col pw-flex pw-gap-3 pw-flex-1">
            <CheckoutCustomizableInput
              readonly={loading}
              errors={errors[INPUTS_POSSIBLE.credit_card_number]}
              type={INPUTS_POSSIBLE.credit_card_number}
              value={value[INPUTS_POSSIBLE.credit_card_number] ?? ''}
              onChange={(val) => {
                setErrors({
                  ...errors,
                  [INPUTS_POSSIBLE.credit_card_number]: '',
                });
                setValue({
                  ...value,
                  [INPUTS_POSSIBLE.credit_card_number]: val,
                });
              }}
            />
            <CheckoutCustomizableInput
              readonly={loading}
              errors={errors[INPUTS_POSSIBLE.credit_card_holder_name]}
              type={INPUTS_POSSIBLE.credit_card_holder_name}
              value={value[INPUTS_POSSIBLE.credit_card_holder_name] ?? ''}
              onChange={(val) => {
                setErrors({
                  ...errors,
                  [INPUTS_POSSIBLE.credit_card_holder_name]: '',
                });
                setValue({
                  ...value,
                  [INPUTS_POSSIBLE.credit_card_holder_name]: val,
                });
              }}
            />
            <div className="pw-flex pw-gap-3">
              <CheckoutCustomizableInput
                readonly={loading}
                errors={errors[INPUTS_POSSIBLE.credit_card_expiry]}
                type={INPUTS_POSSIBLE.credit_card_expiry}
                value={value[INPUTS_POSSIBLE.credit_card_expiry] ?? ''}
                onChange={(val) => {
                  setErrors({
                    ...errors,
                    [INPUTS_POSSIBLE.credit_card_expiry]: '',
                  });
                  setValue({
                    ...value,
                    [INPUTS_POSSIBLE.credit_card_expiry]: val,
                  });
                }}
              />
              <CheckoutCustomizableInput
                readonly={loading}
                errors={errors[INPUTS_POSSIBLE.credit_card_ccv]}
                type={INPUTS_POSSIBLE.credit_card_ccv}
                value={value[INPUTS_POSSIBLE.credit_card_ccv] ?? ''}
                onChange={(val) => {
                  setErrors({
                    ...errors,
                    [INPUTS_POSSIBLE.credit_card_ccv]: '',
                  });
                  setValue({
                    ...value,
                    [INPUTS_POSSIBLE.credit_card_ccv]: val,
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="pw-flex pw-flex-col pw-gap-3 pw-mt-4">
        {installments && installments.length > 0 && (
          <CheckoutInstalments
            installments={installments}
            value={instalment}
            currency={currency}
            setInstallment={(install) => {
              setValue({
                ...value,
                [INPUTS_POSSIBLE.installments]: install?.amount ?? 1,
              });
              setInstallment?.(install);
            }}
          />
        )}

        {Object.keys(otherInputs).map((input) => {
          return input != INPUTS_POSSIBLE.transparent_checkout ? (
            <CheckoutCustomizableInput
              readonly={loading}
              errors={errors[input]}
              key={input}
              onChange={(val) => {
                setErrors({ ...errors, [input]: '' });
                setValue({
                  ...value,
                  [input]: val,
                });
              }}
              value={value[input] ?? ''}
              type={input as INPUTS_POSSIBLE}
            />
          ) : null;
        })}
      </div>
      {includeTwoCpfs && (
        <div className="pw-flex pw-flex-col  pw-gap-4 pw-mt-4">
          <CheckoutCustomizableInput
            readonly={loading}
            errors={errors[INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj]}
            key={INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj}
            onChange={(val) => {
              setErrors({
                ...errors,
                [INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj]: '',
              });
              setValue({
                ...value,
                [INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj]: val,
              });
            }}
            value={value[INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj] ?? ''}
            type={INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj}
          />
          <div className="pw-flex pw-gap-3 pw-items-center">
            <div
              onClick={() => setSameCpf(!sameCpf)}
              className="pw-flex pw-w-[15px] pw-h-[15px] pw-rounded-sm pw-border-slate-400 pw-border pw-justify-center pw-items-center"
            >
              {!sameCpf && (
                <div className="pw-w-[10px] pw-h-[10px] pw-bg-blue-600 pw-rounded-sm"></div>
              )}
            </div>
            <p className="pw-text-sm pw-text-slate-600">
              O CPF do comprador é diferente do titular do cartão
            </p>
          </div>
          {!sameCpf && (
            <CheckoutCustomizableInput
              readonly={loading}
              errors={errors[INPUTS_POSSIBLE.cpf_cnpj]}
              key={INPUTS_POSSIBLE.cpf_cnpj}
              onChange={(val) => {
                setErrors({
                  ...errors,
                  [INPUTS_POSSIBLE.cpf_cnpj]: '',
                });
                setValue({
                  ...value,
                  [INPUTS_POSSIBLE.cpf_cnpj]: val,
                });
              }}
              value={value[INPUTS_POSSIBLE.cpf_cnpj] ?? ''}
              type={INPUTS_POSSIBLE.cpf_cnpj}
            />
          )}
        </div>
      )}
      {error && error != '' ? (
        <ErrorMessage className="pw-mt-4" title={error} />
      ) : null}
      <div className="pw-flex pw-justify-end pw-mt-6">
        <WeblockButton
          disabled={loading}
          onClick={() => validateBeforeProcced()}
          tailwindBgColor=""
          className="!pw-text-white !pw-bg-[#295BA6]"
        >
          {loading ? (
            <div className="pw-flex pw-gap-3 pw-justify-center pw-items-center">
              <Spinner className="pw-h-5 pw-w-5" />
              {buttonLoadingText}
            </div>
          ) : (
            buttonText
          )}
        </WeblockButton>
      </div>
    </div>
  );
};

function isValidCreditCard(number: string): boolean {
  const { isValid } = cardValidator.number(number);
  // const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  // const mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
  // const amexpRegEx = /^(?:3[47][0-9]{13})$/;
  // const discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
  // let isValid = false;

  // if (visaRegEx.test(number)) isValid = true;
  // else if (mastercardRegEx.test(number)) isValid = true;
  // else if (amexpRegEx.test(number)) isValid = true;
  // else if (discovRegEx.test(number)) isValid = true;
  // else isValid = false;

  return isValid;
}

function isValidExpiryDate(date: string): boolean {
  const dateRegEx = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  let isValid = false;
  if (dateRegEx.test(date)) {
    const today = new Date();
    const month = parseInt(date.split('/')[0]);
    const year = parseInt(date.split('/')[1]);

    if (year > parseInt(today.getFullYear().toString().substring(2)))
      isValid = true;
    else if (
      year == parseInt(today.getFullYear().toString().substring(2)) &&
      month > today.getMonth()
    )
      isValid = true;
    else isValid = false;
  }
  return isValid;
}

function isValidCCV(ccv: string): boolean {
  const ccvRegEx = /^[0-9]{3,4}$/;
  return ccvRegEx.test(ccv);
}

function isValidCpfOrCnpj(cpfOrCnpj: string): boolean {
  const cpfRegEx = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
  const cnpjRegEx = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
  const isValidCPF = cpf.isValid(cpfOrCnpj);
  const isValidCNPJ = cnpj.isValid(cpfOrCnpj);
  return (
    (cpfRegEx.test(cpfOrCnpj) && isValidCPF) ||
    (cnpjRegEx.test(cpfOrCnpj) && isValidCNPJ)
  );
}

function isValidPostalCode(postalCode: string): boolean {
  const postalCodeRegEx = /^\d{5}\-\d{3}$/;
  return postalCodeRegEx.test(postalCode);
}
function isValidPhone(phone: string): boolean {
  const phoneRegEx = /^\(\d{2}\)\s\d{4,5}\-\d{4}$/;
  return phoneRegEx.test(phone);
}
