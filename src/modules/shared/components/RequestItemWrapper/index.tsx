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
  userContextId: string;
  onChangeIsRenderKycItem: (value: boolean) => void;
}

const RequestItemWrapper = ({
  userId,
  contextId,
  onChangeIsRenderKycItem,
  slugContext,
  userContextId,
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
        userContextId: userContextId,
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
      userContextId: userContextId,
    });
  };

  const onAproveKyc = () => {
    approveKYC({
      userId: userId,
      contextId: contextId,
      userContextId: userContextId,
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
      setTimeout(() => {
        onChangeIsRenderKycItem(false);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccesAproveKyc]);

  const onRenderFooterItem = () => {
    if (isRequestReview) {
      return (
        <div className="pw-w-full pw-flex pw-flex-col pw-items-end pw-p-4">
          <div className="pw-w-full pw-mt-2 sm:pw-w-[50%]">
            <LabelWithRequired required>
              {translate('contacts>AprovationKYCForm>requestDocuments')}
            </LabelWithRequired>

            <TokenizationFormItemContainer>
              <textarea
                cols={1}
                rows={5}
                className="!pw-text-[#969696] pw-leading-4 pw-font-normal pw-w-full pw-outline-none pw-bg-transparent pw-py-4 pw-px-[18px] autofill:pw-bg-transparent"
                onChange={(e) => setReasonsReview(e.target.value)}
                placeholder={translate('key>kycActionsModal>resons')}
              />
            </TokenizationFormItemContainer>
          </div>
          {isSuccesSendReview && (
            <Alert
              variant="success"
              className="pw-mt-3 pw-w-full sm:pw-w-[50%]"
            >
              {translate('tokens>tokenCreationGasController>success')}
            </Alert>
          )}
          {isErrorRequestReview && (
            <Alert variant="error" className="pw-mt-3 pw-w-full sm:pw-w-[50%]">
              {translate('home>contactModal>error')}
            </Alert>
          )}
          <div className="pw-flex pw-gap-x-3 pw-w-full pw-mt-4 pw-justify-end">
            <OffpixButtonBase
              className="pw-px-4 pw-h-10 pw-flex pw-justify-center pw-items-center pw-text-sm"
              variant="outlined"
              onClick={() => onCancelRequestReview()}
            >
              {translate('components>cancelButton>cancel')}
            </OffpixButtonBase>
            <OffpixButtonBase
              className="pw-px-4 pw-h-10 pw-flex pw-justify-center pw-items-center pw-text-sm"
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
        <div className="pw-w-full pw-flex pw-flex-col pw-items-end pw-p-4">
          <div className="w-full mt-2 sm:w-[50%]">
            <LabelWithRequired required>
              {translate('contacts>headerContactDetails>reprove')}
            </LabelWithRequired>

            <TokenizationFormItemContainer>
              <textarea
                cols={1}
                rows={5}
                className="!pw-text-[#969696] pw-leading-4 pw-font-normal pw-w-full pw-outline-none pw-bg-transparent pw-py-4 pw-px-[18px] autofill:pw-bg-transparent"
                onChange={(e) => setReasonsReprove(e.target.value)}
                placeholder={translate('key>kycActionsModal>resons')}
              />
            </TokenizationFormItemContainer>
          </div>
          {isSuccessReprove && (
            <Alert
              variant="success"
              className="pw-mt-3 pw-w-full sm:pw-w-[50%]"
            >
              {translate('tokens>tokenCreationGasController>success')}
            </Alert>
          )}
          {isRejectError && (
            <Alert variant="error" className="pw-mt-3 pw-w-full sm:pw-w-[50%]">
              {translate('home>contactModal>error')}
            </Alert>
          )}
          <div className="pw-flex pw-gap-x-3 pw-w-full pw-mt-4 pw-justify-end">
            <OffpixButtonBase
              className="pw-px-4 pw-h-10 pw-flex pw-justify-center pw-items-center pw-text-sm"
              variant="outlined"
              onClick={() => onCancelReprove()}
            >
              {translate('components>cancelButton>cancel')}
            </OffpixButtonBase>
            <OffpixButtonBase
              className="pw-px-4 pw-h-10 pw-flex pw-justify-center pw-items-center pw-text-sm !pw-bg-[#e65356] !pw-outline-[#E37C7E]"
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
        <div className="pw-w-full pw-flex pw-flex-col pw-items-end">
          {isSuccesAproveKyc && (
            <Alert
              variant="success"
              className="pw-mt-3 pw-w-full sm:pw-w-[50%]"
            >
              {translate('tokens>tokenCreationGasController>success')}
            </Alert>
          )}
          {isErrorAproveKyc && (
            <Alert variant="error" className="pw-mt-3 pw-w-full sm:pw-w-[50%]">
              {translate('home>contactModal>error')}
            </Alert>
          )}
          <div className="pw-w-full pw-flex pw-flex-col pw-justify-end pw-p-4 pw-gap-6 sm:pw-flex-row">
            <div className="pw-flex pw-gap-6">
              <OffpixButtonBase
                className="pw-px-4 pw-flex-1 pw-h-10 pw-flex pw-justify-center pw-items-center pw-text-sm !pw-outline-[#e65356] !pw-text-[#e65356] hover:pw-text-[#e65356] active:pw-text-[#e65356] active:pw-bg-[#e2686a31]"
                variant="outlined"
                onClick={() => setIsReproveContext(true)}
              >
                {translate('contacts>headerContactDetails>reprove')}
              </OffpixButtonBase>
              <OffpixButtonBase
                className="pw-px-4 pw-h-10 pw-flex pw-justify-center pw-items-center pw-text-sm"
                onClick={() => setIsRequestReview(true)}
              >
                {translate('contacts>AprovationKYCForm>requestDocuments')}
              </OffpixButtonBase>
            </div>
            <OffpixButtonBase
              className="pw-px-4 pw-h-10 pw-flex pw-justify-center pw-items-center pw-text-sm"
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
    <div className="pw-w-full">
      <div className="pw-border-t pw-p-6 pw-gap-y-3 pw-w-full">
        <div className="pw-w-full">
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
            userContextId={userContextId}
          />
        </div>
      </div>
      <div>{onRenderFooterItem()}</div>
    </div>
  );
};

export default RequestItemWrapper;
