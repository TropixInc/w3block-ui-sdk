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

const CREDIT_CARD_FIELDS = new Set<INPUTS_POSSIBLE>([
  INPUTS_POSSIBLE.credit_card_number,
  INPUTS_POSSIBLE.credit_card_expiry,
  INPUTS_POSSIBLE.credit_card_ccv,
  INPUTS_POSSIBLE.credit_card_holder_name,
]);

const EXCLUDED_FROM_OTHER = new Set<INPUTS_POSSIBLE>([
  ...CREDIT_CARD_FIELDS,
  INPUTS_POSSIBLE.installments,
  INPUTS_POSSIBLE.credit_card_id,
  INPUTS_POSSIBLE.save_credit_card,
  INPUTS_POSSIBLE.save_credit_card_name,
  INPUTS_POSSIBLE.quote_id,
]);

export function getCreditCardInputs(
  inputsObj: Record<string, string>
): Record<string, string> | null {
  if (!(INPUTS_POSSIBLE.credit_card_number in inputsObj)) return null;
  return Object.keys(inputsObj).reduce((acc, input) => {
    if (CREDIT_CARD_FIELDS.has(input as INPUTS_POSSIBLE)) {
      acc[input] = inputsObj[input];
    }
    return acc;
  }, {} as Record<string, string>);
}

export function getOtherInputs(
  inputsObj: Record<string, string>,
  includeTwoCpfs: boolean
): Record<string, string> {
  return Object.keys(inputsObj).reduce((acc, input) => {
    if (EXCLUDED_FROM_OTHER.has(input as INPUTS_POSSIBLE)) return acc;
    if (includeTwoCpfs) {
      if (
        input !== INPUTS_POSSIBLE.cpf_cnpj &&
        input !== INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj
      ) {
        acc[input] = inputsObj[input];
      }
    } else {
      acc[input] = inputsObj[input];
    }
    return acc;
  }, {} as Record<string, string>);
}
