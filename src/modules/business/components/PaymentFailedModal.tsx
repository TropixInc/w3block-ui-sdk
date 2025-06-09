import { useTranslation } from "react-i18next";
import { Alert } from "../../shared/components/Alert";
import { ModalBase } from "../../shared/components/ModalBase";


interface PaymentFailedModalProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export const PaymentFailedModal = ({
  onClose,
  isOpen,
}: PaymentFailedModalProps) => {
  const [translate] = useTranslation();
  return (
    <ModalBase isOpen={isOpen ?? false} onClose={onClose!} clickAway={false}>
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-py-8">
        <Alert
          variant="error"
          className="pw-text-lg pw-text-center pw-font-[600] pw-text-zinc-900 pw-mb-10"
        >
          {translate('business>paymentFailedModal>transactionError')}
        </Alert>
        <button
          onClick={() => onClose?.()}
          className="pw-px-6 pw-py-[6px] pw-bg-blue-800 pw-rounded-full pw-shadow pw-border-b pw-border-white pw-text-white pw-text-xs pw-font-medium"
        >
          {translate('token>commerceTemplate>back')}
        </button>
      </div>
    </ModalBase>
  );
};
