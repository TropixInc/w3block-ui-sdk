import { useCopyToClipboard } from 'react-use';
import { ModalBase } from '../../shared/components/ModalBase';
import useTranslation from '../../shared/hooks/useTranslation';


interface MetamaskAppErrorModalProps {
  isOpen: boolean;
  closeModal: () => void;
}
export const MetamaskAppErrorModal = ({
  isOpen,
  closeModal,
}: MetamaskAppErrorModalProps) => {
  const [_, copy] = useCopyToClipboard();
  const [translate] = useTranslation();
  return (
    <ModalBase
      classes={{ classComplement: 'pw-min-w-[300px] pw-pt-[55px]' }}
      isOpen={isOpen}
      onClose={closeModal}
    >
      <p className="pw-text-center pw-font-bold pw-text-lg pw-font-poppins">
        {translate('connectWallet>metamaskError>app>title')}
      </p>
      <p className="pw-text-center pw-text-sm pw-font-poppins">
        {translate('connectWallet>metamaskError>app>description')}
      </p>
      <div className="pw-px-6">
        <p className="pw-text-xs pw-font-poppins pw-border pw-border-brand-primary pw-rounded-lg pw-px-4 pw-py-4 pw-mt-6 pw-text-center">
          {translate('connectWallet>metamaskError>app>fristSuggestion')}
          <br />
          <span
            className="pw-cursor-pointer pw-underline pw-font-bold"
            onClick={() => copy(window.location.href)}
          >
            ( {translate('connectWallet>metamaskError>app>copyUrl')} ).
          </span>
        </p>
        <p className="pw-text-xs pw-mt-2 pw-text-center">
          {translate('auth>metamaskAppErrorModal>or')}
        </p>
        <p className="pw-text-xs pw-text-center pw-font-poppins pw-border pw-border-brand-primary pw-rounded-lg pw-px-4 pw-py-4 pw-mt-2">
          {translate('connectWallet>metamaskError>app>secondSuggestion')}
        </p>
      </div>
    </ModalBase>
  );
};
