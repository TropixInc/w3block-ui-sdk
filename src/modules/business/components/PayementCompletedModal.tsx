
import { ModalBase } from "../../shared/components/ModalBase";
import useTranslation from "../../shared/hooks/useTranslation";


interface PayementCompletedModalProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export const PayementCompletedModal = ({
  onClose,
  isOpen,
}: PayementCompletedModalProps) => {
  const [translate] = useTranslation();
  return (
    <ModalBase isOpen={isOpen ?? false} onClose={onClose!} clickAway={false}>
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-py-8">
        <p className="pw-text-lg pw-text-center pw-font-[600] pw-text-zinc-900 pw-mb-10">
          {translate('business>paymentCompletedModal>paymentSucess')}
        </p>
        <button
          onClick={() => onClose?.()}
          className="pw-px-6 pw-py-[6px] pw-bg-blue-800 pw-rounded-full pw-shadow pw-border-b pw-border-white pw-text-white pw-text-xs pw-font-medium"
        >
          {translate('shared>back')}
        </button>
      </div>
    </ModalBase>
  );
};
