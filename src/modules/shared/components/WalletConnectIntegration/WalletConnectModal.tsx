import { ChangeEvent, useEffect, useState } from 'react';

import { WalletTypes } from '@w3block/sdk-id';

import { ReactComponent as MetamaskThirdIMG } from '../../assets/images/metamaskThird.svg';
import { ReactComponent as VaultFifthIMG } from '../../assets/images/vaultFifth.svg';
import { ReactComponent as VaultFirstIMG } from '../../assets/images/vaultFirst.svg';
import { ReactComponent as VaultFourthIMG } from '../../assets/images/vaultFourth.svg';
import { ReactComponent as VaultSecondIMG } from '../../assets/images/vaultSecond.svg';
import { ReactComponent as VaultThirdIMG } from '../../assets/images/vaultThird.svg';
import { useDisconnectWalletConnect } from '../../hooks/useDisconnectWalletConnect';
import { useIntegrations } from '../../hooks/useIntegrations';
import useIsMobile from '../../hooks/useIsMobile/useIsMobile';
import { useRequestWalletConnect } from '../../hooks/useRequestWalletConnect';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet';
import { ModalBase } from '../ModalBase';
import { Spinner } from '../Spinner';
import { WeblockButton } from '../WeblockButton/WeblockButton';

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
  const { wallet } = useUserWallet();
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
  const {
    mutate: disconnectMutate,
    isSuccess: disconnectSuccess,
    isLoading: disconnectLoading,
    isError: disconnectError,
  } = useDisconnectWalletConnect();
  const { data: integrations } = useIntegrations();

  useEffect(() => {
    if (connectError) setSteps(StepsVault.ERROR);
    if (connectSuccess) setSteps(StepsVault.FINISHED);
  }, [connectError, connectSuccess]);

  const hasWalletConnect = integrations ? integrations.data[0]?.active : false;

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
              <VaultFirstIMG
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                Entre no canal do PrimeSea no Discord
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                Entre no Discord do PrimeSea e procure pelo canal “Superfície”.
                Leia o texto e clique em “Entendi”.
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
              <VaultSecondIMG
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                Ainda no discord do PrimeSea
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                Logo em seguida irá habilitar o canal “Conecte-se” em “Conecte
                seu Token” e então clique em “Lets go”. Uma nova mensagem será
                mostrada para você, clique no “Conectar Wallet”.
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
              <VaultThirdIMG
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                Você será redirecionado para o Collab.Land
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                No Collab.Land, clique em “WalletConnect”. Copie o código que
                aparecer.
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
              <VaultFourthIMG
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                Irá abrir uma janela
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                Nessa janela, clique em “copiar código”.
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
              <VaultFifthIMG
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                Agora é hora de sincronizar com a WalletConnect
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                Aqui em Integração, na parte de Sincronizar WalletConnect,
                clique em “Sincronizar” e cole o código copiado do Collab.Land.
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
              className="!pw-h-[33px] pw-w-[277px]"
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
              className="!pw-h-[33px]"
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
              <VaultFirstIMG
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                Entre no canal do PrimeSea no Discord
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                Entre no Discord do PrimeSea e procure pelo canal “Superfície”.
                Leia o texto e clique em “Entendi”.
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
              <VaultSecondIMG
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                Ainda no discord do PrimeSea
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                Logo em seguida irá habilitar o canal “Conecte-se” em “Conecte
                seu Token” e então clique em “Lets go”. Uma nova mensagem será
                mostrada para você, clique no “Conectar Wallet”.
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
              <MetamaskThirdIMG
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                Você será redirecionado para o Collab.Land
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                No Collab.Land, clique em “MetaMask”.
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
              <VaultFourthIMG
                className="pw-mx-auto"
                width={isMobile ? 330 : 580}
                height={isMobile ? 221 : 392}
              />
              <p className="pw-text-base pw-font-medium pw-font-poppins pw-text-[#295BA6] pw-mt-6">
                Siga os passos da sua MetaMask
              </p>
              <p className="pw-text-sm pw-font-normal pw-font-poppins pw-text-[#777E8F] pw-mb-6">
                Após seguir os passos, espere sua MetaMask conectar.
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
            className="!pw-h-[33px]"
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
                  className="!pw-h-[33px] pw-w-[277px]"
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
      {hasWalletConnect
        ? renderDesincOption()
        : wallet?.type === WalletTypes.Metamask
        ? renderStepsMetamask()
        : renderStepsVault()}
    </ModalBase>
  );
};
