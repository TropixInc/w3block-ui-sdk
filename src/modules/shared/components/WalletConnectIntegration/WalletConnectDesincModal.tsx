import { useTranslation } from "react-i18next";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useUserWallet } from "../../hooks/useUserWallet/useUserWallet";
import { ModalBase } from "../ModalBase";
import { Spinner } from "../Spinner";
import { WeblockButton } from "../WeblockButton";
import { useDisconnectWalletConnect } from "../../hooks/useDisconnectWalletConnect";
import { useIntegrations } from "../../hooks/useIntegrations";

interface Props {
  isOpen: boolean;
  onClose(): void;
}

export const WalletConnectDesinModal = ({ isOpen, onClose }: Props) => {
  const { mainWallet: wallet } = useUserWallet();
  const isMobile = useIsMobile();
  const [translate] = useTranslation();

  const {
    mutate: disconnectMutate,
    isSuccess: disconnectSuccess,
    isLoading: disconnectLoading,
    isError: disconnectError,
  } = useDisconnectWalletConnect();

  const { data: integrations } = useIntegrations();

  const hasWalletConnect = integrations ? integrations.data[0]?.active : false;

  const handleClose = () => {
    onClose();
  };

  const renderDesincOption = () => {
    const handleDisconnect = () => {
      if (hasWalletConnect && wallet) {
        disconnectMutate({
          chainId: wallet.chainId,
          address: wallet.address,
        });
      }
    };

    const renderChildren = () => {
      if (disconnectSuccess)
        return (
          <>
            <div className="pw-my-[36px] pw-text-center">
              <p className="pw-font-normal pw-text-base pw-font-poppins pw-text-[#777E8F]">
                {translate('components>walletIntegration>disconnectSuccess')}
              </p>
            </div>
          </>
        );
      if (disconnectError)
        return (
          <>
            <div className="pw-my-[36px] pw-text-center">
              <p className="pw-font-normal pw-text-base pw-font-poppins pw-text-[#777E8F]">
                {translate('components>walletIntegration>disconnectFail')}
              </p>
            </div>
            {disconnectLoading ? (
              <div className="pw-flex pw-justify-center pw-items-center pw-my-3">
                <Spinner />
              </div>
            ) : (
              <div className="pw-flex pw-flex-row">
                <button
                  onClick={handleClose}
                  className="pw-px-[24px] pw-h-[33px] pw-w-[277px] pw-mr-4 pw-bg-[#EFEFEF] pw-border-[#295BA6] pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs"
                >
                  {translate('components>walletIntegration>cancel')}
                </button>
                <WeblockButton
                  onClick={handleDisconnect}
                  className="!pw-h-[33px] pw-w-[277px]"
                >
                  {translate('components>walletIntegration>tryAgain')}
                </WeblockButton>
              </div>
            )}
          </>
        );
      else
        return (
          <>
            <div className="pw-my-[36px] pw-text-center">
              <p className="pw-font-normal pw-text-base pw-font-poppins pw-text-[#777E8F]">
                {translate('components>walletIntegration>confirmDisconnect')}
              </p>
            </div>
            {disconnectLoading ? (
              <div className="pw-flex pw-justify-center pw-items-center pw-my-3">
                <Spinner />
              </div>
            ) : (
              <div className="pw-flex pw-flex-row">
                <button
                  onClick={handleClose}
                  className="pw-px-[24px] pw-h-[33px] pw-w-[277px] pw-mr-4 pw-bg-[#EFEFEF] pw-border-[#295BA6] pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs"
                >
                  {translate('components>walletIntegration>cancel')}
                </button>
                <WeblockButton
                  onClick={handleDisconnect}
                  className="!pw-h-[33px] pw-w-[277px] !pw-text-white"
                >
                  {translate('components>walletIntegration>continue')}
                </WeblockButton>
              </div>
            )}
          </>
        );
    };

    return (
      <>
        <div className="pw-font-poppins pw-font-medium sm:pw-text-2xl pw-text-base pw-text-center pw-max-w-[419px] pw-mx-auto">
          {translate('components>walletIntegration>disconnect')}
        </div>
        {renderChildren()}
      </>
    );
  };

  return (
    <ModalBase
      classes={{
        classComplement: isMobile
          ? '!pw-max-w-full !pw-w-full !pw-h-full !pw-rounded-none !pw-mt-[90px]'
          : '',
      }}
      isOpen={isOpen}
      onClose={handleClose}
      backdrop={!isMobile}
    >
      {renderDesincOption()}
    </ModalBase>
  );
};
