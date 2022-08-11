import { useController } from 'react-hook-form';

import classNames from 'classnames';

import useTranslation from '../../../shared/hooks/useTranslation';
import { usePasswordMeetsCriteria } from '../../hooks/usePasswordMeetsCriteria';

interface Props {
  className?: string;
  passwordFieldName: string;
}

interface TipProps {
  isValid: boolean;
  children: string;
  isPasswordDirty: boolean;
}

const Tip = ({ isValid, children, isPasswordDirty }: TipProps) => {
  const getTextColor = () => {
    if (!isPasswordDirty) return 'pw-text-[#353945]';
    return isValid ? 'pw-text-[#76DE8D]' : 'pw-text-[#C63535]';
  };

  return (
    <li
      className={classNames('pw-text-[13px] pw-leading-[18px]', getTextColor())}
    >
      {children}
    </li>
  );
};

export const AuthPasswordTips = ({
  className = '',
  passwordFieldName,
}: Props) => {
  const [translate] = useTranslation();
  const { field, fieldState } = useController({ name: passwordFieldName });
  const {
    passwordHasCapitalizedLetter,
    passwordHasMinEightNumbers,
    passwordHasNumber,
    passwordHasUncapitalizedLetter,
  } = usePasswordMeetsCriteria(field.value);

  const validations = [
    {
      label: translate(
        'companyAuth>newPasswordTips>passwordContainsUppercaseLetter'
      ),
      isValid: passwordHasCapitalizedLetter,
    },
    {
      label: translate(
        'companyAuth>newPasswordTips>passwordContainsLowercaseLetter'
      ),
      isValid: passwordHasUncapitalizedLetter,
    },
    {
      label: translate('companyAuth>newPasswordTips>passwordContainsNumbers'),
      isValid: passwordHasNumber,
    },
    {
      label: translate(
        'companyAuth>newPasswordTips>passwordMeetsMinimumCharactersQuantity'
      ),
      isValid: passwordHasMinEightNumbers,
    },
  ];

  return (
    <ul className={classNames(className, 'pw-flex pw-flex-col pw-gap-y-1')}>
      {validations.map(({ label, isValid }) => (
        <Tip key={label} isValid={isValid} isPasswordDirty={fieldState.isDirty}>
          {label}
        </Tip>
      ))}
    </ul>
  );
};
