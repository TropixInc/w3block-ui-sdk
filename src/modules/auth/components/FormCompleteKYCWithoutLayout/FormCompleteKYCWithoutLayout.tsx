import { lazy, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { DocumentDto, KycStatus } from '@w3block/sdk-id';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import _ from 'lodash';
import { object } from 'yup';

import { useRouterConnect } from '../../../shared';
import { Alert } from '../../../shared/components/Alert';
import { FormTemplate } from '../../../shared/components/FormTemplate';
import { Spinner } from '../../../shared/components/Spinner';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetTenantContextBySlug } from '../../../shared/hooks/useGetTenantContextBySlug/useGetTenantContextBySlug';
import { useGetTenantInfoByHostname } from '../../../shared/hooks/useGetTenantInfoByHostname';
import { useGetTenantInputsBySlug } from '../../../shared/hooks/useGetTenantInputs/useGetTenantInputsBySlug';
import { useGetUsersDocuments } from '../../../shared/hooks/useGetUsersDocuments';
import { usePostUsersDocuments } from '../../../shared/hooks/usePostUsersDocuments/usePostUsersDocuments';
import useTranslation from '../../../shared/hooks/useTranslation';
import { createSchemaSignupForm } from '../../../shared/utils/createSchemaSignupForm';
import { useGetValidationsTypesForSignup } from '../../../shared/utils/useGetValidationsTypesForSignup';
import { useGetReasonsRequiredReview } from '../../hooks/useGetReasonsRequiredReview';
import { usePixwayAuthentication } from '../../hooks/usePixwayAuthentication';
const Box = lazy(() =>
  import('../../../shared/components/Box/Box').then((m) => ({ default: m.Box }))
);

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
}: Props) => {
  const router = useRouterConnect();
  const { signOut } = usePixwayAuthentication();
  const [translate] = useTranslation();
  const { mutate, isSuccess, isError, isLoading, error } =
    usePostUsersDocuments();
  const slug = () => {
    if (contextSlug) {
      return contextSlug;
    } else {
      const querySlug = router.query.contextSlug ?? '';

      if (querySlug) return querySlug as string;
      else return 'signup';
    }
  };
  const { data: companyInfo } = useGetTenantInfoByHostname();

  const { data: kycContext } = useGetTenantContextBySlug(slug());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const screenConfig = (kycContext?.data as any)?.data?.screenConfig;

  const isPasswordless = companyInfo?.configuration?.passwordless?.enabled;
  const [uploadProgress, setUploadProgress] = useState(false);
  const { companyId: tenantId } = useCompanyConfig();
  const step = router.query && router.query.step && router.query.step;
  const { data: tenantInputs, isLoading: isLoadingKyc } =
    useGetTenantInputsBySlug({
      slug: slug(),
    });

  const groupedInputs = _.groupBy(tenantInputs?.data, 'step');

  const { data: documents } = useGetUsersDocuments({
    userId: userId ?? '',
    contextId: tenantInputs?.data?.length
      ? tenantInputs?.data[0].contextId
      : '',
  });

  const query = Object.keys(router.query ?? {}).length > 0 ? router.query : '';

  const errorPost = error as AxiosError;
  const errorMessage = errorPost?.response?.data as ErrorProps;

  const { data: reasons } = useGetReasonsRequiredReview(
    tenantId,
    userId,
    tenantInputs?.data?.length ? tenantInputs?.data[0].contextId : ''
  );

  const validations = useGetValidationsTypesForSignup(
    tenantInputs?.data ?? [],
    tenantInputs?.data?.length ? tenantInputs?.data[0].contextId : ''
  );
  const yupSchema = createSchemaSignupForm(validations);

  const dynamicSchema = object().shape(yupSchema);

  const dynamicMethods = useForm<DocumentDto>({
    shouldUnregister: false,
    mode: 'onChange',
    resolver: yupResolver(dynamicSchema),
  });

  const onSubmit = () => {
    const dynamicValues = dynamicMethods.getValues();
    const documents = Object.values(dynamicValues);
    const validDocs = documents.filter((item) => item);
    if (tenantInputs?.data?.length && userId) {
      const isUserSelector = (tenantInputs?.data?.[0]?.data as any)
        ?.isUserSelector;
      const whereToSend = (tenantInputs?.data?.[0]?.data as any)?.whereToSend[
        validDocs[0].value
      ]?.link;

      const { contextId } = tenantInputs.data[0];
      mutate(
        {
          tenantId,
          contextId,
          userId,
          documents: {
            documents: validDocs,
            currentStep: parseInt(step as string),
          },
        },
        {
          onSuccess: () => {
            const steps = Object.keys(groupedInputs).length;
            if (steps && parseInt(step as string) < steps) {
              router.replace({
                query: {
                  contextSlug: slug(),
                  step: parseInt(step as string) + 1,
                },
              });
            } else if (!profilePage) {
              if (isUserSelector) {
                router.pushConnect(whereToSend);
              } else if (screenConfig?.skipConfirmation) {
                if (typeof screenConfig?.postKycUrl === 'string') {
                  router.pushConnect(screenConfig?.postKycUrl);
                } else if (isPasswordless) {
                  router.pushConnect('/');
                } else {
                  router.pushConnect(
                    PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
                    router.query
                  );
                }
              } else if (keyPage) {
                null;
              } else {
                router.pushConnect(
                  PixwayAppRoutes.COMPLETE_KYC_CONFIRMATION,
                  query
                );
              }
            }
          },
        }
      );
    }
  };

  function getDocumentByInputId(inputId: string) {
    return documents?.data.find((doc) => doc.inputId === inputId);
  }

  const inputsToShow = () => {
    if (step) return groupedInputs[step as string];
    else return tenantInputs?.data ?? [];
  };

  const formState = router.query ? (router.query.formState as string) : '';

  return isLoadingKyc ? (
    <div className="pw-mt-20 pw-w-full pw-flex pw-items-center pw-justify-center">
      <Spinner />
    </div>
  ) : tenantInputs?.data?.length ? (
    keyPage ? (
      <FormProvider {...dynamicMethods}>
        {!keyPage &&
        reasons?.data?.items?.[0]?.logs?.at(-1)?.reason &&
        reasons?.data?.items?.[0]?.logs?.at(-1)?.inputIds.length ? (
          <div className="pw-mb-4 pw-p-3 pw-bg-red-100 pw-w-full pw-rounded-lg">
            <p className="pw-mt-2 pw-text-[#FF0505]">
              {reasons?.data.items?.[0]?.logs.at(-1)?.reason}
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
          isLoading={isLoading}
          buttonDisabled={
            !dynamicMethods.formState.isValid ||
            isLoading ||
            Boolean(
              contextSlug === 'signup' &&
                (userKycStatus === KycStatus.Approved ||
                  userKycStatus === KycStatus.Denied)
            )
          }
          onSubmit={dynamicMethods.handleSubmit(onSubmit)}
          tenantInputs={inputsToShow()}
          setUploadProgress={setUploadProgress}
          getDocumentByInputId={getDocumentByInputId}
          formState={formState}
          inputRequestable={inputRequestable}
          inputsIdRequestReview={inputsIdRequestReview}
          onChangeInputsIdRequestReview={onChangeInputsIdRequestReview}
          keyPage={keyPage}
          profilePage={profilePage}
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
              onClick={() =>
                signOut().then(() => {
                  router.pushConnect(PixwayAppRoutes.HOME);
                })
              }
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
    ) : (
      <Box
        className={classNames(
          profilePage &&
            '!pw-bg-none !pw-w-full !pw-py-0 !pw-max-w-[1000px] !pw-shadow-none'
        )}
      >
        <FormProvider {...dynamicMethods}>
          {reasons?.data?.items?.[0]?.logs?.at(-1)?.reason &&
          reasons?.data?.items?.[0]?.logs?.at(-1)?.inputIds.length ? (
            <div className="pw-mb-4 pw-p-3 pw-bg-red-100 pw-w-full pw-rounded-lg">
              <p className="pw-mt-2 pw-text-[#FF0505]">
                {reasons?.data.items?.[0]?.logs.at(-1)?.reason}
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
            isLoading={isLoading}
            buttonDisabled={
              !dynamicMethods.formState.isValid ||
              isLoading ||
              Boolean(
                contextSlug === 'signup' &&
                  (userKycStatus === KycStatus.Approved ||
                    userKycStatus === KycStatus.Denied)
              )
            }
            onSubmit={dynamicMethods.handleSubmit(onSubmit)}
            tenantInputs={inputsToShow()}
            setUploadProgress={setUploadProgress}
            getDocumentByInputId={getDocumentByInputId}
            formState={formState}
            profilePage={profilePage}
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
                onClick={() =>
                  signOut().then(() => {
                    router.pushConnect(PixwayAppRoutes.HOME);
                  })
                }
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
      </Box>
    )
  ) : null;
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
    />
  </TranslatableComponent>
);
