import { ReactNode } from 'react';
import { FieldError, useController } from 'react-hook-form';
import { HeadlessFormController } from '../../shared/components/HeadlessFormController';
import { AuthValidationTip } from './AuthValidationTip';




export type AuthFormControllerRenderTipsFunction = (args: {
  isDirty: boolean;
  error?: FieldError;
}) => ReactNode;

interface Props {
  label: string;
  name: string;
  children: ReactNode;
  className?: string;
  renderTips?: AuthFormControllerRenderTipsFunction;
}

const AuthFormController = ({
  label,
  name,
  children,
  className = '',
  renderTips,
}: Props) => {
  const {
    fieldState: { isDirty, error },
  } = useController({ name });
  return (
    <HeadlessFormController name={name}>
      <div className={className}>
        <HeadlessFormController.Label className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-1">
          {label}
        </HeadlessFormController.Label>
        {children}
        {renderTips ? (
          renderTips({ isDirty, error })
        ) : (
          <AuthValidationTip isDirty={isDirty} error={error} />
        )}
      </div>
    </HeadlessFormController>
  );
};

export default AuthFormController;
