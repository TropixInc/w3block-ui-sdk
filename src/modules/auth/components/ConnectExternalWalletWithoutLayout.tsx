/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { Trans } from 'react-i18next';


import MetamaskLogo from '../../shared/assets/icons/metamask.svg';
import { Alert } from '../../shared/components/Alert';
import { Spinner } from '../../shared/components/Spinner';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { usePixwaySession } from '../../shared/hooks/usePixwaySession';
import { useProfile } from '../../shared/hooks/useProfile';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { useToken } from '../../shared/hooks/useToken';
import { WalletsOptions } from '../../storefront/interfaces/Theme';
import { AuthButton } from './AuthButton';
import { AuthFooter } from './AuthFooter';
import { ConnectToMetamaskButton } from './ConnectWalletTemplate';
import { GenerateTokenDialog } from './GenerateTokenDialog';
import { MetamaskAppErrorModal } from './MetamaskAppErrorModal';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { useNeedsMailConfirmationInterceptor } from '../../shared/hooks/useNeedsMailConfirmationInterceptor';
import { MailVerifiedInterceptorProvider } from '../../core/providers/MailVerifiedInterceptorProvider';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { useWalletConnection } from '../hooks/useWalletConnection';
import useTranslation from '../../shared/hooks/useTranslation';


enum Step {
  CONFIRMATION,
  CONNECT_TO_METAMASK,
}

interface ConnectExternalWalletWithoutLayoutProps {
  redirectRoute?: string;
  tenantName?: string;
  redirectLink?: string;
  forceVault?: boolean;
}

const _ConnectExternalWalletWithoutLayout = ({
  redirectRoute = PixwayAppRoutes.HOME,
  tenantName,
  redirectLink,
  forceVault = false,
}: ConnectExternalWalletWithoutLayoutProps) => {
  const [translate] = useTranslation();
  const [step, setStep] = useState<Step>(Step.CONFIRMATION);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { companyId } = useCompanyConfig();
  const token = useToken();
  const router = useRouterConnect();
  const { data: profile, refetch } = useProfile();
  const { status } = usePixwaySession();
  const mailInterceptor = useNeedsMailConfirmationInterceptor();
  const { defaultTheme } = useThemeConfig();
  const walletOption =
    defaultTheme?.configurations?.styleData?.onBoardingWalletsOptions;
  const { redirect } = useAuthRedirect({ redirectRoute, redirectLink });

  const onCreateWalletSuccessfully = () => {
    refetch().then(() => {
      redirect();
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onErrorHandler = (errorMessage: any) => {
    console.error(errorMessage);
    setErrorMsg(errorMessage);
    setIsError(true);
  };

  const {
    isConnecting,
    isConnected,
    connectToMetamaskExtension: walletConnectExtension,
    connectMetamaskWallet: walletClaimMetamask,
    createVaultWallet,
    generateTokenModal,
    appErrorModal,
  } = useWalletConnection({
    onSuccess: onCreateWalletSuccessfully,
    onError: onErrorHandler,
  });

  const conn = !companyId && !token;

  const onClickConnectToMetamaskExtension = () => {
    setStep(Step.CONNECT_TO_METAMASK);
    walletConnectExtension();
  };

  const onClickConnectMetamaskWallet = () => {
    setStep(Step.CONNECT_TO_METAMASK);
    walletClaimMetamask();
  };

  const onClickContinue = () => {
    createVaultWallet();
  };

  useEffect(() => {
    if (status === 'unauthenticated')
      router.pushConnect(PixwayAppRoutes.SIGN_IN);

    if (profile) {
      const { data: user } = profile;
      const { mainWalletId } = user;

      if (mainWalletId) {
        redirect();
      } else {
        if (
          forceVault ||
          (walletOption && walletOption == WalletsOptions.CUSTODY)
        ) {
          onClickContinue();
        }
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, status]);

  const errorThreat = useMemo(() => {
    if (errorMsg != '') {
      if (errorMsg.includes('already exists')) {
        return translate('connectWallet>error>AlreadyExistUserWithWallet');
      } else {
        return (
          translate(
            'companyAuth>externalWallet>errorConnectingExternalWallet'
          ) +
          ' ' +
          errorMsg
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMsg]);

  if (!companyId) {
    return <h1>{translate('companyAuth>externalWallet>CompanyNotFound')}</h1>;
  }

  if (
    isLoading ||
    forceVault ||
    (walletOption && walletOption == WalletsOptions.CUSTODY)
  ) {
    return (
      <div className="pw-flex pw-justify-center pw-items-center pw-py-10">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="pw-text-black">
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
                {errorThreat}
              </Alert>
              {defaultTheme?.configurations.styleData
                .onBoardingWalletsOptions == WalletsOptions.METAMASK ? null : (
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
              )}
            </>
          ) : null}
          <AuthFooter className="pw-mt-9" />
        </div>
      ) : (
        <div className="pw-flex pw-flex-col pw-gap-8 pw-mt-6">
          <>
            <h2 className="pw-font-semibold pw-text-xl pw-leading-5 pw-text-center">
              {translate('signUp>connectWallet>connectOrCreate')}
            </h2>
            <p className="pw-font-inter pw-leading-[19px] pw-text-center">
              {translate('signUp>connectWallet>createWallet', {
                name: tenantName,
              })}
            </p>
            <p className="pw-font-inter pw-leading-[19px] pw-text-center">
              {translate('signUp>connectWallet>createText', {
                name: tenantName,
              })}
            </p>
          </>
          {defaultTheme?.configurations.styleData.onBoardingWalletsOptions ==
          WalletsOptions.METAMASK ? null : (
            <div className="pw-mx-auto">
              <AuthButton
                onClick={() => mailInterceptor(onClickContinue)}
                disabled={isConnecting}
                className="!pw-w-[211px]"
              >
                {translate('signUp>connectWallet>connectButton')}
              </AuthButton>
            </div>
          )}
          <h2 className="pw-font-semibold pw-text-xl pw-leading-5 pw-text-center">
            {translate('signUp>connectWallet>connectExternal')}
          </h2>
          <div className="pw-mx-auto">
            <AuthButton
              disabled={isConnecting}
              onClick={
                isConnected
                  ? () => mailInterceptor(onClickConnectMetamaskWallet)
                  : () => mailInterceptor(onClickConnectToMetamaskExtension)
              }
              className="!pw-w-[211px] !pw-bg-white pw-flex pw-justify-center pw-items-center pw-gap-x-2.5 !pw-text-black"
            >
              <MetamaskLogo
                width={18.35}
                height={17}
                className="bg-transparent"
              />
              {translate('companyAuth>signUp>connectToMetamask')}
            </AuthButton>
          </div>
          <GenerateTokenDialog isOpen={generateTokenModal.isOpen} onClose={generateTokenModal.close} />
          <MetamaskAppErrorModal
            isOpen={appErrorModal.isOpen}
            closeModal={appErrorModal.close}
          />
        </div>
      )}
    </div>
  );
};

export const ConnectExternalWalletWithoutLayout = ({
  redirectRoute = PixwayAppRoutes.HOME,
  redirectLink,
  tenantName,
  forceVault,
}: ConnectExternalWalletWithoutLayoutProps) => {
  return (
    <TranslatableComponent>
      <MailVerifiedInterceptorProvider code={true}>
        <_ConnectExternalWalletWithoutLayout
          forceVault={forceVault}
          redirectRoute={redirectRoute}
          tenantName={tenantName}
          redirectLink={redirectLink}
        />
      </MailVerifiedInterceptorProvider>
    </TranslatableComponent>
  );
};
