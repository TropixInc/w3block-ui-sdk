/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { DataTypesEnum, DocumentDto, KycStatus } from '@w3block/sdk-id';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import _ from 'lodash';
import { ObjectSchema, object } from 'yup';

import { Alert } from '../../shared/components/Alert';
import { Box } from '../../shared/components/Box';
import { FormTemplate } from '../../shared/components/FormTemplate';
import { ModalBase } from '../../shared/components/ModalBase';
import { Spinner } from '../../shared/components/Spinner';
import TranslatableComponent from '../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../shared/hooks/useCompanyConfig';
import { useGetTenantContextBySlug } from '../../shared/hooks/useGetTenantContextBySlug';
import { useGetTenantInputsBySlug } from '../../shared/hooks/useGetTenantInputsBySlug';
import { useGetUserContextId } from '../../shared/hooks/useGetUserContextId';
import { useGetUsersDocuments } from '../../shared/hooks/useGetUsersDocuments';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import useTranslation from '../../shared/hooks/useTranslation';
import { createSchemaSignupForm } from '../../shared/utils/createSchemaSignupForm';
import { useGetValidationsTypesForSignup } from '../../shared/utils/useGetValidationsTypesForSignup';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';
import { useGetReasonsRequiredReview } from '../hooks/useGetReasonsRequiredReview';
import { useKYCFormSubmit } from '../hooks/useKYCFormSubmit';
import { usePixwayAuthentication } from '../hooks/usePixwayAuthentication';
import { yupResolver } from '@hookform/resolvers/yup';

interface Props {
  userId: string;
  contextId?: string;
  contextSlug?: string;
  renderSubtitle?: boolean;
  profilePage?: boolean;
  userKycStatus?: KycStatus;
  formTitle?: string;
  formFooter?: string;
  keyPage?: boolean;
  inputRequestable?: boolean;
  inputsIdRequestReview?: Array<string>;
  onChangeInputsIdRequestReview?: (value: Array<string>) => void;
  productForm?: boolean;
  handleProductForm?: () => void;
  handleProductFormError?: () => void;
  product?: {
    quantity: number;
    productId: string;
  };
  userContextId?: string;
  hideComplexPhone?: boolean;
  hideContinue?: boolean;
  readonly?: boolean;
}

interface ErrorProps {
  message: string;
}

const _FormCompleteKYCWithoutLayout = ({
  userId,
  contextSlug,
  renderSubtitle = true,
  profilePage,
  userKycStatus,
  formFooter,
  formTitle,
  keyPage,
  inputRequestable,
  inputsIdRequestReview,
  onChangeInputsIdRequestReview,
  productForm = false,
  handleProductForm,
  handleProductFormError,
  product,
  userContextId,
  hideComplexPhone,
  hideContinue,
  readonly,
}: Props) => {
  const router = useRouterConnect();
  const { signOut } = usePixwayAuthentication();
  const [translate] = useTranslation();
  const slug = () => {
    if (contextSlug) {
      return contextSlug;
    } else {
      const querySlug = router.query.contextSlug ?? '';

      if (querySlug) return querySlug as string;
      else return 'signup';
    }
  };

  const { data: kycContext } = useGetTenantContextBySlug(slug());

  const theme = useThemeConfig();
  const skipWallet =
    theme.defaultTheme?.configurations?.contentData?.skipWallet;
  const [uploadProgress, setUploadProgress] = useState(false);
  const { companyId: tenantId } = useCompanyConfig();
  const step = router.query && router.query.step && router.query.step;
  const { data: tenantInputs, isFetching: isLoadingKyc } =
    useGetTenantInputsBySlug({
      slug: slug(),
    });
  const inputsFiltered = useMemo(
    () =>
      tenantInputs?.data?.filter(
        (input: { type: DataTypesEnum; data: any }) =>
          !(
            input.type === DataTypesEnum.Checkbox &&
            (input?.data as any)?.hidden
          )
      ),
    [tenantInputs?.data]
  );
  const groupedInputs = _.groupBy(inputsFiltered, 'step');

  const { data: userContext } = useGetUserContextId({
    userId: userId ?? '',
    userContextId: userContextId ?? '',
  });
  const { data: documents } = useGetUsersDocuments({
    userId: userId ?? '',
    contextId: tenantInputs?.data?.length
      ? tenantInputs?.data[0].contextId
      : '',
  });

  const docsToUse = useMemo(() => {
    if (userContext && userContext?.data?.documents) {
      return userContext?.data?.documents;
    } else return documents?.data;
  }, [userContext, documents]);

  const { data: reasons } = useGetReasonsRequiredReview(
    tenantId,
    userId,
    tenantInputs?.data?.length ? tenantInputs?.data[0].contextId : ''
  );

  const reasonsToUse = useMemo(() => {
    if (userContext && userContext?.data) return userContext?.data;
    else {
      const r = reasons as { data?: { items?: unknown[] } } | undefined;
      if (r?.data?.items) return r.data.items[0];
    }
  }, [userContext, reasons]);

  const statusContext = useMemo(() => {
    if (reasonsToUse && reasonsToUse?.status) {
      return reasonsToUse?.status;
    }
  }, [reasonsToUse]);

  const inputsToShow = useMemo(() => {
    if (step) return groupedInputs[step as string];
    else return inputsFiltered ?? [];
  }, [step, inputsFiltered]);

  const validations = useGetValidationsTypesForSignup(
    inputsToShow ?? [],
    inputsToShow?.length ? inputsToShow?.[0].contextId : '',
    keyPage
  );

  const yupSchema = createSchemaSignupForm(validations);
  const dynamicSchema = object().shape(yupSchema);

  const dynamicMethods = useForm<DocumentDto>({
    shouldUnregister: false,
    mode: 'onTouched',
    resolver: yupResolver(
      dynamicSchema as unknown as ObjectSchema<DocumentDto>
    ),
  });

  const { onSubmit, isSuccess, isError, isPending, error } = useKYCFormSubmit({
    userId,
    slug: slug(),
    groupedInputs,
    tenantInputs,
    kycContext,
    skipWallet,
    keyPage,
    profilePage,
    productForm,
    handleProductForm,
    handleProductFormError,
    product,
    userContextId,
    dynamicMethods,
  });

  const errorPost = error as AxiosError;
  const errorMessage = errorPost?.response?.data as ErrorProps;

  function getDocumentByInputId(inputId: string) {
    return docsToUse?.find((doc: any) =>
      userContext
        ? doc.inputId === inputId &&
          (doc as any)?.userContextId === userContextId
        : doc.inputId === inputId
    );
  }

  const formState = useMemo(() => {
    if (productForm) return 'initial';
    else if (router?.query?.formState) return router?.query?.formState as string;
    else return '';
  }, [productForm, router?.query?.formState]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  if (isLoadingKyc) {
    return (
      <div className="pw-mt-20 pw-w-full pw-flex pw-items-center pw-justify-center">
        <Spinner />
      </div>
    );
  }

  if (!tenantInputs?.data?.length) return null;

  const formContent = (
    <FormProvider {...dynamicMethods}>
      {!keyPage &&
      reasonsToUse?.logs?.at(-1)?.reason &&
      reasonsToUse?.logs?.at(-1)?.inputIds.length ? (
        <div className="pw-mb-4 pw-p-3 pw-bg-red-100 pw-w-full pw-rounded-lg">
          <p className="pw-mt-2 pw-text-[#FF0505]">
            {reasonsToUse?.logs.at(-1)?.reason}
          </p>
        </div>
      ) : null}
      {renderSubtitle && typeof formTitle !== 'string' && (
        <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-5">
          {translate('auth>formCompletKYCWithoutLayout>pageLabel')}
        </p>
      )}

      {formTitle && (
        <div
          className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-5"
          dangerouslySetInnerHTML={{
            __html: formTitle ?? '',
          }}
        ></div>
      )}

      <FormTemplate
        isLoading={isPending}
        buttonDisabled={
          (keyPage ? !dynamicMethods?.formState?.isValid : false) ||
          isPending ||
          Boolean(
            contextSlug === 'signup' &&
              (userKycStatus === KycStatus.Approved ||
                userKycStatus === KycStatus.Denied)
          )
        }
        onSubmit={dynamicMethods.handleSubmit(onSubmit)}
        tenantInputs={inputsToShow}
        setUploadProgress={setUploadProgress}
        getDocumentByInputId={getDocumentByInputId}
        formState={formState}
        {...(keyPage
          ? {
              inputRequestable,
              inputsIdRequestReview,
              onChangeInputsIdRequestReview,
              keyPage,
            }
          : {})}
        profilePage={profilePage}
        statusContext={statusContext}
        hideComplexPhone={hideComplexPhone}
        hideContinue={hideContinue}
        readonly={readonly}
      ></FormTemplate>

      {isSuccess && (
        <Alert variant="success" className="pw-flex pw-gap-x-3 pw-mb-5">
          <div className="pw-p-3 pw-w-full pw-rounded-lg">
            <p className="pw-text-green-300">
              {translate('auth>ormCompletKYCWithoutLayout>saveInfosSucess')}
            </p>
          </div>
        </Alert>
      )}
      {!keyPage &&
        !dynamicMethods?.formState?.isValid &&
        dynamicMethods?.formState?.isSubmitted &&
        !inputsFiltered?.some(
          (res: { type: DataTypesEnum }) =>
            res.type === DataTypesEnum.Iframe
        ) && (
          <Alert variant="error" className="pw-flex pw-gap-x-3 pw-my-5">
            <p className="pw-text-sm">
              {translate('auth>formCompleteKYCWithoutLayout>verifyFieds')}
            </p>
          </Alert>
        )}
      {isError && (
        <Alert variant="error" className="pw-flex pw-gap-x-3 pw-my-5">
          <p className="pw-text-sm">{errorMessage?.message}</p>
        </Alert>
      )}
      {uploadProgress && (
        <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-2">
          {translate('auth>formCompletKYCWithoutLayout>sendInforms')}
        </p>
      )}
      {contextSlug === 'signup' &&
      (userKycStatus === KycStatus.Approved ||
        userKycStatus === KycStatus.Denied) ? (
        <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-2">
          {translate('auth>formCompletKYCWithoutLayout>notEditInfos')}
        </p>
      ) : null}
      {profilePage || keyPage || typeof formFooter === 'string' ? null : (
        <p className="pw-text-sm pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mt-5 pw-text-end">
          <button
            onClick={() => setIsOpenModal(true)}
            className="pw-text-[15px] pw-leading-[18px] pw-text-[#ff5a5a] pw-font-semibold pw-mt-5 pw-underline hover:pw-text-[#993d3d]"
          >
            {translate('shared>exit')}
          </button>{' '}
          {translate('auth>formCompleteKYCWithoutLayout>continueLater')}
        </p>
      )}
      {formFooter && (
        <div
          dangerouslySetInnerHTML={{
            __html: formFooter ?? '',
          }}
        ></div>
      )}
    </FormProvider>
  );

  if (keyPage) return formContent;

  return (
    <Box
      className={classNames(
        profilePage &&
          '!pw-bg-none !pw-w-full !pw-py-0 !pw-max-w-[1000px] !pw-shadow-none'
      )}
    >
      {formContent}
      <ModalBase isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <div>
          <p>
            {translate(
              'auth>formCompleteKYCWithoutLayout>confirmCancelRegistration'
            )}
          </p>
          <div>
            <button
              onClick={() => setIsOpenModal(false)}
              className="pw-py-[10px] pw-px-[60px] pw-font-[500] pw-border sm:pw-w-[260px] pw-w-full pw-text-xs pw-mt-6 pw-rounded-full pw-border-[#0050FF] pw-text-black"
            >
              {translate('components>cancelMessage>cancel')}
            </button>
            <button
              onClick={() =>
                signOut().then(() => {
                  router.pushConnect(PixwayAppRoutes.HOME);
                })
              }
              className="pw-py-[10px] pw-px-[60px] pw-font-[700] pw-font pw-text-xs pw-mt-3 pw-rounded-full sm:pw-w-[260px] pw-w-full pw-shadow-[0_2px_4px_rgba(0,0,0,0.26)] pw-bg-[#0050FF] pw-text-white"
            >
              {translate('components>advanceButton>continue')}
            </button>
          </div>
        </div>
      </ModalBase>
    </Box>
  );
};

export const FormCompleteKYCWithoutLayout = ({
  userId,
  contextSlug,
  renderSubtitle,
  profilePage,
  userKycStatus,
  formFooter,
  formTitle,
  keyPage,
  inputRequestable,
  inputsIdRequestReview,
  onChangeInputsIdRequestReview,
  productForm,
  handleProductForm,
  handleProductFormError,
  product,
  userContextId,
  hideComplexPhone,
  hideContinue,
  readonly,
}: Props) => (
  <TranslatableComponent>
    <_FormCompleteKYCWithoutLayout
      userId={userId}
      contextSlug={contextSlug}
      renderSubtitle={renderSubtitle}
      profilePage={profilePage}
      userKycStatus={userKycStatus}
      formFooter={formFooter}
      formTitle={formTitle}
      keyPage={keyPage}
      inputRequestable={inputRequestable}
      inputsIdRequestReview={inputsIdRequestReview}
      onChangeInputsIdRequestReview={onChangeInputsIdRequestReview}
      productForm={productForm}
      handleProductForm={handleProductForm}
      handleProductFormError={handleProductFormError}
      product={product}
      userContextId={userContextId}
      hideComplexPhone={hideComplexPhone}
      hideContinue={hideContinue}
      readonly={readonly}
    />
  </TranslatableComponent>
);
