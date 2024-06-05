import { ModalBase } from '../../../shared/components/ModalBase';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal = ({ isOpen, onClose }: ModalProps) => {
  return (
    <ModalBase
      isOpen={isOpen}
      classes={{ dialogCard: 'pw-w-[320px] sm:pw-w-[680px]' }}
      onClose={onClose}
    >
      <div className="pw-w-full">
        <p className="pw-text-center">Realizar saque</p>
        <div>
          <div>
            <input type="text" />
            <p>saldo: </p>
          </div>
          <button>Sacar tudo</button>
        </div>
      </div>
    </ModalBase>
  );
};

export default WithdrawModal;
