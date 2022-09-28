import { useContext, useState } from 'react';
import { Trans } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { ConnectToMetamaskButton } from '../../../auth';
import { claimWalletVault } from '../../../auth/api/wallet';
import { AuthButton } from '../../../auth/components/AuthButton';
import { AuthFooter } from '../../../auth/components/AuthFooter';
import { GenerateTokenDialog } from '../../../auth/components/ConnectWalletTemplate/GenerateTokenDialog';
import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { useCompanyConfig } from '../../hooks/useCompanyConfig';
import { useModalController } from '../../hooks/useModalController';
import { usePixwayAPIURL } from '../../hooks/usePixwayAPIURL/usePixwayAPIURL';
import { useSessionUser } from '../../hooks/useSessionUser';
import { useToken } from '../../hooks/useToken';
import useTranslation from '../../hooks/useTranslation';
import { useUserWallet } from '../../hooks/useUserWallet';
import { AttachWalletContext } from '../../providers/AttachWalletProvider/AttachWalletProvider';
import { Alert } from '../Alert';
import { ModalBase } from '../ModalBase';
import { Spinner } from '../Spinner';

enum Step {
  CONFIRMATION,
  CONNECT_TO_METAMASK,
}

export const AttachWalletModal = () => {
  const { closeModal, isOpen, openModal } = useModalController();
  const { attachModal, setAttachModal } = useContext(AttachWalletContext);
  const [step, setStep] = useState<Step>(Step.CONFIRMATION);
  const [translate] = useTranslation();
  const { connect, claim, connected } = useUserWallet();
  const { w3blockIdAPIUrl } = usePixwayAPIURL();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isError, setIsError] = useState(false);
  const { companyId } = useCompanyConfig();
  const token = useToken();

  const user = useSessionUser();
  const conn = !companyId && !token;
  const queryClient = useQueryClient();

  const onClickConnectToMetamaskExtension = async () => {
    if (!(globalThis.window as any)?.ethereum) {
      openModal();
      return;
    }

    setStep(Step.CONNECT_TO_METAMASK);
    setIsConnecting(true);

    try {
      await connect();
      setIsConnecting(false);
    } catch (error: any) {
      console.error(error);
      onError(error.message);
    }
  };

  const onClickConnectMetamaskWallet = async () => {
    setStep(Step.CONNECT_TO_METAMASK);
    setIsConnecting(true);

    try {
      await claim();
      onCreateWalletSuccessfully();
    } catch (error: any) {
      console.error(error);
      onError(error.message);
    }
  };

  const onClickContinue = async () => {
    setIsConnecting(true);

    try {
      await claimWalletVault(
        token,
        companyId,
        w3blockIdAPIUrl,
        user?.refreshToken ?? ''
      );
      onCreateWalletSuccessfully();
    } catch (error: any) {
      console.error(error);
      onError(error.message);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onCreateWalletSuccessfully = () => {
    setIsConnecting(false);
    queryClient.invalidateQueries(PixwayAPIRoutes.GET_PROFILE);
    setAttachModal(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onError = (errorMessage: string) => {
    console.error(errorMessage);
    setIsConnecting(false);
    setIsError(true);
  };

  if (!companyId) {
    return <h1>{translate('companyAuth>externalWallet>CompanyNotFound')}</h1>;
  }

  return (
    <ModalBase
      classes={{ classComplement: ' !pw-pr-8' }}
      onClose={() => setAttachModal(false)}
      isOpen={attachModal}
    >
      {step === Step.CONNECT_TO_METAMASK ? (
        <div className="pw-mt-6">
          <ConnectToMetamaskButton
            onClick={
              connected
                ? onClickConnectMetamaskWallet
                : onClickConnectToMetamaskExtension
            }
            disabled={isConnecting || conn}
          />
          {isConnecting ? (
            <div className="pw-flex pw-justify-center pw-mt-9">
              <Spinner />
            </div>
          ) : null}
          {isError ? (
            <>
              <Alert
                variant="error"
                scrollToOnMount
                className="pw-flex pw-justify-start pw-gap-x-2 pw-items-center pw-mt-9 !pw-py-2.5 !pw-pl-[19px] !pw-pr-[34px]"
              >
                <Alert.Icon />
                {translate(
                  'companyAuth>externalWallet>errorConnectingExternalWallet'
                )}
              </Alert>
              <p className="pw-font-semibold pw-leading-[18px] pw-text-center pw-mt-1">
                <Trans i18nKey="companyAuth>externalWallet>orContinueWithInternalWallet">
                  ou
                  <button
                    onClick={onClickContinue}
                    className="pw-underline hover:pw-text-[#5682C3] pw-block pw-mt-1 pw-mx-auto"
                  >
                    {translate(
                      'companyAuth>accountCreatedTemplate>continueInternalWallet'
                    )}
                  </button>
                </Trans>
              </p>
            </>
          ) : null}
          <AuthFooter className="pw-mt-9" />
        </div>
      ) : (
        <div className="pw-flex pw-flex-col pw-gap-8 pw-mt-6">
          <>
            <h2 className="pw-font-semibold pw-text-xl pw-leading-5 pw-text-center">
              {translate('companyAuth>signUp>doYouAlreadyHaveAnExternalWallet')}
            </h2>
            <ConnectToMetamaskButton
              onClick={
                connected
                  ? onClickConnectMetamaskWallet
                  : onClickConnectToMetamaskExtension
              }
              disabled={isConnecting}
            />
            <p className="pw-font-inter pw-leading-[19px] pw-text-center">
              {translate('companyAuth>signUp>continueWithInternalWallet')}
            </p>
            <h2 className="pw-font-semibold pw-text-xl pw-leading-5 pw-text-center">
              {translate('companyAuth>signUp>iDontHaveAExternalWallet')}
            </h2>
          </>

          <AuthButton
            onClick={onClickContinue}
            fullWidth
            disabled={isConnecting}
          >
            {translate('components>advanceButton>continue')}
          </AuthButton>
          <AuthFooter />
          <GenerateTokenDialog isOpen={isOpen} onClose={closeModal} />
        </div>
      )}
    </ModalBase>
  );
};
