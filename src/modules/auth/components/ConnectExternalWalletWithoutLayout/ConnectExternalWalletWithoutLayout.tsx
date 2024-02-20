/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, lazy } from 'react';
import { useTranslation, Trans } from 'react-i18next';
// import { useQueryClient } from 'react-query';

import MetamaskLogo from '../../../shared/assets/icons/metamask.svg?react';
import { Alert } from '../../../shared/components/Alert';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
// import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useModalController } from '../../../shared/hooks/useModalController';
import { useNeedsMailConfirmationInterceptor } from '../../../shared/hooks/useNeedsMailConfirmationInterceptor';
import { usePixwayAPIURL } from '../../../shared/hooks/usePixwayAPIURL/usePixwayAPIURL';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import { useProfile } from '../../../shared/hooks/useProfile/useProfile';
import { useRouterConnect } from '../../../shared/hooks/useRouterConnect';
import { useSessionUser } from '../../../shared/hooks/useSessionUser';
import { useToken } from '../../../shared/hooks/useToken';
import { useWallets } from '../../../shared/hooks/useWallets/useWallets';
import { UseThemeConfig } from '../../../storefront/hooks/useThemeConfig/useThemeConfig';
import { WalletsOptions } from '../../../storefront/interfaces';
import { claimWalletVault } from '../../api/wallet';
import { AuthFooter } from '../AuthFooter';
const AuthButton = lazy(() =>
  import('../AuthButton').then((m) => ({ default: m.AuthButton }))
);

const MailVerifiedInterceptorProvider = lazy(() =>
  import('../../../core/providers/MailVerifiedInterceptorProvider').then(
    (m) => ({ default: m.MailVerifiedInterceptorProvider })
  )
);

const ConnectToMetamaskButton = lazy(() =>
  import('../ConnectWalletTemplate').then((m) => ({
    default: m.ConnectToMetamaskButton,
  }))
);

const GenerateTokenDialog = lazy(() =>
  import('../ConnectWalletTemplate/GenerateTokenDialog').then((m) => ({
    default: m.GenerateTokenDialog,
  }))
);

const Spinner = lazy(() =>
  import('../../../shared/components/Spinner').then((m) => ({
    default: m.Spinner,
  }))
);

const MetamaskAppErrorModal = lazy(() =>
  import('../MetamaskAppErrorModal').then((m) => ({
    default: m.MetamaskAppErrorModal,
  }))
);

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
  const { closeModal, isOpen, openModal } = useModalController();
  const {
    isOpen: isOpenAppError,
    closeModal: closeModalAppError,
    openModal: openModalAppError,
  } = useModalController();
  const [translate] = useTranslation();
  const [step, setStep] = useState<Step>(Step.CONFIRMATION);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { companyId } = useCompanyConfig();
  const token = useToken();
  const router = useRouterConnect();
  const { data: profile, refetch } = useProfile();
  const { status } = usePixwaySession();
  const user = useSessionUser();
  const mailInterceptor = useNeedsMailConfirmationInterceptor();
  const { defaultTheme } = UseThemeConfig();
  const postSigninURL =
    defaultTheme?.configurations?.contentData?.postSigninURL;
  const walletOption =
    defaultTheme?.configurations?.styleData?.onBoardingWalletsOptions;
  useEffect(() => {
    if (status === 'unauthenticated')
      router.pushConnect(PixwayAppRoutes.SIGN_IN);

    if (profile) {
      const { data: user } = profile;
      const { mainWalletId } = user;

      if (mainWalletId) {
        if (router?.query?.callbackPath) {
          router.pushConnect(router.query.callbackPath as string);
        } else if (router?.query?.callbackUrl) {
          router.pushConnect(router.query.callbackUrl as string);
        } else if (postSigninURL) {
          router.pushConnect(postSigninURL);
        } else if (redirectLink) {
          router.pushConnect(redirectLink);
        } else {
          router.pushConnect(redirectRoute);
        }
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

  const { w3blockIdAPIUrl } = usePixwayAPIURL();
  // const queryClient = useQueryClient();

  const conn = !companyId && !token;

  const { connectMetamask, claim, isConnected } = useWallets();

  const onClickConnectToMetamaskExtension = async () => {
    const agent = window.navigator.userAgent ?? '';
    if (
      !(globalThis.window as any)?.ethereum &&
      !agent.includes('MetaMaskMobile')
    ) {
      openModal();
      return;
    } else if (
      !(globalThis.window as any)?.ethereum &&
      agent.includes('MetaMaskMobile')
    ) {
      openModalAppError();
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
      if (!error?.message || error.message == '') {
        if (router?.query?.callbackPath) {
          router.pushConnect(router.query.callbackPath as string);
        } else if (router?.query?.callbackUrl) {
          router.pushConnect(router.query.callbackUrl as string);
        } else if (postSigninURL) {
          router.pushConnect(postSigninURL);
        } else if (redirectLink) {
          router.pushConnect(redirectLink);
        } else {
          router.pushConnect(redirectRoute);
        }
        return;
      }
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
    refetch().then(() => {
      setIsConnecting(false);
      if (router?.query?.callbackPath) {
        router.pushConnect(router.query.callbackPath as string);
      } else if (router?.query?.callbackUrl) {
        router.pushConnect(router.query.callbackUrl as string);
      } else if (postSigninURL) {
        router.pushConnect(postSigninURL);
      } else if (redirectLink) {
        router.pushConnect(redirectLink);
      } else {
        router.pushConnect(redirectRoute);
      }
    });

    //queryClient.invalidateQueries(PixwayAPIRoutes.GET_PROFILE);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onError = (errorMessage: any) => {
    console.error(errorMessage);
    setErrorMsg(errorMessage);
    setIsConnecting(false);
    setIsError(true);
  };

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
    <div>
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
          <GenerateTokenDialog isOpen={isOpen} onClose={closeModal} />
          <MetamaskAppErrorModal
            isOpen={isOpenAppError}
            closeModal={closeModalAppError}
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
