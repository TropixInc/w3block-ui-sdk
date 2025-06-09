import { useEffect, useState } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { useLocalStorage } from 'react-use';

import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

import ExternalLinkIcon from '../../shared/assets/icons/externalLink.svg';
import { useQueryClient } from '@tanstack/react-query';
import { Alert } from '../../modules/shared/components/Alert';
import { TextField } from '../../modules/shared/components/Form/TextField';
import { ImageSDK } from '../../modules/shared/components/ImageSDK';
import { Spinner } from '../../modules/shared/components/Spinner';
import { LocalStorageFields } from '../../modules/shared/enums/LocalStorageFields';
import { PixwayAPIRoutes } from '../../modules/shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../modules/shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../modules/shared/hooks/useCompanyConfig';
import { useTimedBoolean } from '../../modules/shared/hooks/useTimedBoolean';
import { GetLastTransferAPIResponse, useGetTransferToken } from '../hooks/useGetTransferToken';
import { useChainScanLink } from '../../modules/shared/hooks/useChainScanLink';
import useTransferToken from '../hooks/useTransferToken';
import useTransferTokenWithEmail from '../hooks/useTransferTokenWithEmail';
import { TokenTransferProcessModal } from './TokenTransferProcessModal';
import { PoliciesAgreementStepModal } from '../../modules/shared/components/PoliciesAgreementStepModal';
import { ProcessingStepModal } from './ProcessingStepModal';
import { GasModalHeader } from '../../modules/shared/components/GasModalHeader';


interface Tokens {
  id: string;
  number: string;
  editionId: string;
}
interface Props {
  tokens: Array<Tokens>;
  imageSrc: string;
  collectionName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Form {
  wallet: string;
}

interface TransferredItemProps {
  editionNumber?: string;
  type?: 'single' | 'multiple';
  wallet?: string;
  status?: string;
  chainId?: number;
  hash?: string;
}

interface ContentProcessProps {
  startProcess: boolean;
  wallet: string;
  tokenList?: GetLastTransferAPIResponse;
  isSuccess: boolean;
}

interface SuccessMessageProps {
  wallet?: string;
}

const SuccessMessage = ({ wallet }: SuccessMessageProps) => {
  return (
    <p className="pw-text-sm pw-leading-4 pw-text-black pw-mb-6 pw-text-center">
      <Trans
        i18nKey="tokens>tokenTransferController>tokenTransferredTo"
        values={{ wallet }}
      >
        Sua operação foi realizada com sucesso!
        <span className="pw-block">
          O token foi transferido para a carteira:
        </span>
        <span className="pw-block">carteira</span>
      </Trans>
    </p>
  );
};

const ContentProcess = ({
  startProcess,
  wallet,
  tokenList,
  isSuccess,
}: ContentProcessProps) => {
  const [showSpinner, setShowSpinner] = useTimedBoolean(3000);

  useEffect(() => {
    if (startProcess) {
      setShowSpinner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startProcess]);

  return (
    <>
      {showSpinner && (
        <Spinner className="!pw-border-t-[#5682C3] !pw-border-[#D1D1D1] pw-mx-auto pw-mb-6" />
      )}

      <div className="pw-flex pw-items-center pw-flex-wrap pw-justify-start pw-gap-x-[21px]">
        <TransferredItem
          type="single"
          wallet={wallet}
          status={tokenList?.status}
          chainId={tokenList?.chainId}
          hash={tokenList?.txHash}
        />
      </div>

      {isSuccess && <SuccessMessage wallet={wallet} />}
    </>
  );
};

const TransferredItem = ({
  editionNumber,
  type,
  wallet,
  status,
  chainId,
  hash,
}: TransferredItemProps) => {
  const [translate] = useTranslation();
  const chainScanLink = useChainScanLink(chainId, hash);

  return (
    <>
      {type === 'single' ? (
        <>
          {status === 'success' ? (
            <>
              <SuccessMessage wallet={wallet} />

              <p className="pw-text-sm pw-leading-4 pw-text-black pw-mb-6 pw-text-center">
                <Trans i18nKey="tokens>processingStepModal>toViewClickHere">
                  Para visualizar a operação na blockchain
                  <a
                    href={chainScanLink}
                    target="_blank"
                    rel="noreferrer"
                    className="pw-text-[#5682C3] pw-underline"
                  >
                    clique aqui.
                  </a>
                </Trans>
              </p>
            </>
          ) : (
            <Spinner className="!pw-border-t-[#5682C3] !pw-border-[#D1D1D1] pw-mx-auto pw-mb-6" />
          )}
        </>
      ) : (
        <div className="pw-flex pw-items-center pw-gap-x-[10px] pw-mb-[14px]">
          <span className="pw-text-[#202528] pw-text-xs pw-leading-[12px] pw-font-semibold">
            {translate('tokens>tokenTransferController>edition')}{' '}
            {editionNumber}
          </span>
          {status === 'success' ? (
            <a href={chainScanLink} target="_blank" rel="noreferrer">
              <ExternalLinkIcon className="pw-stroke-[#5682C3] pw-w-[17px] pw-h-[17px]" />
            </a>
          ) : (
            <Spinner className="!pw-border-t-[#5682C3] !pw-border-[#D1D1D1]  !pw-border-[2px] !pw-w-[17px] !pw-h-[17px]" />
          )}
        </div>
      )}
    </>
  );
};

enum Steps {
  TOKEN_TRANSFER_PROCESS_MODAL = 'TokenTransferProcessModal',
  POLICIES_AGREEMENT_STEP_MODAL = 'PoliciesAgreementStepModal',
  PROCESSING_STEP_MODAL = 'ProcessingStepModal',
}

const stepOrder = [
  Steps.TOKEN_TRANSFER_PROCESS_MODAL,
  Steps.POLICIES_AGREEMENT_STEP_MODAL,
  Steps.PROCESSING_STEP_MODAL,
];

export const TokenTransferController = ({
  tokens,
  collectionName,
  imageSrc,
  isOpen,
  onClose,
}: Props) => {
  const [translate] = useTranslation();
  const [isShowingErrorMessage, setShowErrorMessage] = useState(false);
  const [
    dontShowTokenTransferProcessModal,
    setDontShowTokenTransferProcessModal,
  ] = useLocalStorage<boolean>(
    LocalStorageFields.DONT_SHOW_TOKEN_TRANSFER_PROCESS_MODAL
  );

  const [currentStep, setCurrentStep] = useState<Steps | null>(null);
  const {
    mutate: transferToken,
    isError: isErrorTransferToken,
    isSuccess: isSuccessTransferToken,
  } = useTransferToken();
  const {
    mutate: transferTokenEmail,
    isError: isErrorTransferTokenEmail,
    isSuccess: isSuccessTransferTokenEmail,
  } = useTransferTokenWithEmail();

  const { data: successfulTransfers } = useGetTransferToken(
    tokens[0].editionId,
    currentStep === Steps.PROCESSING_STEP_MODAL &&
      (isSuccessTransferToken || isSuccessTransferTokenEmail)
  );

  useEffect(() => {
    if (isErrorTransferToken || isErrorTransferTokenEmail) {
      setShowErrorMessage(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorTransferToken, isErrorTransferTokenEmail]);

  const handleClose = () => {
    setShowErrorMessage(false);
    onClose();
  };

  const nextStep = () => {
    if (currentStep === null) {
      setCurrentStep(
        !dontShowTokenTransferProcessModal ? stepOrder[0] : stepOrder[1]
      );
    } else {
      setCurrentStep(stepOrder[stepOrder.indexOf(currentStep) + 1]);
    }
  };

  const client = useQueryClient();

  const resetState = () => {
    client.invalidateQueries(PixwayAPIRoutes.TOKEN_EDITIONS as any);
    setCurrentStep(null);
  };

  useEffect(() => {
    if (isOpen) {
      nextStep();
    } else {
      resetState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const schema = object().shape({
    wallet: string()
      .matches(
        /^(0x)[0-9a-f]{40}$|^[\w-.+]+@([\w-]+\.)+[\w-]{2,4}$/,
        translate('tokens>tokenTransferController>incorrectWallet')
      )
      .required(translate('components>form>requiredFieldValidation')),
  });

  const methods = useForm<Form>({
    defaultValues: {
      wallet: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { fieldState: walletFieldState, field: toAddress } = useController({
    control: methods.control,
    name: 'wallet',
  });

  const { connectProxyPass } = useCompanyConfig();
  const handleConfirmTokenTransferProcessModal = (dontShowAgain: boolean) => {
    setDontShowTokenTransferProcessModal(dontShowAgain);
    nextStep();
  };

  const handleConfirmPoliciesAgreementStep = () => {
    const emailRegex = /^[\w-.+]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(toAddress.value)) {
      transferTokenEmail({
        email: toAddress.value,
        editionId: tokens[0].editionId,
      });
    } else {
      transferToken({
        toAddress: toAddress.value,
        editionId: tokens[0].editionId,
      });
    }
    nextStep();
  };

  const subTitle = `${translate('tokens>tokenTransferController>edition')} ${
    tokens[0].number
  }`;

  return (
    <>
      {isOpen ? (
        <>
          {currentStep === Steps.TOKEN_TRANSFER_PROCESS_MODAL ? (
            <TokenTransferProcessModal
              isOpen={currentStep === Steps.TOKEN_TRANSFER_PROCESS_MODAL}
              onClose={handleClose}
              onConfirm={handleConfirmTokenTransferProcessModal}
              tokens={tokens}
              collectionName={collectionName}
            />
          ) : null}

          {currentStep === Steps.POLICIES_AGREEMENT_STEP_MODAL ? (
            <PoliciesAgreementStepModal
              isOpen={currentStep === Steps.POLICIES_AGREEMENT_STEP_MODAL}
              cancelButtonLabel={translate(
                'tokens>tokenTransferController>cancel'
              )}
              confirmButtonLabel={translate(
                'tokens>tokenTransferController>transfer'
              )}
              subtitle={translate(
                'tokens>tokenTransferController>enterTheWalletAddress'
              )}
              title={translate('tokens>tokenTransferController>tokenTransfer')}
              userAgreementLabel={translate(
                'tokens>tokenTransferController>iAgreeTokenTransferProcess'
              )}
              buttonDisabled={!methods.formState.isValid}
              onConfirm={handleConfirmPoliciesAgreementStep}
              onCancel={handleClose}
              onClose={handleClose}
            >
              <FormProvider {...methods}>
                <TextField
                  name="wallet"
                  type="text"
                  className={`!pw-outline-[1px] !pw-text-[#333333] !pw-h-[48px] !pw-text-base !pw-leading-[19px] !pw-bg-transparent pw-mb-[25px] ${
                    walletFieldState.error?.message
                      ? '!pw-outline-[#FF0505]'
                      : '!pw-outline-[#94B8ED]'
                  }`}
                  classes={{
                    input: '!pw-p-[14px_24px_15px_24px]',
                  }}
                />
                {walletFieldState.error?.message && (
                  <span className="pw-block pw-text-[#FF0505] pw-text-xs pw-mb-[25px] !pw-mt-[-15px]">
                    {walletFieldState.error?.message}
                  </span>
                )}
              </FormProvider>
            </PoliciesAgreementStepModal>
          ) : null}

          {currentStep === Steps.PROCESSING_STEP_MODAL ? (
            <ProcessingStepModal
              isOpen={currentStep === Steps.PROCESSING_STEP_MODAL}
              subTitle={translate('tokens>processingStepModal>notLongToGo')}
              linkHref={connectProxyPass + PixwayAppRoutes.TOKENS}
              linkText={translate(
                'tokens>tokenTransferController>goToMyTokens'
              )}
              onClose={handleClose}
              isSuccess={successfulTransfers?.data?.status === 'success'}
              error={isShowingErrorMessage}
            >
              <GasModalHeader
                imageBox={
                  <ImageSDK
                    src={imageSrc}
                    height={50}
                    width={50}
                    alt={collectionName}
                    className="pw-rounded-[14px] pw-shrink-0 pw-object-cover"
                  />
                }
                title={collectionName}
                subTitle={subTitle}
                gasPrice={0}
                classes={{ box: 'pw-my-6' }}
              />
              {isShowingErrorMessage ? (
                <Alert
                  variant="error"
                  className="pw-flex pw-justify-center pw-max-w-[400px] pw-mx-auto !pw-p-[22px]"
                >
                  <Alert.Icon className="pw-mr-2 !pw-w-[10px] !pw-h-[10px]" />
                  {translate('tokens>tokenTransferController>error')}
                </Alert>
              ) : (
                successfulTransfers?.data && (
                  <ContentProcess
                    startProcess={currentStep === Steps.PROCESSING_STEP_MODAL}
                    wallet={toAddress.value}
                    tokenList={successfulTransfers?.data}
                    isSuccess={successfulTransfers?.data?.status === 'success'}
                  />
                )
              )}
            </ProcessingStepModal>
          ) : null}
        </>
      ) : null}
    </>
  );
};
