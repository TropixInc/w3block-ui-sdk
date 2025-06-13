import { FieldError } from 'react-hook-form';

import classNames from 'classnames';

import CheckCircleOutlined from '../../shared/assets/icons/checkCircledOutlined.svg';
import ErrorCircled from '../../shared/assets/icons/errorCircled.svg';

interface AuthValidationTipProps {
  isDirty: boolean;
  error?: FieldError;
}

export const AuthValidationTip = ({
  isDirty,
  error,
}: AuthValidationTipProps) => {
  const getMessage = () => {
    if (error) return error.message;
    return isDirty ? 'Ok' : '';
  };

  const isValid = isDirty && !error;

  return (
    <p
      className={classNames(
        isValid ? 'pw-text-[#76DE8D]' : 'pw-text-[#C63535]',
        'pw-leading-[18px] pw-text-xs pw-font-semibold pw-flex pw-items-center pw-gap-x-2'
      )}
    >
      {error ? (
        <ErrorCircled height={14} width={14} className="pw-stroke-[#C63535]" />
      ) : null}

      {isValid ? (
        <CheckCircleOutlined className="pw-w-[14px] pw-h-[14px] pw-stroke-[#76DE8D]" />
      ) : null}

      {getMessage()}
    </p>
  );
};
