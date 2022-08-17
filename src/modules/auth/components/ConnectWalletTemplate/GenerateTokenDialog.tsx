import DialogBase from '../../../shared/components/DialogBase/DialogBase';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import useHostname from '../../../shared/hooks/useHostname/useHostname';
import useTranslation from '../../../shared/hooks/useTranslation';

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
    a.target = '_self';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const onConfirm = () => {
    // eslint-disable-next-line prettier/prettier
    const target = `${hostname ?? ''}${PixwayAPIRoutes.SIGN_IN}`;
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
        confirmButton: '!pw-py-3 !pw-w-full !pw-max-w-[200px]',
        cancelButton: '!pw-py-3 !pw-w-full !pw-max-w-[200px]',
      }}
    >
      <p className="pw-font-semibold pw-text-xl pw-leading-[23px] pw-text-black pw-mb-[53px]">
        ##METAMASK_NOT_FOUND## ##USE_METAMASK_APP_OR_EXTENSION_TO_CONTINUE_##
      </p>
    </DialogBase>
  );
};
