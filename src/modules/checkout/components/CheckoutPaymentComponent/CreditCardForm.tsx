import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

import { CheckoutCustomizableInput } from '../CheckoutCustomizableInput';
import { INPUTS_POSSIBLE } from './inputTypes';

interface CreditCardFormProps {
  value: Record<string, string>;
  errors: Record<string, string>;
  loading: boolean;
  onInputChange: (inputType: INPUTS_POSSIBLE, val: string) => void;
}

export const CreditCardForm = ({
  value,
  errors,
  loading,
  onInputChange,
}: CreditCardFormProps) => {
  return (
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
          onChange={(val) =>
            onInputChange(INPUTS_POSSIBLE.credit_card_number, val)
          }
        />
        <CheckoutCustomizableInput
          readonly={loading}
          errors={errors[INPUTS_POSSIBLE.credit_card_holder_name]}
          type={INPUTS_POSSIBLE.credit_card_holder_name}
          value={value[INPUTS_POSSIBLE.credit_card_holder_name] ?? ''}
          onChange={(val) =>
            onInputChange(INPUTS_POSSIBLE.credit_card_holder_name, val)
          }
        />
        <div className="pw-flex pw-gap-3">
          <CheckoutCustomizableInput
            readonly={loading}
            errors={errors[INPUTS_POSSIBLE.credit_card_expiry]}
            type={INPUTS_POSSIBLE.credit_card_expiry}
            value={value[INPUTS_POSSIBLE.credit_card_expiry] ?? ''}
            onChange={(val) =>
              onInputChange(INPUTS_POSSIBLE.credit_card_expiry, val)
            }
          />
          <CheckoutCustomizableInput
            readonly={loading}
            errors={errors[INPUTS_POSSIBLE.credit_card_ccv]}
            type={INPUTS_POSSIBLE.credit_card_ccv}
            value={value[INPUTS_POSSIBLE.credit_card_ccv] ?? ''}
            onChange={(val) =>
              onInputChange(INPUTS_POSSIBLE.credit_card_ccv, val)
            }
          />
        </div>
      </div>
    </div>
  );
};
