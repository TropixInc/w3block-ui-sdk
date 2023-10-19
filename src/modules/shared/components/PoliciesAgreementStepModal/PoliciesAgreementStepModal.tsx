import { ReactNode, lazy } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

const Checkbox = lazy(() =>
  import('../Checkbox').then((module) => ({
    default: module.Checkbox,
  }))
);
const DialogBase = lazy(() =>
  import('../DialogBase').then((module) => ({
    default: module.DialogBase,
  }))
);

interface Props {
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  title: string;
  children?: ReactNode;
  subtitle: string;
  userAgreementLabel: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  buttonDisabled?: boolean;
}

interface Form {
  userAgrees: boolean;
}

export const PoliciesAgreementStepModal = ({
  cancelButtonLabel,
  confirmButtonLabel,
  title,
  subtitle,
  children,
  userAgreementLabel,
  isOpen,
  buttonDisabled = false,
  onClose,
  onCancel,
  onConfirm,
}: Props) => {
  const methods = useForm<Form>({
    defaultValues: {
      userAgrees: false,
    },
  });
  const { userAgrees } = useWatch({ control: methods.control });

  return (
    <DialogBase
      cancelButtonText={cancelButtonLabel}
      confirmButtonText={confirmButtonLabel}
      isOpen={isOpen}
      classes={{
        dialogCard: '!pw-px-20 !pw-py-12',
        actionContainer: '!pw-justify-between !pw-gap-x-13 !pw-text-black',
      }}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onClose={onClose}
      isConfirmButtonDisabled={!userAgrees || buttonDisabled}
    >
      <div className="pw-mb-6">
        <div>
          <h1 className="pw-text-black pw-font-semibold pw-text-2xl pw-leading-7 pw-text-center pw-mb-6">
            {title}
          </h1>
          <h2 className="pw-mb-6 pw-text-sm pw-leading-4 pw-text-black">
            {subtitle}
          </h2>
        </div>
        {children}

        <FormProvider {...methods}>
          <div className="pw-flex pw-items-start pw-gap-x-[8.3px]">
            <Checkbox name="userAgrees" />
            <p
              className="pw-font-medium pw-text-sm pw-leading-[19px] pw-text-black"
              onClick={() =>
                methods.setValue('userAgrees', !methods.getValues('userAgrees'))
              }
            >
              {userAgreementLabel}
            </p>
          </div>
        </FormProvider>
      </div>
    </DialogBase>
  );
};
