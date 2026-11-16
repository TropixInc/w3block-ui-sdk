import { PasswordValidationList } from './PasswordValidationList';

interface Props {
  className?: string;
  value: string;
}

export const PasswordTips = ({ className = '', value = '' }: Props) => {
  return (
    <PasswordValidationList
      className={className}
      password={value}
      isDirty={Boolean(value.length)}
    />
  );
};
