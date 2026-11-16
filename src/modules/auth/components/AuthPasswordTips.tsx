import { useController } from 'react-hook-form';

import { PasswordValidationList } from './PasswordValidationList';

interface Props {
  className?: string;
  passwordFieldName: string;
}

export const AuthPasswordTips = ({
  className = '',
  passwordFieldName,
}: Props) => {
  const { field, fieldState } = useController({ name: passwordFieldName });

  return (
    <PasswordValidationList
      className={className}
      password={field.value}
      isDirty={fieldState.isDirty}
    />
  );
};
