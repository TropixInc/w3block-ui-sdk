import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { DocumentDto, KycStatus } from '@w3block/sdk-id';
import { AxiosError } from 'axios';
import { object } from 'yup';

import { useRouterConnect } from '../../../shared';
import { Alert } from '../../../shared/components/Alert';
import SmartInputsController from '../../../shared/components/SmartInputsController';
import { Spinner } from '../../../shared/components/Spinner';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetTenantInputsBySlug } from '../../../shared/hooks/useGetTenantInputs/useGetTenantInputsBySlug';
import { useGetUsersDocuments } from '../../../shared/hooks/useGetUsersDocuments';
import { usePostUsersDocuments } from '../../../shared/hooks/usePostUsersDocuments/usePostUsersDocuments';
import useTranslation from '../../../shared/hooks/useTranslation';
import { createSchemaSignupForm } from '../../../shared/utils/createSchemaSignupForm';
import { useGetValidationsTypesForSignup } from '../../../shared/utils/useGetValidationsTypesForSignup';
import { useGetReasonsRequiredReview } from '../../hooks/useGetReasonsRequiredReview';
import { AuthButton } from '../AuthButton';

interface Props {
  userId: string;
  contextId?: string;
  contextSlug?: string;
  renderSubtitle?: boolean;
  profilePage?: boolean;
  userKycStatus?: KycStatus;
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
}: Props) => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const { mutate, isSuccess, isError, isLoading, error } =
    usePostUsersDocuments();
  const { companyId: tenantId } = useCompanyConfig();

  const { data: tenantInputs } = useGetTenantInputsBySlug({
    slug: contextSlug ? contextSlug : 'signup',
  });

  const { data: documents } = useGetUsersDocuments({
    userId: userId ?? '',
    contextId: tenantInputs?.data[0].contextId ?? '',
  });

  const errorPost = error as AxiosError;
  const errorMessage = errorPost?.response?.data as ErrorProps;

  const { data: reasons } = useGetReasonsRequiredReview(
    tenantId,
    userId,
    tenantInputs?.data[0].contextId ?? ''
  );

  const validations = useGetValidationsTypesForSignup(tenantInputs?.data ?? []);
  const yupSchema = createSchemaSignupForm(validations);

  const dynamicSchema = object().shape(yupSchema);

  const dynamicMethods = useForm<DocumentDto>({
    mode: 'onChange',
    resolver: yupResolver(dynamicSchema),
  });

  const onSubmit = () => {
    const dynamicValues = dynamicMethods.getValues();

    const documents = Object.values(dynamicValues);

    const validDocs = documents.filter((item) => item);

    if (tenantInputs?.data?.length && userId) {
      const { contextId } = tenantInputs.data[0];
      mutate({
        tenantId,
        contextId,
        userId,
        documents: {
          documents: validDocs,
        },
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (!profilePage) {
        router.pushConnect(
          PixwayAppRoutes.CONNECT_EXTERNAL_WALLET,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          router.query as any
        );
      }
    }
  }, [isSuccess, profilePage, router]);

  function getDocumentByInputId(inputId: string) {
    return documents?.data.find((doc) => doc.inputId === inputId);
  }

  return (
    <FormProvider {...dynamicMethods}>
      {isError && (
        <Alert variant="error" className="pw-flex pw-gap-x-3 pw-mb-5">
          <Alert.Icon />
          <p>{errorMessage?.message}</p>
        </Alert>
      )}
      {reasons?.data?.items[0]?.logs?.at(-1)?.reason &&
      reasons?.data?.items[0]?.logs?.at(-1)?.inputIds.length ? (
        <div className="pw-mb-4 pw-p-3 pw-bg-red-100 pw-w-full pw-rounded-lg">
          <p className="pw-mt-2 pw-text-[#FF0505]">
            {reasons?.data.items?.[0]?.logs.at(-1)?.reason}
          </p>
        </div>
      ) : null}
      {renderSubtitle && (
        <p className="pw-text-[15px] pw-leading-[18px] pw-text-[#353945] pw-font-semibold pw-mb-5">
          {translate('auth>formCompletKYCWithoutLayout>pageLabel')}
        </p>
      )}

      <form onSubmit={dynamicMethods.handleSubmit(onSubmit)}>
        {tenantInputs?.data &&
          tenantInputs?.data?.map((item) => (
            <SmartInputsController
              key={item.id}
              label={item.label}
              name={item.id}
              type={item.type}
              assetId={getDocumentByInputId(item?.id)?.assetId}
              value={getDocumentByInputId(item?.id)?.value}
              docStatus={getDocumentByInputId(item?.id)?.status}
              docFileValue={
                getDocumentByInputId(item?.id)?.asset?.directLink ?? ''
              }
            />
          ))}

        {isSuccess && (
          <Alert variant="success" className="pw-flex pw-gap-x-3 pw-mb-5">
            <Alert.Icon />
            <div className="pw-p-3 pw-w-full pw-rounded-lg">
              <p className="pw-text-green-300">
                {translate('auth>ormCompletKYCWithoutLayout>saveInfosSucess')}
              </p>
            </div>
          </Alert>
        )}
        <AuthButton
          type="submit"
          className="pw-w-full pw-mt-5 pw-flex pw-items-center pw-justify-center"
          disabled={
            !dynamicMethods.formState.isValid ||
            isLoading ||
            userKycStatus === KycStatus.Approved ||
            userKycStatus === KycStatus.Denied
          }
        >
          {isLoading ? (
            <Spinner className="pw-w-4 pw-h-4" />
          ) : (
            translate('components>advanceButton>continue')
          )}
        </AuthButton>
      </form>
    </FormProvider>
  );
};

export const FormCompleteKYCWithoutLayout = ({
  userId,
  contextSlug,
  renderSubtitle,
  profilePage,
  userKycStatus,
}: Props) => (
  <TranslatableComponent>
    <_FormCompleteKYCWithoutLayout
      userId={userId}
      contextSlug={contextSlug}
      renderSubtitle={renderSubtitle}
      profilePage={profilePage}
      userKycStatus={userKycStatus}
    />
  </TranslatableComponent>
);
