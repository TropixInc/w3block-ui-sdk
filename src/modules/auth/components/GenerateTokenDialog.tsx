import { useTranslation } from "react-i18next";
import { PixwayAppRoutes } from "../../shared/enums/PixwayAppRoutes";
import { useHostname } from "../../shared/hooks/useHostname";
import { DialogBase } from "../../shared/components/DialogBase";

export const GenerateTokenDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [translate] = useTranslation();
  const hostname = useHostname();

  function openMetaMaskUrl(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const onConfirm = () => {
    // eslint-disable-next-line prettier/prettier
    const target = `${hostname ?? ''}/${PixwayAppRoutes.SIGN_IN}`;
    const url = `https://metamask.app.link/dapp/${target}`;
    openMetaMaskUrl(url);
    onClose();
  };

  return (
    <DialogBase
      onClose={onClose}
      cancelButtonText={translate('components>cancelButton>cancel')}
      confirmButtonText={translate('components>advanceButton>continue')}
      onCancel={onClose}
      isOpen={isOpen}
      onConfirm={onConfirm}
      classes={{
        dialogCard: '!pw-px-[98px] !pw-max-w-[653px]',
        actionContainer: '!pw-gap-x-15',
      }}
    >
      <p className="pw-font-semibold pw-text-xl pw-leading-[23px] pw-text-black pw-mb-[53px] pw-text-center">
        {translate('components>connectMetamaks>noExtension')}
      </p>
    </DialogBase>
  );
};
