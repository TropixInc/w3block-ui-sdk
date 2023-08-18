import { ModalBase } from '../../../shared/components/ModalBase';

interface PayementCompletedModalProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export const PayementCompletedModal = ({
  onClose,
  isOpen,
}: PayementCompletedModalProps) => {
  return (
    <ModalBase isOpen={isOpen ?? false} onClose={onClose!}>
      <div className="pw-flex pw-flex-col pw-justify-center pw-items-center pw-py-8">
        <p className="pw-text-lg pw-text-center pw-font-[600] pw-text-zinc-900 pw-mb-10">
          Pagamento e cashback registrados com sucesso!
        </p>
        <button
          onClick={() => onClose?.()}
          className="pw-px-6 pw-py-[6px] pw-bg-blue-800 pw-rounded-full pw-shadow pw-border-b pw-border-white pw-text-white pw-text-xs pw-font-medium"
        >
          Voltar
        </button>
      </div>
    </ModalBase>
  );
};
