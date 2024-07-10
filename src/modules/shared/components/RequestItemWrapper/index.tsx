import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormCompleteKYCWithoutLayout } from '../../../auth';
import { OffpixButtonBase } from '../../../tokens/components/DisplayCards/OffpixButtonBase';
import TokenizationFormItemContainer from '../../../tokens/components/TokenizationFormItemContainer/TokenizationFormItemContainer';
import useApproveKYC from '../../hooks/useApproveKYC';
import useRejectKYC from '../../hooks/useRejectKYC';
import { useRequiredReviewDocs } from '../../hooks/useRequiredReviewDocs';
import { Alert } from '../Alert';
import LabelWithRequired from '../LabelWithRequired';

interface KycItemProps {
  userId: string;
  contextId: string;
  slugContext: string;
  onChangeIsRenderKycItem: (value: boolean) => void;
}

const RequestItemWrapper = ({
  userId,
  contextId,
  onChangeIsRenderKycItem,
  slugContext,
}: KycItemProps) => {
  const [translate] = useTranslation();

  const [isRequestReview, setIsRequestReview] = useState(false);
  const [isReproveContext, setIsReproveContext] = useState(false);
  const [reasonsReview, setReasonsReview] = useState<string>();
  const [reasonsReprove, setReasonsReprove] = useState<string>();
  const [isSuccesSendReview, setIsSuccessSendReview] = useState(false);
  const [isSuccessReprove, setIsSuccessReprove] = useState(false);
  const [inputsIdRequestReview, setInputsIdRequestReview] =
    useState<Array<string>>();
  const {
    mutate: onSendRequestReview,
    isSuccess: isSucessRequestReview,
    isError: isErrorRequestReview,
  } = useRequiredReviewDocs();

  const {
    mutate: rejectKYC,
    isSuccess: isRejectSuccess,
    isError: isRejectError,
  } = useRejectKYC();

  const {
    mutate: approveKYC,
    isSuccess: isSuccesAproveKyc,
    isError: isErrorAproveKyc,
  } = useApproveKYC();

  const onRequestReview = () => {
    if (inputsIdRequestReview?.length) {
      onSendRequestReview({
        contextId,
        userId,
        inputIds: inputsIdRequestReview,
        reason: reasonsReview ?? '',
      });
    }
  };

  const onCancelRequestReview = () => {
    setIsRequestReview(false);
    setReasonsReview('');
    setInputsIdRequestReview([]);
  };

  const onCancelReprove = () => {
    setIsReproveContext(false);
    setReasonsReprove('');
  };

  const onRejectContext = () => {
    rejectKYC({
      userId: userId,
      contextId: contextId,
      resons: reasonsReprove,
    });
  };

  const onAproveKyc = () => {
    approveKYC({
      userId: userId,
      contextId: contextId,
    });
  };

  useEffect(() => {
    if (isSucessRequestReview) {
      setIsSuccessSendReview(true);
      setTimeout(() => {
        onCancelRequestReview();
        setIsSuccessSendReview(false);
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSucessRequestReview]);

  useEffect(() => {
    if (isRejectSuccess) {
      setIsSuccessReprove(true);
      setTimeout(() => {
        onCancelReprove();
        onChangeIsRenderKycItem(false);
        setIsSuccessReprove(false);
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRejectSuccess]);

  useEffect(() => {
    if (isSuccesAproveKyc) {
      onChangeIsRenderKycItem(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccesAproveKyc]);

  const onRenderFooterItem = () => {
    if (isRequestReview) {
      return (
        <div className="w-full flex flex-col items-end p-4">
          <div className="w-full mt-2 sm:w-[50%]">
            <LabelWithRequired required>
              {translate('contacts>AprovationKYCForm>requestDocuments')}
            </LabelWithRequired>

            <TokenizationFormItemContainer>
              <textarea
                cols={1}
                rows={5}
                className="!text-[#969696] leading-4 font-normal w-full outline-none bg-transparent py-4 px-[18px] autofill:bg-transparent"
                onChange={(e) => setReasonsReview(e.target.value)}
                placeholder={translate('key>kycActionsModal>resons')}
              />
            </TokenizationFormItemContainer>
          </div>
          {isSuccesSendReview && (
            <Alert variant="success" className="mt-3 w-full sm:w-[50%]">
              {translate('tokens>tokenCreationGasController>success')}
            </Alert>
          )}
          {isErrorRequestReview && (
            <Alert variant="error" className="mt-3 w-full sm:w-[50%]">
              {translate('home>contactModal>error')}
            </Alert>
          )}
          <div className="flex gap-x-3 w-full mt-4 justify-end">
            <OffpixButtonBase
              className="px-4 h-10 flex justify-center items-center text-sm"
              variant="outlined"
              onClick={() => onCancelRequestReview()}
            >
              {translate('components>cancelButton>cancel')}
            </OffpixButtonBase>
            <OffpixButtonBase
              className="px-4 h-10 flex justify-center items-center text-sm"
              variant="filled"
              onClick={() => onRequestReview()}
            >
              {translate('home>contactModal>sendButton')}
            </OffpixButtonBase>
          </div>
        </div>
      );
    } else if (isReproveContext) {
      return (
        <div className="w-full flex flex-col items-end p-4">
          <div className="w-full mt-2 sm:w-[50%]">
            <LabelWithRequired required>
              {translate('contacts>headerContactDetails>reprove')}
            </LabelWithRequired>

            <TokenizationFormItemContainer>
              <textarea
                cols={1}
                rows={5}
                className="!text-[#969696] leading-4 font-normal w-full outline-none bg-transparent py-4 px-[18px] autofill:bg-transparent"
                onChange={(e) => setReasonsReprove(e.target.value)}
                placeholder={translate('key>kycActionsModal>resons')}
              />
            </TokenizationFormItemContainer>
          </div>
          {isSuccessReprove && (
            <Alert variant="success" className="mt-3 w-full sm:w-[50%]">
              {translate('tokens>tokenCreationGasController>success')}
            </Alert>
          )}
          {isRejectError && (
            <Alert variant="error" className="mt-3 w-full sm:w-[50%]">
              {translate('home>contactModal>error')}
            </Alert>
          )}
          <div className="flex gap-x-3 w-full mt-4 justify-end">
            <OffpixButtonBase
              className="px-4 h-10 flex justify-center items-center text-sm"
              variant="outlined"
              onClick={() => onCancelReprove()}
            >
              {translate('components>cancelButton>cancel')}
            </OffpixButtonBase>
            <OffpixButtonBase
              className="px-4 h-10 flex justify-center items-center text-sm !bg-[#e65356] !outline-[#E37C7E]"
              variant="filled"
              disabled={Boolean(!reasonsReprove)}
              onClick={() => onRejectContext()}
            >
              {translate('contacts>headerContactDetails>reprove')}
            </OffpixButtonBase>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full flex flex-col items-end">
          {isSuccesAproveKyc && (
            <Alert variant="success" className="mt-3 w-full sm:w-[50%]">
              {translate('tokens>tokenCreationGasController>success')}
            </Alert>
          )}
          {isErrorAproveKyc && (
            <Alert variant="error" className="mt-3 w-full sm:w-[50%]">
              {translate('home>contactModal>error')}
            </Alert>
          )}
          <div className="w-full flex flex-col justify-end p-4 gap-6 sm:flex-row">
            <div className="flex gap-6">
              <OffpixButtonBase
                className="px-4 flex-1 h-10 flex justify-center items-center text-sm !outline-[#e65356] !text-[#e65356] hover:text-[#e65356] active:text-[#e65356] active:bg-[#e2686a31]"
                variant="outlined"
                onClick={() => setIsReproveContext(true)}
              >
                {translate('contacts>headerContactDetails>reprove')}
              </OffpixButtonBase>
              <OffpixButtonBase
                className="px-4 h-10 flex justify-center items-center text-sm"
                onClick={() => setIsRequestReview(true)}
              >
                {translate('contacts>AprovationKYCForm>requestDocuments')}
              </OffpixButtonBase>
            </div>
            <OffpixButtonBase
              className="px-4 h-10 flex justify-center items-center text-sm"
              variant="outlined"
              onClick={() => onAproveKyc()}
            >
              {translate('contacts>headerContactDetails>approve')}
            </OffpixButtonBase>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      <div className="border-t p-6 gap-y-3 w-full">
        <div className="pw-w-full ">
          <FormCompleteKYCWithoutLayout
            key={contextId}
            renderSubtitle={false}
            userId={userId}
            contextId={contextId}
            contextSlug={slugContext}
            keyPage
            inputRequestable={isRequestReview}
            inputsIdRequestReview={inputsIdRequestReview}
            onChangeInputsIdRequestReview={setInputsIdRequestReview}
          />
        </div>
      </div>
      <div>{onRenderFooterItem()}</div>
    </div>
  );
};

export default RequestItemWrapper;
