/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMaskInput } from 'react-imask';
import { INPUTS_POSSIBLE } from './CheckoutPaymentComponent';

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
      {type === INPUTS_POSSIBLE.credit_card_holder_name ||
      type === INPUTS_POSSIBLE.save_credit_card_name ? (
        <input
          readOnly={readonly}
          placeholder={getPlaceholder(type)}
          className="pw-full pw-border pw-border-slate-300 pw-rounded-lg pw-p-3 pw-text-sm pw-text-slate-700 pw-w-full"
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          type="text"
        />
      ) : type === INPUTS_POSSIBLE.credit_card_ccv ||
        type === INPUTS_POSSIBLE.credit_card_number ? (
        <IMaskInput
          inputMode="numeric"
          data-private
          readOnly={readonly}
          radix="."
          mask={getMask(type)}
          placeholder={getPlaceholder(type)}
          className="pw-full pw-border pw-border-slate-300 pw-rounded-lg pw-p-3 pw-text-sm pw-text-slate-700 pw-w-full"
          value={value}
          onAccept={(e: any) => onChange(e)}
          type="text"
        />
      ) : (
        <IMaskInput
          inputMode={type === INPUTS_POSSIBLE.cpf_cnpj ? 'numeric' : 'text'}
          readOnly={readonly}
          radix="."
          mask={getMask(type)}
          placeholder={getPlaceholder(type)}
          className="pw-full pw-border pw-border-slate-300 pw-rounded-lg pw-p-3 pw-text-sm pw-text-slate-700 pw-w-full"
          value={value}
          onAccept={(e: any) => onChange(e)}
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
    case INPUTS_POSSIBLE.phone:
      return 'Telefone';
    case INPUTS_POSSIBLE.postal_code:
      return 'CEP';
    case INPUTS_POSSIBLE.save_credit_card_name:
      return 'Como gostaria de chamar este cartão?';
    default:
      return '';
  }
};

const getMask = (type: INPUTS_POSSIBLE) => {
  switch (type) {
    case INPUTS_POSSIBLE.credit_card_number:
      return '0000 0000 0000 0000';
    case INPUTS_POSSIBLE.credit_card_expiry:
      return '00/00';
    case INPUTS_POSSIBLE.credit_card_ccv:
      return '0000';
    case INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj:
      return '000.000.000-00';
    case INPUTS_POSSIBLE.credit_card_holder_phone:
      return '(00) 00000-0000';
    case INPUTS_POSSIBLE.credit_card_holder_postal_code:
      return '00000-000';
    case INPUTS_POSSIBLE.phone:
      return '(00) 00000-0000';
    case INPUTS_POSSIBLE.postal_code:
      return '00000-000';
    case INPUTS_POSSIBLE.cpf_cnpj:
      return '000.000.000-00';
    default:
      return '***************************************************';
  }
};
