/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
import { lazy, useEffect, useMemo, useState } from 'react';
import Cards from 'react-credit-cards-2';

import cardValidator from 'card-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '../../shared/components/Buttons';
import { ModalBase } from '../../shared/components/ModalBase';
import { PixwayButton } from '../../shared/components/PixwayButton';
import { Spinner } from '../../shared/components/Spinner';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { AvailableInstallmentInfo, AvailableCreditCards } from '../interface/interface';
import { CardsSelector } from './CardsSelector';
import { CheckoutCustomizableInput } from './CheckoutCustomizableInput';
import { CheckoutInstalments } from './CheckoutInstalments';
import { ErrorMessage } from './ErrorMessage';


interface CheckoutPaymentComponentProps {
  inputs: INPUTS_POSSIBLE[];
  installments?: AvailableInstallmentInfo[];
  setInstallment?: (installments: AvailableInstallmentInfo) => void;
  instalment?: AvailableInstallmentInfo;
  onChange?: (value: any) => void;
  title?: string;
  onConcluded?: (val: any, allowSimilarPayment?: boolean) => void;
  buttonText?: string;
  loading?: boolean;
  error?: string;
  currency?: string;
  buttonLoadingText?: string;
  userCreditCards?: AvailableCreditCards[];
  errorCode?: string;
  quoteId?: string;
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
  credit_card_id = 'credit_card_id',
  save_credit_card = 'save_credit_card',
  save_credit_card_name = 'save_credit_card_name',
  phone = 'phone',
  postal_code = 'postal_code',
  quote_id = 'quote_id',
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
  userCreditCards,
  errorCode,
  quoteId,
}: CheckoutPaymentComponentProps) => {
  const [value, setValue] = useState<any>({});
  const [sameCpf, setSameCpf] = useState(true);
  const [saveCard, setSaveCard] = useState(true);
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [newCard, setNewCard] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [translate] = useTranslation();
  const inputsObj = useMemo(
    () =>
      inputs.reduce((acc, input) => {
        acc[input] = '';
        return acc;
      }, {} as any),
    [inputs]
  );
  const includeTwoCpfs = useMemo(() => {
    return (
      inputs.includes(INPUTS_POSSIBLE.cpf_cnpj) &&
      inputs.includes(INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj)
    );
  }, [inputs]);

  const saveAvailable = useMemo(() => {
    return (
      inputs.includes(INPUTS_POSSIBLE.save_credit_card) &&
      inputs.includes(INPUTS_POSSIBLE.save_credit_card_name)
    );
  }, [inputs]);

  const validateBeforeProcced = () => {
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
    if (Object.keys(validatedErrors).length && !useSavedCard) {
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
        input !== INPUTS_POSSIBLE.installments &&
        input !== INPUTS_POSSIBLE.credit_card_id &&
        input !== INPUTS_POSSIBLE.save_credit_card &&
        input !== INPUTS_POSSIBLE.save_credit_card_name &&
        input !== INPUTS_POSSIBLE.quote_id
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
    }, {} as any);
  }, [inputsObj]);

  useEffect(() => {
    if (userCreditCards && userCreditCards?.length > 0 && !newCard) {
      setUseSavedCard(true);
      setValue({
        [INPUTS_POSSIBLE.credit_card_id]: userCreditCards?.[0]?.id,
      });
    }
  }, [userCreditCards?.[0]?.id]);

  useEffect(() => {
    if (saveAvailable && !useSavedCard && !userCreditCards?.length) {
      setValue({
        ...value,
        [INPUTS_POSSIBLE.save_credit_card]: saveCard,
      });
    }
  }, [saveCard, saveAvailable]);

  useEffect(() => {
    if (quoteId) {
      setValue({
        ...value,
        [INPUTS_POSSIBLE.quote_id]: quoteId,
      });
    }
  }, [quoteId]);

  const [similarPayment, setSimilarPayment] = useState(false);
  const router = useRouterConnect();
  useEffect(() => {
    if (errorCode === 'similar-order-not-accepted') setSimilarPayment(true);
  }, [errorCode]);

  const DeleteModal = ({
    isOpen,
    onClose,
    onContinue,
  }: {
    isOpen: boolean;
    onClose(): void;
    onContinue(): void;
  }) => {
    const [agree, setAgree] = useState(false);
    return (
      <ModalBase
        isOpen={isOpen}
        onClose={onClose}
        clickAway={false}
        hideCloseButton
        classes={{ classComplement: 'sm:!pw-p-8 !pw-p-4' }}
      >
        <div className="pw-p-8 pw-text-center pw-text-black">
          <p className="sm:pw-text-base pw-text-sm">
            {translate('checkout>checkoutPaymentComponent>verifyPurchase')}
          </p>
          <p className="pw-font-semibold pw-mt-2 sm:pw-text-base pw-text-sm">
            {translate('checkout>checkoutPaymentComponent>continuePurchase')}
          </p>

          <div className="pw-flex pw-flex-col pw-justify-around pw-mt-6">
            <PixwayButton
              onClick={() => router.pushConnect(PixwayAppRoutes.MY_ORDERS)}
              className="pw-mt-4 !pw-py-3 !pw-px-[42px] !pw-bg-white !pw-text-xs !pw-text-black pw-border pw-border-slate-800 !pw-rounded-full hover:pw-bg-slate-500 hover:pw-shadow-xl"
            >
              {translate('checkout>checkoutPaymentComponent>seePurchase')}
            </PixwayButton>
            <PixwayButton
              disabled={!agree}
              onClick={onContinue}
              className="pw-mt-4 !pw-py-3 !pw-px-[42px] !pw-bg-white !pw-text-xs !pw-text-black pw-border pw-border-slate-800 !pw-rounded-full hover:pw-bg-slate-500 disabled:pw-opacity-50 disabled:!pw-bg-white hover:pw-shadow-xl"
            >
              {translate('checkout>checkoutPaymentComponent>confirmPurchase')}
            </PixwayButton>
          </div>
          <div className="pw-flex sm:pw-gap-3 pw-gap-2 pw-items-center pw-justify-center pw-my-5 ">
            <div
              onClick={() => {
                setAgree(!agree);
              }}
              className="pw-flex pw-w-[18px] pw-h-[18px] pw-rounded-sm pw-border-slate-400 pw-border pw-justify-center pw-items-center"
            >
              {agree && (
                <div className="pw-w-[10px] pw-h-[10px] pw-bg-blue-600 pw-rounded-sm"></div>
              )}
            </div>
            <p className="sm:pw-text-base pw-text-xs pw-text-slate-600">
              {translate(
                'checkout>checkoutPaymentComponent>confirmPurchaseSameValue'
              )}
            </p>
          </div>
        </div>
      </ModalBase>
    );
  };

  return (
    <div className="pw-p-4 sm:pw-p-6 pw-bg-white pw-rounded-lg pw-shadow-lg">
      <p className="pw-text-lg pw-text-slate-800 pw-font-[600] pw-mb-6">
        {title}
      </p>
      {userCreditCards && userCreditCards?.length > 0 && (
        <CardsSelector
          onChange={(e) => {
            if (e === 'newCard') {
              setUseSavedCard(false);
              setValue({ [INPUTS_POSSIBLE.save_credit_card]: saveCard });
              setNewCard(true);
            } else {
              setUseSavedCard(true);
              setNewCard(false);
              setValue({
                [INPUTS_POSSIBLE.credit_card_id]: e,
              });
            }
          }}
          data={userCreditCards}
        />
      )}
      {newCard || !userCreditCards || userCreditCards?.length === 0 ? (
        <>
          {creditCardInputs && (
            <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-4 pw-mt-4">
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
            {installments && installments.length > 1 && (
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
                  {translate('checkout>checkoutPaymentComponent>difenceInCPF')}
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
          {saveAvailable && (
            <>
              <div className="pw-flex pw-gap-3 pw-items-center pw-my-3">
                <div
                  onClick={() => {
                    setSaveCard(!saveCard);
                  }}
                  className="pw-flex pw-w-[15px] pw-h-[15px] pw-rounded-sm pw-border-slate-400 pw-border pw-justify-center pw-items-center"
                >
                  {saveCard && (
                    <div className="pw-w-[10px] pw-h-[10px] pw-bg-blue-600 pw-rounded-sm"></div>
                  )}
                </div>
                <p className="pw-text-sm pw-text-slate-600">
                  {translate('checkout>checkoutPaymentComponent>registerCard')}
                </p>
              </div>
              {saveCard && (
                <CheckoutCustomizableInput
                  readonly={loading}
                  errors={errors[INPUTS_POSSIBLE.save_credit_card_name]}
                  key={INPUTS_POSSIBLE.save_credit_card_name}
                  onChange={(val) => {
                    setErrors({
                      ...errors,
                      [INPUTS_POSSIBLE.save_credit_card_name]: '',
                    });
                    setValue({
                      ...value,
                      [INPUTS_POSSIBLE.save_credit_card_name]: val,
                    });
                  }}
                  value={value[INPUTS_POSSIBLE.save_credit_card_name] ?? ''}
                  type={INPUTS_POSSIBLE.save_credit_card_name}
                />
              )}
            </>
          )}
          {error && error != '' ? (
            <ErrorMessage className="pw-mt-4" title={error} />
          ) : null}
        </>
      ) : (
        <>
          <div className="pw-flex pw-flex-col pw-gap-3 pw-mt-4">
            {installments && installments.length > 1 && (
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
          </div>
          {error && error != '' ? (
            <ErrorMessage className="pw-mt-4" title={error} />
          ) : null}
        </>
      )}
      <div className="pw-flex pw-justify-end pw-mt-6">
        <BaseButton disabled={loading} onClick={() => validateBeforeProcced()}>
          {loading ? (
            <div className="pw-flex pw-gap-3 pw-justify-center pw-items-center">
              <Spinner className="pw-h-5 pw-w-5" />
              {buttonLoadingText}
            </div>
          ) : (
            buttonText
          )}
        </BaseButton>
      </div>
      <DeleteModal
        isOpen={similarPayment}
        onClose={() => setSimilarPayment(false)}
        onContinue={() => {
          onConcluded?.(value, true);
          setSimilarPayment(false);
        }}
      />
    </div>
  );
};

function isValidCreditCard(number: string): boolean {
  const { isValid } = cardValidator.number(number);

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
