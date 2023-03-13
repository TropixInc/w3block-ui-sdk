import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { DocumentDto } from '@w3block/sdk-id';
import { object } from 'yup';

import { useRouterConnect } from '../../../shared';
import SmartInputsController from '../../../shared/components/SmartInputsController';
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
}

const _FormCompleteKYCWithoutLayout = ({ userId }: Props) => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const { mutate, isSuccess } = usePostUsersDocuments();
  const { companyId: tenantId } = useCompanyConfig();
  const [validForm, setValidForm] = useState<boolean>(false);

  const { data: tenantInputs } = useGetTenantInputsBySlug();

  const { data: documents } = useGetUsersDocuments({
    userId: userId ?? '',
    contextId: tenantInputs?.data[0].contextId ?? '',
  });

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
    if (tenantInputs?.data?.length && userId) {
      const { contextId } = tenantInputs.data[0];
      mutate({
        tenantId,
        contextId,
        userId,
        documents: {
          documents: Object.values(dynamicValues),
        },
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      router.pushConnect(PixwayAppRoutes.CONNECT_EXTERNAL_WALLET);
    }
  }, [isSuccess]);

  useEffect(() => {
    const values = dynamicMethods.getValues();
    const documents = Object.values(values);
    const isVallidForm = documents.every((obj) => obj !== undefined);
    setValidForm(isVallidForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicMethods.watch()]);

  function getDocumentByInputId(inputId: string) {
    return documents?.data.find((doc) => doc.inputId === inputId);
  }

  function getInputByInputId(inputId: string) {
    const inputs = tenantInputs?.data.filter((input) => input.id === inputId);

    return inputs?.map(({ label, id }) => {
      return (
        <p key={id} className="pw-text-[#FF0505]">
          {label}
        </p>
      );
    });
  }

  return (
    <FormProvider {...dynamicMethods}>
      {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
      {/*@ts-ignore*/}
      {reasons?.data?.items[0]?.logs?.at(-1)?.inputIds?.length > 0 ? (
        <div className="pw-mb-4 pw-p-3 pw-bg-red-100 pw-w-full pw-rounded-lg">
          <p className="pw-mb-2 pw-text-[#FF0505]">
            {translate('auth>formCompletKYCWithoutLayout>reviewData')}
          </p>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/*@ts-ignore*/}
          {reasons?.data.items[0]?.logs.at(-1)?.inputIds.map((item: string) => {
            return getInputByInputId(item);
          })}

          <p className="pw-mt-2 pw-text-[#FF0505]">
            {reasons?.data.items[0]?.logs.at(-1)?.reason}
          </p>
        </div>
      ) : null}
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
            />
          ))}
        <AuthButton
          type="submit"
          className="pw-w-full pw-mt-5"
          disabled={!validForm}
        >
          {translate('components>advanceButton>continue')}
        </AuthButton>
      </form>
    </FormProvider>
  );
};

export const FormCompleteKYCWithoutLayout = ({ userId }: Props) => (
  <TranslatableComponent>
    <_FormCompleteKYCWithoutLayout userId={userId} />
  </TranslatableComponent>
);
