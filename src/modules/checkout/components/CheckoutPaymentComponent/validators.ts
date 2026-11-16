import cardValidator from 'card-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

import { INPUTS_POSSIBLE } from './inputTypes';

export function stripFormatting(value: string): string {
  return value.replace(/[.\-/()\s]/g, '');
}

export function isValidCreditCard(number: string): boolean {
  return cardValidator.number(number).isValid;
}

export function isValidExpiryDate(date: string): boolean {
  const dateRegEx = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  if (!dateRegEx.test(date)) return false;

  const today = new Date();
  const month = parseInt(date.split('/')[0]);
  const year = parseInt(date.split('/')[1]);
  const currentYear = today.getFullYear() % 100;

  if (year > currentYear) return true;
  if (year === currentYear && month > today.getMonth()) return true;
  return false;
}

export function isValidCCV(ccv: string): boolean {
  return /^[0-9]{3,4}$/.test(ccv);
}

export function isValidCpfOrCnpj(cpfOrCnpj: string): boolean {
  const cpfRegEx = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const cnpjRegEx = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return (
    (cpfRegEx.test(cpfOrCnpj) && cpf.isValid(cpfOrCnpj)) ||
    (cnpjRegEx.test(cpfOrCnpj) && cnpj.isValid(cpfOrCnpj))
  );
}

export function isValidPostalCode(postalCode: string): boolean {
  return /^\d{5}-\d{3}$/.test(postalCode);
}

export function isValidPhone(phone: string): boolean {
  return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone);
}

type ValidationRule = {
  validate: (val: string) => boolean;
  message: string;
};

const VALIDATION_RULES: Partial<Record<INPUTS_POSSIBLE, ValidationRule>> = {
  [INPUTS_POSSIBLE.credit_card_number]: {
    validate: (v) => isValidCreditCard(stripFormatting(v)),
    message: 'Número de cartão inválido',
  },
  [INPUTS_POSSIBLE.credit_card_expiry]: {
    validate: isValidExpiryDate,
    message: 'Data de expiração inválida',
  },
  [INPUTS_POSSIBLE.credit_card_ccv]: {
    validate: (v) => isValidCCV(stripFormatting(v)),
    message: 'Código de segurança inválido',
  },
  [INPUTS_POSSIBLE.credit_card_holder_name]: {
    validate: (v) => !!v && v.length >= 3,
    message: 'Nome inválido',
  },
  [INPUTS_POSSIBLE.credit_card_holder_cpf_cnpj]: {
    validate: isValidCpfOrCnpj,
    message: 'Cpf ou CNPJ inválido',
  },
  [INPUTS_POSSIBLE.credit_card_holder_postal_code]: {
    validate: isValidPostalCode,
    message: 'Código postal inválido',
  },
  [INPUTS_POSSIBLE.credit_card_holder_phone]: {
    validate: isValidPhone,
    message: 'Telefone inválido',
  },
};

export function validateInputs(
  inputsObj: Record<string, string>,
  values: Record<string, string>,
  sameCpf: boolean
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const input of Object.keys(inputsObj)) {
    const rule = VALIDATION_RULES[input as INPUTS_POSSIBLE];
    if (rule && !rule.validate(values[input] ?? '')) {
      errors[input] = rule.message;
    }
  }

  if (
    input_cpf_cnpj_needs_validation(inputsObj, sameCpf) &&
    !isValidCpfOrCnpj(values[INPUTS_POSSIBLE.cpf_cnpj] ?? '')
  ) {
    errors[INPUTS_POSSIBLE.cpf_cnpj] = 'Cpf ou CNPJ inválido';
  }

  return errors;
}

function input_cpf_cnpj_needs_validation(
  inputsObj: Record<string, string>,
  sameCpf: boolean
): boolean {
  return INPUTS_POSSIBLE.cpf_cnpj in inputsObj && !sameCpf;
}
