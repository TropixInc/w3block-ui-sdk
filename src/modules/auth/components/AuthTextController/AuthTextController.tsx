import { ReactNode } from 'react';

import AuthFormController from '../AuthFormController/AuthFormController';
import { AuthTextField } from '../AuthTextField';

interface AuthTextControllerProps {
  className?: string;
  name: string;
  placeholder?: string;
  type?: 'text' | 'password';
  label: string;
  renderTips?: () => ReactNode;
}

export const AuthTextController = ({
  name,
  label,
  className = '',
  type = 'text',
  placeholder = '',
  renderTips,
}: AuthTextControllerProps) => {
  return (
    <AuthFormController
      name={name}
      label={label}
      className={className}
      renderTips={renderTips}
    >
      <AuthTextField
        name={name}
        type={type}
        className="pw-mb-[5.5px]"
        placeholder={placeholder}
      />
    </AuthFormController>
  );
};
