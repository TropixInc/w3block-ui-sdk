import { useController } from 'react-hook-form';

import classNames from 'classnames';

import CheckCircleOutlined from '../../shared/assets/icons/checkCircledOutlined.svg';
import ErrorCircled from '../../shared/assets/icons/errorCircled.svg';
import { useTranslation } from 'react-i18next';
import { usePasswordMeetsCriteria } from '../hooks/usePasswordMeetsCriteria';


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
  const renderIcon = () => {
    if (!isPasswordDirty) return null;
    return !isValid ? (
      <ErrorCircled className="pw-stroke-[#C63535] pw-h-[14px] pw-w-[14px]" />
    ) : (
      <CheckCircleOutlined className="pw-stroke-[#76DE8D] pw-h-[14px] pw-w-[14px]" />
    );
  };

  return (
    <li
      className={classNames(
        'pw-text-xs pw-leading-[14px] pw-flex pw-items-center pw-gap-x-[5px] pw-text-[#777E8F]'
      )}
    >
      {renderIcon()}
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
        'companyAuth>newPasswordTips>passwordMeetsMinimumCharactersQuantity'
      ),
      isValid: passwordHasMinEightNumbers,
    },
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
  ];

  return (
    <ul className={classNames(className, 'pw-flex pw-flex-col pw-gap-y-1.5')}>
      {validations.map(({ label, isValid }) => (
        <Tip key={label} isValid={isValid} isPasswordDirty={fieldState.isDirty}>
          {label}
        </Tip>
      ))}
    </ul>
  );
};
