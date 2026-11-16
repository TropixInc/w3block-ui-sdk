/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';

import { BaseButton } from '../../../shared/components/Buttons';
import { Spinner } from '../../../shared/components/Spinner';
import useTranslation from '../../../shared/hooks/useTranslation';
import {
  AvailableInstallmentInfo,
  AvailableCreditCards,
} from '../../interface/interface';
import { CardsSelector } from '../CardsSelector';
import { CheckoutCustomizableInput } from '../CheckoutCustomizableInput';
import { CheckoutInstalments } from '../CheckoutInstalments';
import { ErrorMessage } from '../ErrorMessage';
import { CreditCardForm } from './CreditCardForm';
import { SimilarOrderModal } from './SimilarOrderModal';
import {
  INPUTS_POSSIBLE,
  getCreditCardInputs,
  getOtherInputs,
} from './inputTypes';
import { validateInputs } from './validators';

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
  const [similarPayment, setSimilarPayment] = useState(false);
  const [translate] = useTranslation();

  const inputsObj = useMemo(
    () =>
      inputs.reduce((acc, input) => {
        acc[input] = '';
        return acc;
      }, {} as any),
    [inputs]
  );

  const includeTwoCpfs = useMemo(
    () =>
      inputs.includes(INPUTS_POSSIBLE.cpf_cnpj) &&
      inputs.includes(INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj),
    [inputs]
  );

  const saveAvailable = useMemo(
    () =>
      inputs.includes(INPUTS_POSSIBLE.save_credit_card) &&
      inputs.includes(INPUTS_POSSIBLE.save_credit_card_name),
    [inputs]
  );

  const creditCardInputs = useMemo(
    () => getCreditCardInputs(inputsObj),
    [inputsObj]
  );

  const otherInputs = useMemo(
    () => getOtherInputs(inputsObj, includeTwoCpfs),
    [inputsObj, includeTwoCpfs]
  );

  const showNewCardForm =
    newCard || !userCreditCards || userCreditCards?.length === 0;

  const handleInputChange = (inputType: INPUTS_POSSIBLE, val: string) => {
    setErrors((prev: any) => ({ ...prev, [inputType]: '' }));
    setValue((prev: any) => ({ ...prev, [inputType]: val }));
  };

  const handleInstallmentChange = (install: AvailableInstallmentInfo) => {
    setValue((prev: any) => ({
      ...prev,
      [INPUTS_POSSIBLE.installments]: install?.amount ?? 1,
    }));
    setInstallment?.(install);
  };

  const handleValidateAndSubmit = () => {
    const validatedErrors = validateInputs(inputsObj, value, sameCpf);

    if (Object.keys(validatedErrors).length && !useSavedCard) {
      setErrors(validatedErrors);
      return;
    }

    setErrors({});

    if (includeTwoCpfs && sameCpf) {
      const merged = {
        ...value,
        [INPUTS_POSSIBLE.cpf_cnpj]:
          value[INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj],
      };
      setValue(merged);
      onChange?.(merged);
      onConcluded?.(merged);
    } else {
      onConcluded?.(value);
    }
  };

  useEffect(() => {
    onChange?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (userCreditCards && userCreditCards.length > 0 && !newCard) {
      setUseSavedCard(true);
      setValue({ [INPUTS_POSSIBLE.credit_card_id]: userCreditCards[0]?.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCreditCards?.[0]?.id]);

  useEffect(() => {
    if (saveAvailable && !useSavedCard && !userCreditCards?.length) {
      setValue((prev: any) => ({
        ...prev,
        [INPUTS_POSSIBLE.save_credit_card]: saveCard,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveCard, saveAvailable]);

  useEffect(() => {
    if (quoteId) {
      setValue((prev: any) => ({
        ...prev,
        [INPUTS_POSSIBLE.quote_id]: quoteId,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId]);

  useEffect(() => {
    if (errorCode === 'similar-order-not-accepted') setSimilarPayment(true);
  }, [errorCode]);

  const installmentsSection =
    installments && installments.length > 1 ? (
      <CheckoutInstalments
        installments={installments}
        value={instalment}
        currency={currency}
        setInstallment={handleInstallmentChange}
      />
    ) : null;

  const errorSection =
    error && error !== '' ? (
      <ErrorMessage className="pw-mt-4" title={error} />
    ) : null;

  return (
    <div className="pw-p-4 sm:pw-p-6 pw-bg-white pw-rounded-lg pw-shadow-lg">
      <p className="pw-text-lg pw-text-slate-800 pw-font-[600] pw-mb-6">
        {title}
      </p>

      {userCreditCards && userCreditCards.length > 0 && (
        <CardsSelector
          onChange={(e) => {
            if (e === 'newCard') {
              setUseSavedCard(false);
              setValue({ [INPUTS_POSSIBLE.save_credit_card]: saveCard });
              setNewCard(true);
            } else {
              setUseSavedCard(true);
              setNewCard(false);
              setValue({ [INPUTS_POSSIBLE.credit_card_id]: e });
            }
          }}
          data={userCreditCards}
        />
      )}

      {showNewCardForm ? (
        <>
          {creditCardInputs && (
            <CreditCardForm
              value={value}
              errors={errors}
              loading={loading}
              onInputChange={handleInputChange}
            />
          )}

          <div className="pw-flex pw-flex-col pw-gap-3 pw-mt-4">
            {installmentsSection}

            {Object.keys(otherInputs).map((input) =>
              input !== INPUTS_POSSIBLE.transparent_checkout ? (
                <CheckoutCustomizableInput
                  readonly={loading}
                  errors={errors[input]}
                  key={input}
                  onChange={(val) =>
                    handleInputChange(input as INPUTS_POSSIBLE, val)
                  }
                  value={value[input] ?? ''}
                  type={input as INPUTS_POSSIBLE}
                />
              ) : null
            )}
          </div>

          {includeTwoCpfs && (
            <div className="pw-flex pw-flex-col pw-gap-4 pw-mt-4">
              <CheckoutCustomizableInput
                readonly={loading}
                errors={errors[INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj]}
                key={INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj}
                onChange={(val) =>
                  handleInputChange(
                    INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj,
                    val
                  )
                }
                value={
                  value[INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj] ?? ''
                }
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
                  {translate(
                    'checkout>checkoutPaymentComponent>difenceInCPF'
                  )}
                </p>
              </div>
              {!sameCpf && (
                <CheckoutCustomizableInput
                  readonly={loading}
                  errors={errors[INPUTS_POSSIBLE.cpf_cnpj]}
                  key={INPUTS_POSSIBLE.cpf_cnpj}
                  onChange={(val) =>
                    handleInputChange(INPUTS_POSSIBLE.cpf_cnpj, val)
                  }
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
                  onClick={() => setSaveCard(!saveCard)}
                  className="pw-flex pw-w-[15px] pw-h-[15px] pw-rounded-sm pw-border-slate-400 pw-border pw-justify-center pw-items-center"
                >
                  {saveCard && (
                    <div className="pw-w-[10px] pw-h-[10px] pw-bg-blue-600 pw-rounded-sm"></div>
                  )}
                </div>
                <p className="pw-text-sm pw-text-slate-600">
                  {translate(
                    'checkout>checkoutPaymentComponent>registerCard'
                  )}
                </p>
              </div>
              {saveCard && (
                <CheckoutCustomizableInput
                  readonly={loading}
                  errors={errors[INPUTS_POSSIBLE.save_credit_card_name]}
                  key={INPUTS_POSSIBLE.save_credit_card_name}
                  onChange={(val) =>
                    handleInputChange(
                      INPUTS_POSSIBLE.save_credit_card_name,
                      val
                    )
                  }
                  value={
                    value[INPUTS_POSSIBLE.save_credit_card_name] ?? ''
                  }
                  type={INPUTS_POSSIBLE.save_credit_card_name}
                />
              )}
            </>
          )}

          {errorSection}
        </>
      ) : (
        <>
          <div className="pw-flex pw-flex-col pw-gap-3 pw-mt-4">
            {installmentsSection}
          </div>
          {errorSection}
        </>
      )}

      <div className="pw-flex pw-justify-end pw-mt-6">
        <BaseButton
          disabled={loading}
          onClick={() => handleValidateAndSubmit()}
        >
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

      <SimilarOrderModal
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
