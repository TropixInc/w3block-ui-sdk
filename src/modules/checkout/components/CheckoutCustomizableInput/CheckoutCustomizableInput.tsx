import InputMask from 'react-input-mask';

import { INPUTS_POSSIBLE } from '../CheckoutPaymentComponent/CheckoutPaymentComponent';
interface CheckoutCustomizableInputProps {
  type: INPUTS_POSSIBLE;
  value: string;
  onChange: (value: string) => void;
  errors?: string;
  readonly?: boolean;
}

export const CheckoutCustomizableInput = ({
  type,
  value,
  onChange,
  errors,
  readonly = false,
}: CheckoutCustomizableInputProps) => {
  return (
    <div className="pw-w-full">
      {type === INPUTS_POSSIBLE.credit_card_holder_name ? (
        <input
          readOnly={readonly}
          placeholder={getPlaceholder(type)}
          className="pw-full pw-border pw-border-slate-300 pw-rounded-lg pw-p-3 pw-text-sm pw-text-slate-700 pw-w-full"
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          type="text"
        />
      ) : (
        <InputMask
          readOnly={readonly}
          maskChar={''}
          mask={
            type == INPUTS_POSSIBLE.cpf_cnpj ||
            type == INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj
              ? value.length < 15
                ? '999.999.999-999'
                : '99.999.999/9999-99'
              : getMask(type)
          }
          placeholder={getPlaceholder(type)}
          className="pw-full pw-border pw-border-slate-300 pw-rounded-lg pw-p-3 pw-text-sm pw-text-slate-700 pw-w-full"
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          type="text"
        />
      )}

      <p className="pw-text-red-500 pw-text-xs pw-h-[14px]">{errors}</p>
    </div>
  );
};

const getPlaceholder = (type: INPUTS_POSSIBLE) => {
  switch (type) {
    case INPUTS_POSSIBLE.credit_card_number:
      return 'Número do cartão';
    case INPUTS_POSSIBLE.credit_card_expiry:
      return 'MM/YY';
    case INPUTS_POSSIBLE.credit_card_ccv:
      return 'CCV';
    case INPUTS_POSSIBLE.credit_card_holder_name:
      return 'Nome do titular do cartão';
    case INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj:
      return 'CPF/CNPJ do titular do cartão';
    case INPUTS_POSSIBLE.credit_card_holder_phone:
      return 'Telefone do titular do cartão';
    case INPUTS_POSSIBLE.credit_card_holder_postal_code:
      return 'CEP do titular do cartão';
    case INPUTS_POSSIBLE.cpf_cnpj:
      return 'CPF/CNPJ do usuário';
    default:
      return '';
  }
};

const getMask = (type: INPUTS_POSSIBLE) => {
  switch (type) {
    case INPUTS_POSSIBLE.credit_card_number:
      return '9999 9999 9999 9999';
    case INPUTS_POSSIBLE.credit_card_expiry:
      return '99/99';
    case INPUTS_POSSIBLE.credit_card_ccv:
      return '9999';
    case INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj:
      return '999.999.999-99';
    case INPUTS_POSSIBLE.credit_card_holder_phone:
      return '(99) 99999-9999';
    case INPUTS_POSSIBLE.credit_card_holder_postal_code:
      return '99999-999';
    case INPUTS_POSSIBLE.cpf_cnpj:
      return '999.999.999-99';
    default:
      return '***************************************************';
  }
};
