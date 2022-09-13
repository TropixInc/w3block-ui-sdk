import { useEffect, useState } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useLocalStorage } from 'react-use';

import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { object, string } from 'yup';

import { ReactComponent as ExternalLinkIcon } from '../../../shared/assets/icons/externalLink.svg';
import { Alert } from '../../../shared/components/Alert';
import { BlockchainGasTaxStepModal } from '../../../shared/components/BlockchainGasTaxStepModal';
import { TextField } from '../../../shared/components/Form/TextField';
import { GasModalHeader } from '../../../shared/components/GasModalHeader';
import { PoliciesAgreementStepModal } from '../../../shared/components/PoliciesAgreementStepModal';
import { Spinner } from '../../../shared/components/Spinner';
import { LocalStorageFields } from '../../../shared/enums/LocalStorageFields';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useChainScanLink } from '../../../shared/hooks/useChainScanLink';
import { useTimedBoolean } from '../../../shared/hooks/useTimedBoolean';
import useTranslation from '../../../shared/hooks/useTranslation';
import { useEstimateTransferGas } from '../../hooks/useEstimateTransferGas';
import { useGetStatusOfTokenTransfers } from '../../hooks/useGetStatusOfTokenTransfers';
import { useTokenCollectionById } from '../../hooks/useTokenCollectionById';
import useTransferMultipleTokens from '../../hooks/useTransferMultipleTokens/useTransferMultipleTokens';
import useTransferToken from '../../hooks/useTransferTokens/useTransferToken';
import { ProcessingStepModal } from '../ProcessingStepModal';
import { TokenTransferProcessModal } from '../TokenTransferProcessModal';

interface Tokens {
  id: string;
  number: string;
}
interface Props {
  tokens: Array<Tokens>;
  collectionName: string;
  collectionId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Form {
  wallet: string;
}

interface TokenList {
  [token: string]: {
    id: string;
    number: string;
    status: string;
    hash: string;
    chainId: number;
  };
}
interface TransferredItemProps {
  editionNumber: string;
  type: 'single' | 'multiple';
  wallet: string;
  status: string;
  chainId: number;
  hash: string;
}

interface ContentProcessProps {
  startProcess: boolean;
  wallet: string;
  tokenList: TokenList;
  isSuccess: boolean;
}

interface SuccessMessageProps {
  wallet: string;
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
      {Object.keys(tokenList).length > 1 ? (
        <>
          {showSpinner && (
            <Spinner className="!pw-border-t-[#5682C3] !pw-border-[#D1D1D1] pw-mx-auto pw-mb-6" />
          )}

          <div className="pw-flex pw-items-center pw-flex-wrap pw-justify-start pw-gap-x-[21px]">
            {Object.keys(tokenList).map((token) => (
              <TransferredItem
                key={tokenList[token].id}
                editionNumber={tokenList[token].number}
                type="multiple"
                wallet={wallet}
                status={tokenList[token].status}
                chainId={tokenList[token].chainId}
                hash={tokenList[token].hash}
              />
            ))}
          </div>

          {isSuccess && <SuccessMessage wallet={wallet} />}
        </>
      ) : (
        <>
          {Object.keys(tokenList).map((token) => (
            <TransferredItem
              key={tokenList[token].id}
              editionNumber={tokenList[token].number}
              type="single"
              wallet={wallet}
              status={tokenList[token].status}
              chainId={tokenList[token].chainId}
              hash={tokenList[token].hash}
            />
          ))}
        </>
      )}
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
  BLOCKCHAIN_GAS_TAX_STEP_MODAL = 'BlockchainGasTaxStepModal',
  PROCESSING_STEP_MODAL = 'ProcessingStepModal',
}

const stepOrder = [
  Steps.TOKEN_TRANSFER_PROCESS_MODAL,
  Steps.POLICIES_AGREEMENT_STEP_MODAL,
  Steps.BLOCKCHAIN_GAS_TAX_STEP_MODAL,
  Steps.PROCESSING_STEP_MODAL,
];

const TokenTransferController = ({
  tokens,
  collectionName,
  collectionId,
  isOpen,
  onClose,
}: Props) => {
  const [translate] = useTranslation();
  const { data: tokenCollectionResponse } =
    useTokenCollectionById(collectionId);
  const [isShowingErrorMessage, showErrorMessage] = useTimedBoolean(6000);
  const [
    dontShowTokenTransferProcessModal,
    setDontShowTokenTransferProcessModal,
  ] = useLocalStorage<boolean>(
    LocalStorageFields.DONT_SHOW_TOKEN_TRANSFER_PROCESS_MODAL
  );

  const [gasPricePaid, setGasPricePaid] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<Steps | null>(null);
  const {
    mutate: transferMultipleTokens,
    isError: isErrorTransferMultipleTokens,
  } = useTransferMultipleTokens();
  const { mutate: transferToken, isError: isErrorTransferToken } =
    useTransferToken();

  const { successfulTransfers, tokenList } = useGetStatusOfTokenTransfers(
    tokens,
    currentStep === Steps.PROCESSING_STEP_MODAL
  );

  useEffect(() => {
    if (isErrorTransferMultipleTokens || isErrorTransferToken) {
      showErrorMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorTransferMultipleTokens, isErrorTransferToken]);

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
    client.invalidateQueries(PixwayAPIRoutes.TOKEN_EDITIONS);
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
        /^(0x)[0-9a-f]{40}$/i,
        translate('tokens>tokenTransferController>incorrectWallet')
      )
      .not(
        ['0x0000000000000000000000000000000000000000'],
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

  const {
    data: estimateTransferGas,
    isSuccess: isSuccessEstimateTransferGas,
    refetch: refetchEstimateTransferGas,
    isError: isErrorEstimateTransferGas,
  } = useEstimateTransferGas(tokens[0].id, toAddress.value, {
    enabled: isOpen && toAddress.value !== '',
  });

  const gasPrice = Number(estimateTransferGas?.data.totalGasPrice?.proposed);

  const handleConfirmTokenTransferProcessModal = (dontShowAgain: boolean) => {
    setDontShowTokenTransferProcessModal(dontShowAgain);
    nextStep();
  };

  const handleConfirmPoliciesAgreementStep = () => {
    refetchEstimateTransferGas();
    nextStep();
  };

  const handleGasTaxConfirm = (gasPrice: number) => {
    setGasPricePaid(gasPrice);

    if (tokens.length > 1) {
      const tokenIds = tokens.map((token) => token.id);
      transferMultipleTokens({
        toAddress: toAddress.value,
        editionId: tokenIds,
      });
    } else {
      transferToken({
        toAddress: toAddress.value,
        editionId: tokens[0].id,
      });
    }
    nextStep();
  };

  const subTitle =
    tokenCollectionResponse?.data?.quantity &&
    tokenCollectionResponse?.data?.quantity > 1
      ? tokens.length > 1
        ? `${translate('tokens>tokenTransferController>editions')}: ${tokens
            .map((token) => token.number)
            .join(', ')}`
        : `${translate('tokens>tokenTransferController>edition')} ${
            tokens[0].number
          }`
      : translate('tokens>tokenTransferController>singleEdition');

  return (
    <>
      {isOpen ? (
        <>
          {currentStep === Steps.TOKEN_TRANSFER_PROCESS_MODAL ? (
            <TokenTransferProcessModal
              isOpen={currentStep === Steps.TOKEN_TRANSFER_PROCESS_MODAL}
              onClose={onClose}
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
              onCancel={onClose}
              onClose={onClose}
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

          {currentStep === Steps.BLOCKCHAIN_GAS_TAX_STEP_MODAL ? (
            <BlockchainGasTaxStepModal
              isOpen={currentStep === Steps.BLOCKCHAIN_GAS_TAX_STEP_MODAL}
              gasPrice={gasPrice * tokens.length}
              refetch={refetchEstimateTransferGas}
              gasPriceFound={isSuccessEstimateTransferGas}
              gasPriceError={isErrorEstimateTransferGas}
              onCancel={onClose}
              onClose={onClose}
              onConfirm={handleGasTaxConfirm}
              cancelButtonLabel={translate(
                'tokens>tokenTransferController>cancel'
              )}
              confirmButtonLabel={translate(
                'dash>tokenEditionActionsProvider>transfer'
              )}
              subtitle={translate(
                'tokens>tokenTransferController>confirmInformationToTransfer'
              )}
              title={translate('tokens>tokenTransferController>tokenTransfer')}
            >
              <GasModalHeader
                imageBox={
                  <Image
                    src={tokenCollectionResponse?.data?.mainImage || ''}
                    height={50}
                    width={50}
                    alt={collectionName}
                    className="pw-shrink-0 pw-object-cover"
                  />
                }
                title={collectionName}
                subTitle={subTitle}
                classes={{ box: 'pw-mb-6' }}
              />
            </BlockchainGasTaxStepModal>
          ) : null}

          {currentStep === Steps.PROCESSING_STEP_MODAL ? (
            <ProcessingStepModal
              isOpen={currentStep === Steps.PROCESSING_STEP_MODAL}
              subTitle={translate('tokens>processingStepModal>notLongToGo')}
              linkHref={PixwayAppRoutes.TOKENS}
              linkText={translate(
                'tokens>tokenTransferController>goToMyTokens'
              )}
              onClose={onClose}
              isSuccess={successfulTransfers}
            >
              <GasModalHeader
                imageBox={
                  <Image
                    src={tokenCollectionResponse?.data?.mainImage || ''}
                    height={50}
                    width={50}
                    alt={collectionName}
                    className="pw-rounded-[14px] pw-shrink-0 pw-object-cover"
                  />
                }
                title={collectionName}
                subTitle={subTitle}
                gasPrice={gasPricePaid}
                classes={{ box: 'pw-my-6' }}
              />

              {tokenList && (
                <ContentProcess
                  startProcess={currentStep === Steps.PROCESSING_STEP_MODAL}
                  wallet={toAddress.value}
                  tokenList={tokenList}
                  isSuccess={successfulTransfers}
                />
              )}
            </ProcessingStepModal>
          ) : null}

          {isShowingErrorMessage ? (
            <Alert
              variant="error"
              className="pw-flex pw-justify-center pw-absolute pw-top-3 pw-right-3 pw-max-w-[400px] !pw-p-[22px]"
            >
              <Alert.Icon className="pw-mr-2 !pw-w-[10px] !pw-h-[10px]" />
              {translate('tokens>tokenTransferController>error')}
            </Alert>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default TokenTransferController;
