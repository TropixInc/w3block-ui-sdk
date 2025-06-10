import { ChangeEvent, useEffect, useState } from 'react';

import { WalletTypes } from '@w3block/sdk-id';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useRequestWalletConnect } from '../../hooks/useRequestWalletConnect';
import { useUserWallet } from '../../hooks/useUserWallet/useUserWallet';
import { ModalBase } from '../ModalBase';
import { Spinner } from '../Spinner';
import { WeblockButton } from '../WeblockButton';


interface Props {
  isOpen: boolean;
  onClose(): void;
}

enum StepsVault {
  FIRST = 1,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH,
  LAST,
  FINISHED,
  ERROR,
}

export const WalletConnectModal = ({ isOpen, onClose }: Props) => {
  const { mainWallet: wallet } = useUserWallet();
  const isMobile = useIsMobile();
  const [translate] = useTranslation();
  const [steps, setSteps] = useState(
    wallet?.type === WalletTypes.Metamask ? 1 : 6
  );
  const [uriValue, setUriValue] = useState('');
  const {
    mutate: connectMutate,
    isSuccess: connectSuccess,
    isLoading: connectLoading,
    isError: connectError,
  } = useRequestWalletConnect();

  useEffect(() => {
    if (connectError) setSteps(StepsVault.ERROR);
    if (connectSuccess) setSteps(StepsVault.FINISHED);
  }, [connectError, connectSuccess]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUriValue(event.target.value);
  };

  const handleClose = () => {
    onClose();
    setSteps(wallet?.type === WalletTypes.Metamask ? 1 : 6);
  };

  const renderStepsVault = () => {
    const renderChildren = () => {
      switch (steps) {
        case StepsVault.FIRST:
          return (
            <>
              <img
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
                src="https://res.cloudinary.com/tropix/image/upload/v1683207269/assets/vaultFirst_zovsup.png"
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                {translate('shared>walletConnectModal>joinPrimeseaChannel')}
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                {translate(
                  'shared>walletConnectModal>joinPrimeseaChannelSurface'
                )}
              </p>
              <div className="pw-w-[144px] pw-h-[16px] pw-mx-auto pw-flex pw-justify-center pw-gap-3">
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#295BA6]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
              </div>
            </>
          );
        case StepsVault.SECOND:
          return (
            <>
              <img
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
                src="https://res.cloudinary.com/tropix/image/upload/v1683207269/assets/vaultSecond_ytyhpn.png"
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                {translate('shared>walletConnectModal>stillDiscordPrimesea')}
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                {translate(
                  'shared>walletConnectModal>discordPrimeseaStepsExplain'
                )}
              </p>
              <div className="pw-w-[144px] pw-h-[16px] pw-mx-auto pw-flex pw-justify-center pw-gap-3">
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#295BA6]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
              </div>
            </>
          );
        case StepsVault.THIRD:
          return (
            <>
              <img
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
                src="https://res.cloudinary.com/tropix/image/upload/v1683207269/assets/vaultThird_bi4red.png"
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                {translate('shared>walletConnectModal>redirectCollab')}
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                {translate(
                  'shared>walletConnectModal>copyCodeWalletConnectInCollab'
                )}
              </p>
              <div className="pw-w-[144px] pw-h-[16px] pw-mx-auto pw-flex pw-justify-center pw-gap-3">
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#295BA6]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
              </div>
            </>
          );
        case StepsVault.FOURTH:
          return (
            <>
              <img
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
                src="https://res.cloudinary.com/tropix/image/upload/v1683207269/assets/vaultFourth_mno4mx.png"
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                {translate('shared>walletConnectModal>willOpenWindow')}
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                {translate('shared>walletConnectModal>clickCopyCode')}
              </p>
              <div className="pw-w-[144px] pw-h-[16px] pw-mx-auto pw-flex pw-justify-center pw-gap-3">
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#295BA6]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
              </div>
            </>
          );
        case StepsVault.FIFTH:
          return (
            <>
              <img
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
                src="https://res.cloudinary.com/tropix/image/upload/v1683207269/assets/vaultFifth_fjvwjj.png"
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                {translate('shared>walletConnectModal>nowSyncWalletConnect')}
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                {translate('shared>walletConnectModal>hereIntegrationSyncCode')}
              </p>
              <div className="pw-w-[144px] pw-h-[16px] pw-mx-auto pw-flex pw-justify-center pw-gap-3">
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#295BA6]" />
              </div>
            </>
          );
        case StepsVault.LAST:
          return (
            <div className="pw-text-center">
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6]">
                {translate('components>walletIntegration>copyCode')}
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F]">
                {translate('components>walletIntegration>chooseCollab')}
              </p>
              {connectLoading ? (
                <div className="pw-flex pw-justify-center pw-items-center pw-my-3">
                  <Spinner />
                </div>
              ) : (
                <input
                  onChange={handleChange}
                  className="pw-border pw-border-[#295BA6] pw-rounded-[8px] pw-p-[10px_16px] pw-mt-[36px] pw-w-full pw-text-center"
                  type="text"
                />
              )}
            </div>
          );
        case StepsVault.FINISHED:
          return (
            <p className="pw-font-normal pw-text-base !pw-text-center pw-font-poppins pw-text-[#777E8F]">
              {translate('components>walletIntegration>connectSuccess')}
            </p>
          );
        case StepsVault.ERROR:
          return (
            <p className="pw-font-normal pw-text-base !pw-text-center pw-font-poppins pw-text-[#777E8F]">
              {translate('components>walletIntegration>connectFailed')}
            </p>
          );
      }
    };

    const handleTutorial = () => {
      if (steps === StepsVault.LAST) {
        setSteps(StepsVault.FIRST);
      } else {
        setSteps(StepsVault.LAST);
      }
    };

    const handleNext = () => {
      if (steps === StepsVault.LAST && wallet) {
        connectMutate({
          chainId: wallet.chainId,
          address: wallet.address,
          uri: uriValue,
        });
      } else if (steps !== StepsVault.LAST) {
        setSteps(steps + 1);
      }
    };

    return (
      <>
        {steps === StepsVault.ERROR ? (
          <div className="pw-font-poppins pw-font-medium sm:pw-text-2xl pw-text-base pw-text-center pw-max-w-[419px] pw-mx-auto">
            {translate('components>walletIntegration>connectFail')}
          </div>
        ) : (
          <div className="pw-font-poppins pw-font-medium sm:pw-text-2xl pw-text-base pw-text-center pw-max-w-[419px] pw-mx-auto">
            {steps === StepsVault.FINISHED
              ? translate('components>walletIntegration>connectCompleted')
              : translate('components>walletIntegration>connectDiscord')}
          </div>
        )}
        <div className="pw-my-[36px] sm:pw-text-left pw-text-center">
          {renderChildren()}
        </div>
        {steps !== StepsVault.FINISHED && steps !== StepsVault.ERROR && (
          <div className="pw-flex pw-flex-row">
            <button
              onClick={handleTutorial}
              className="pw-px-[24px] pw-h-[33px] pw-w-[277px] pw-mr-4 pw-bg-[#EFEFEF] pw-border-[#295BA6] pw-rounded-[48px] pw-border pw-font-poppins pw-font-medium pw-text-xs"
            >
              {steps === StepsVault.LAST
                ? translate('components>walletIntegration>seeTutorial')
                : translate('components>walletIntegration>skipTutorial')}
            </button>
            <WeblockButton
              onClick={handleNext}
              className="!pw-h-[33px] pw-w-[277px] !pw-text-white"
            >
              {steps === StepsVault.LAST
                ? translate('components>walletIntegration>connect')
                : translate('components>walletIntegration>next')}
            </WeblockButton>
          </div>
        )}
        {steps === StepsVault.ERROR && (
          <div className="pw-w-full">
            <WeblockButton
              onClick={() => setSteps(StepsVault.LAST)}
              className="!pw-h-[33px] !pw-text-white"
              fullWidth
            >
              {translate('components>walletIntegration>tryAgain')}
            </WeblockButton>
          </div>
        )}
      </>
    );
  };

  const renderStepsMetamask = () => {
    const renderChildren = () => {
      switch (steps) {
        case StepsVault.FIRST:
          return (
            <>
              <img
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
                src="https://res.cloudinary.com/tropix/image/upload/v1683207269/assets/vaultFirst_zovsup.png"
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                {translate('shared>walletConnectModal>joinPrimeseaChannel')}
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                {translate(
                  'shared>walletConnectModal>joinPrimeseaChannelSurface'
                )}
              </p>
              <div className="pw-w-[112px] pw-h-[16px] pw-mx-auto pw-flex pw-justify-center pw-gap-3">
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#295BA6]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
              </div>
            </>
          );
        case StepsVault.SECOND:
          return (
            <>
              <img
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
                src="https://res.cloudinary.com/tropix/image/upload/v1683207269/assets/vaultSecond_ytyhpn.png"
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                {translate('shared>walletConnectModal>stillDiscordPrimesea')}
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                {translate(
                  'shared>walletConnectModal>discordPrimeseaStepsExplain'
                )}
              </p>
              <div className="pw-w-[112px] pw-h-[16px] pw-mx-auto pw-flex pw-justify-center pw-gap-3">
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#295BA6]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
              </div>
            </>
          );
        case StepsVault.THIRD:
          return (
            <>
              <img
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
                src="https://res.cloudinary.com/tropix/image/upload/v1683207269/assets/metamaskThird_knp4h3.png"
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                {translate('shared>walletConnectModal>redirectCollab')}
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                {translate('shared>walletConnectModal>clickInMetamask')}
              </p>
              <div className="pw-w-[112px] pw-h-[16px] pw-mx-auto pw-flex pw-justify-center pw-gap-3">
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#295BA6]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
              </div>
            </>
          );
        case StepsVault.LAST:
          return (
            <>
              <img
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
                src="https://res.cloudinary.com/tropix/image/upload/v1683207269/assets/vaultFourth_mno4mx.png"
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                {translate('shared>walletConnectModal>followMetamaskSteps')}
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                {translate('shared>walletConnectModal>waitConectMetamask')}
              </p>
              <div className="pw-w-[112px] pw-h-[16px] pw-mx-auto pw-flex pw-justify-center pw-gap-3">
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#88ABDF]" />
                <div className="pw-w-[16px] pw-h-[16px] pw-rounded-full pw-bg-[#295BA6]" />
              </div>
            </>
          );
      }
    };

    const handleNext = () => {
      if (steps === StepsVault.LAST) {
        handleClose();
      } else {
        setSteps(steps + 1);
      }
    };

    return (
      <>
        <div className="pw-font-poppins pw-font-medium sm:pw-text-2xl pw-text-base pw-text-center pw-max-w-[419px] pw-mx-auto">
          {translate('components>walletIntegration>connectMetamask')}
        </div>
        <div className="pw-my-[36px] sm:pw-text-left pw-text-center">
          {renderChildren()}
        </div>
        <div className="pw-flex pw-flex-row">
          <WeblockButton
            onClick={handleNext}
            className="!pw-h-[33px] !pw-text-white"
            fullWidth
          >
            {steps === StepsVault.LAST
              ? translate('components>walletIntegration>close')
              : translate('components>walletIntegration>next')}
          </WeblockButton>
        </div>
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
      {wallet?.type === WalletTypes.Metamask
        ? renderStepsMetamask()
        : renderStepsVault()}
    </ModalBase>
  );
};
