/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { Provider } from '@w3block/pixchain-react-metamask';

import { MailVerifiedInterceptorProvider } from '../../../core/providers/MailVerifiedInterceptorProvider';
import { useProfile } from '../../../shared';
import { Alert } from '../../../shared/components/Alert';
import { Spinner } from '../../../shared/components/Spinner';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useModalController } from '../../../shared/hooks/useModalController';
import { useNeedsMailConfirmationInterceptor } from '../../../shared/hooks/useNeedsMailConfirmationInterceptor';
import { usePixwayAPIURL } from '../../../shared/hooks/usePixwayAPIURL/usePixwayAPIURL';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import useRouter from '../../../shared/hooks/useRouter';
import { useSessionUser } from '../../../shared/hooks/useSessionUser';
import { useToken } from '../../../shared/hooks/useToken';
import { useUserWallet } from '../../../shared/hooks/useUserWallet';
import { claimWalletVault } from '../../api/wallet';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { ConnectToMetamaskButton } from '../ConnectWalletTemplate';
import { GenerateTokenDialog } from '../ConnectWalletTemplate/GenerateTokenDialog';

enum Step {
  CONFIRMATION,
  CONNECT_TO_METAMASK,
}

interface ConnectExternalWalletWithoutLayoutProps {
  redirectRoute?: string;
}

const _ConnectExternalWalletWithoutLayout = ({
  redirectRoute = PixwayAppRoutes.HOME,
}: ConnectExternalWalletWithoutLayoutProps) => {
  const { closeModal, isOpen, openModal } = useModalController();
  const [translate] = useTranslation();
  const [step, setStep] = useState<Step>(Step.CONFIRMATION);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { companyId } = useCompanyConfig();
  const token = useToken();
  const router = useRouter();
  const { data: profile } = useProfile();
  const { status } = usePixwaySession();
  const user = useSessionUser();
  const mailInterceptor = useNeedsMailConfirmationInterceptor();

  useEffect(() => {
    if (status === 'unauthenticated') router.push(PixwayAppRoutes.SIGN_IN);

    if (profile) {
      const { data: user } = profile;
      const { wallets } = user;

      if (wallets?.length) {
        router.push(redirectRoute);
      } else {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, status]);

  const { w3blockIdAPIUrl } = usePixwayAPIURL();
  const queryClient = useQueryClient();

  const conn = !companyId && !token;

  const { connect, claim, connected } = useUserWallet();

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
    router.push(redirectRoute);
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
    return (
      <div className="pw-flex pw-justify-center pw-items-center pw-py-10">
        <Spinner />
      </div>
    );
  }
  return (
    <div>
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
            <p className="pw-font-inter pw-leading-[19px]">
              {translate('companyAuth>signUp>connectExternalWallet')}
            </p>
            <h2 className="pw-font-semibold pw-text-xl pw-leading-5 pw-text-center">
              {translate('companyAuth>signUp>doYouAlreadyHaveAnExternalWallet')}
            </h2>
            <ConnectToMetamaskButton
              onClick={
                connected
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
    </div>
  );
};

const MetamaskProvider = Provider as any;
export const ConnectExternalWalletWithoutLayout = ({
  redirectRoute = PixwayAppRoutes.HOME,
}: ConnectExternalWalletWithoutLayoutProps) => {
  return (
    <TranslatableComponent>
      <MetamaskProvider
        dappConfig={{
          autoConnect: true,
        }}
      >
        <MailVerifiedInterceptorProvider>
          <_ConnectExternalWalletWithoutLayout redirectRoute={redirectRoute} />
        </MailVerifiedInterceptorProvider>
      </MetamaskProvider>
    </TranslatableComponent>
  );
};
