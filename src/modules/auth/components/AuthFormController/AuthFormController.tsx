import { ReactNode } from 'react';
import { useController } from 'react-hook-form';

import { HeadlessFormController } from '../../../shared/components/HeadlessFormController';
import { AuthValidationTip } from '../AuthValidationTip';

interface Props {
  label: string;
  name: string;
  children: ReactNode;
  className?: string;
  renderTips?: () => ReactNode;
}

const AuthFormController = ({
  label,
  name,
  children,
  className = '',
  renderTips,
}: Props) => {
  const { fieldState } = useController({ name });
  return (
    <HeadlessFormController name={name}>
      <div className={className}>
        <HeadlessFormController.Label className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
          {label}
        </HeadlessFormController.Label>
        {children}
        {renderTips ? (
          renderTips()
        ) : (
          <AuthValidationTip
            isDirty={fieldState.isDirty}
            error={fieldState.error}
          />
        )}
      </div>
    </HeadlessFormController>
  );
};

export default AuthFormController;
