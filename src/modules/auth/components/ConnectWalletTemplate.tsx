/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import MetamaskLogo from '../../shared/assets/icons/metamask.svg';
import { useQueryClient } from '@tanstack/react-query';
import { Alert } from '../../shared/components/Alert';
import { Spinner } from '../../shared/components/Spinner';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { PixwayAPIRoutes } from '../../shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePixwayAPIURL } from '../../shared/hooks/usePixwayAPIURL';
import { usePixwaySession } from '../../shared/hooks/usePixwaySession';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useSessionUser } from '../../shared/hooks/useSessionUser';
import { useToken } from '../../shared/hooks/useToken';
import { claimWalletVault } from '../api/wallet';
import { AuthButton } from './AuthButton';
import { AuthFooter } from './AuthFooter';
import { AuthLayoutBase } from './AuthLayoutBase';
import { GenerateTokenDialog } from './GenerateTokenDialog';
import { MailVerifiedInterceptorProvider } from '../../core/providers/MailVerifiedInterceptorProvider';
import { useModalController } from '../../shared/hooks/useModalController';
import { useNeedsMailConfirmationInterceptor } from '../../shared/hooks/useNeedsMailConfirmationInterceptor';
import { useWallets } from '../../shared/hooks/useWallets';



interface MetamaskButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

enum Step {
  CONFIRMATION,
  CONNECT_TO_METAMASK,
}

interface ConnectWalletProps {
  redirectLink?: string;
}

export const ConnectToMetamaskButton = ({
  onClick,
  disabled = false,
}: MetamaskButtonProps) => {
  const [translate] = useTranslation();
  return (
    <AuthButton
      disabled={disabled}
      onClick={onClick}
      className="!pw-font-roboto pw-w-full pw-flex pw-justify-center pw-items-center pw-gap-x-2.5 !pw-font-normal !pw-text-[15px] !pw-text-black !pw-leading-[18px] !pw-rounded-[7px] !pw-bg-white pw-shadow-[0px_0px_10px_rgba(255,255,255,0.3)] !pw-p-4"
    >
      <MetamaskLogo width={18.35} height={17} className="bg-transparent" />
      {translate('companyAuth>signUp>connectToMetamask')}
    </AuthButton>
  );
};

const _ConnectWalletTemplate = ({
  redirectLink = PixwayAppRoutes.HOME,
}: ConnectWalletProps) => {
  const { closeModal, isOpen, openModal } = useModalController();
  const [translate] = useTranslation();
  const [redirect, setRedirect] = useState(false);
  const [step, setStep] = useState<Step>(Step.CONFIRMATION);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { companyId } = useCompanyConfig();
  const token = useToken();
  const router = useRouterConnect();
  const profile = useProfile();
  const sessionUser = usePixwaySession();
  const user = useSessionUser();
  const mailInterceptor = useNeedsMailConfirmationInterceptor();

  useEffect(() => {
    const { data } = profile;

    if (sessionUser.status === 'unauthenticated')
      router.pushConnect(PixwayAppRoutes.SIGN_IN);

    if (data) {
      const { data: user } = data;
      const { wallets } = user;

      if (wallets?.length) {
        router.push(redirect ? redirectLink : PixwayAppRoutes.HOME);
      } else {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, router, sessionUser]);

  const { w3blockIdAPIUrl } = usePixwayAPIURL();
  const queryClient = useQueryClient();

  const conn = !companyId && !token;

  const { connectMetamask, claim, isConnected } = useWallets();

  const onClickConnectToMetamaskExtension = async () => {
    if (!(globalThis.window as any)?.ethereum) {
      openModal();
      return;
    }

    setStep(Step.CONNECT_TO_METAMASK);
    setIsConnecting(true);

    try {
      await connectMetamask?.();
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
      await claim?.();
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
    setRedirect(true);
    queryClient.invalidateQueries(PixwayAPIRoutes.GET_PROFILE as any);
    router.push(redirectLink, redirectLink);
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

  if (isLoading) {
    return <></>;
  }

  return (
    <AuthLayoutBase
      title={translate(
        step === Step.CONNECT_TO_METAMASK
          ? 'companyAuth>externalWallet>connectExternalWallet'
          : 'companyAuth>signUp>accountCreated'
      )}
      logo=""
    >
      {step === Step.CONNECT_TO_METAMASK ? (
        <div className="pw-mt-6">
          <ConnectToMetamaskButton
            onClick={
              isConnected
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
            <p className="pw-font-inter pw-leading-[19px]">
              {translate('companyAuth>signUp>connectExternalWallet')}
            </p>
            <h2 className="pw-font-semibold pw-text-xl pw-leading-5 pw-text-center">
              {translate('companyAuth>signUp>doYouAlreadyHaveAnExternalWallet')}
            </h2>
            <ConnectToMetamaskButton
              onClick={
                isConnected
                  ? () => mailInterceptor(onClickConnectMetamaskWallet)
                  : () => mailInterceptor(onClickConnectToMetamaskExtension)
              }
              disabled={isConnecting}
            />
            <p className="pw-font-inter pw-leading-[19px]">
              {translate('companyAuth>signUp>continueWithInternalWallet')}
            </p>
            <h2 className="pw-font-semibold pw-text-xl pw-leading-5 pw-text-center">
              {translate('companyAuth>signUp>iDontHaveAExternalWallet')}
            </h2>
          </>

          <AuthButton
            onClick={() => mailInterceptor(onClickContinue)}
            fullWidth
            disabled={isConnecting}
          >
            {translate('components>advanceButton>continue')}
          </AuthButton>
          <AuthFooter />
          <GenerateTokenDialog isOpen={isOpen} onClose={closeModal} />
        </div>
      )}
    </AuthLayoutBase>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ConnectWalletTemplate = ({ redirectLink }: ConnectWalletProps) => (
  <TranslatableComponent>
    <MailVerifiedInterceptorProvider>
      <_ConnectWalletTemplate redirectLink={redirectLink} />
    </MailVerifiedInterceptorProvider>
  </TranslatableComponent>
);
