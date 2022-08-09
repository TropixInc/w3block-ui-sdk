import { useState } from 'react';
import { Trans } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { ReactComponent as MetamaskLogo } from '../../../../../shared/assets/images/metamaskLogo.svg';
import { Alert } from '../../../shared/components/Alert';
import DialogBase from '../../../shared/components/DialogBase/DialogBase';
import { useModalController } from '../../../shared/hooks/useModalController';
import useRouter from '../../../shared/hooks/useRouter';
import { useToken } from '../../../shared/hooks/useToken';
import useTranslation from '../../../shared/hooks/useTranslation';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { AuthLayoutBase } from '../AuthLayoutBase';

interface MetamaskButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

enum Step {
  CONFIRMATION,
  CONNECT_TO_METAMASK,
}

const ConnectToMetamaskButton = ({
  onClick,
  disabled = false,
}: MetamaskButtonProps) => {
  const [translate] = useTranslation();
  return (
    <AuthButton
      disabled={disabled}
      onClick={onClick}
      className="!font-roboto w-full flex justify-center items-center gap-x-2.5 !font-normal !text-[15px] !text-black !leading-[18px] !rounded-[7px] !bg-white shadow-[0px_0px_10px_rgba(255,255,255,0.3)] !p-4"
    >
      <MetamaskLogo width={18.35} height={17} className="bg-transparent" />
      {translate('companyAuth>signUp>connectToMetamask')}
    </AuthButton>
  );
};

export const ConnectWalletTemplate = () => {
  const { closeModal, isOpen, openModal } = useModalController();
  const router = useRouter();
  const [translate] = useTranslation();
  const [step, setStep] = useState<Step>(Step.CONFIRMATION);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isError, setIsError] = useState(false);
  const companyId = useCompanyId();
  const token = useToken();
  const { connect, claim, connected } = useUserWallet({
    companyId: companyId || '',
    apiToken: token,
  });
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
    } catch (error) {
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
    } catch (error) {
      console.error(error);
      onError(error.message);
    }
  };

  const onClickContinue = async () => {
    setIsConnecting(true);

    try {
      await claimWalletVault(token, companyId ?? '');
      onCreateWalletSuccessfully();
    } catch (error) {
      console.error(error);
      onError(error.message);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onCreateWalletSuccessfully = () => {
    setIsConnecting(false);
    queryClient.invalidateQueries(ApiRoutes.GET_PROFILE);
    router.push(ConnectRoutes.TOKENS);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onError = (errorMessage: string) => {
    console.error(errorMessage);
    setIsConnecting(false);
    setIsError(true);
  };

  if (!companyId) {
    return <h1>Company not found</h1>;
  }

  return (
    <AuthLayoutBase
      title={translate('companyAuth>externalWallet>connectExternalWallet')}
      logo=""
    >
      {step === Step.CONNECT_TO_METAMASK ? (
        <div className="mt-6">
          <h1 className="font-semibold text-3xl leading-[30px] text-center mb-9">
            {translate('companyAuth>externalWallet>connectExternalWallet')}
          </h1>
          <ConnectToMetamaskButton
            onClick={
              connected
                ? onClickConnectMetamaskWallet
                : onClickConnectToMetamaskExtension
            }
            disabled={isConnecting}
          />
          {isConnecting ? (
            <div className="flex justify-center mt-9">
              <Spinner />
            </div>
          ) : null}
          {isError ? (
            <>
              <Alert
                variant="error"
                scrollToOnMount
                className="flex justify-start gap-x-2 items-center mt-9 !py-2.5 !pl-[19px] !pr-[34px]"
              >
                <Alert.Icon />
                {translate(
                  'companyAuth>externalWallet>errorConnectingExternalWallet'
                )}
              </Alert>
              <p className="font-semibold leading-[18px] text-center mt-1">
                <Trans i18nKey="companyAuth>externalWallet>orContinueWithInternalWallet">
                  ou
                  <button
                    onClick={onClickContinue}
                    className="underline hover:text-[#5682C3] block mt-1 mx-auto"
                  >
                    {translate(
                      'companyAuth>accountCreatedTemplate>continueInternalWallet'
                    )}
                  </button>
                </Trans>
              </p>
            </>
          ) : null}
          <AuthFooter className="mt-9" />
        </div>
      ) : (
        <div className="flex flex-col gap-y-8 mt-6">
          <h1 className="font-semibold text-3xl leading-[30px] text-center">
            {translate('companyAuth>signUp>accountCreated')}
          </h1>
          <>
            <p className="font-inter leading-[19px]">
              {translate('companyAuth>signUp>connectExternalWallet')}
            </p>
            <h2 className="font-semibold text-xl leading-5 text-center">
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
            <p className="font-inter leading-[19px]">
              {translate('companyAuth>signUp>continueWithInternalWallet')}
            </p>
            <h2 className="font-semibold text-xl leading-5 text-center">
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
    </AuthLayoutBase>
  );
};

// TODO move this component to a separate file
const GenerateTokenDialog = ({
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
    const target = `${hostname ?? ''}${AppRoutes.SIGN_IN}`;
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
        dialogCard: '!px-[98px] !max-w-[653px]',
        actionContainer: '!gap-x-15',
        confirmButton: '!py-3 !w-full !max-w-[200px]',
        cancelButton: '!py-3 !w-full !max-w-[200px]',
      }}
    >
      <p className="font-semibold text-xl leading-[23px] text-black mb-[53px]">
        ##METAMASK_NOT_FOUND## ##USE_METAMASK_APP_OR_EXTENSION_TO_CONTINUE_##
      </p>
    </DialogBase>
  );
};
