import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { DocumentDto } from '@w3block/sdk-id';
import { object } from 'yup';

import SmartInputsController from '../../../shared/components/SmartInputsController';
import TranslatableComponent from '../../../shared/components/TranslatableComponent';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { useGetTenantInputsBySlug } from '../../../shared/hooks/useGetTenantInputs/useGetTenantInputsBySlug';
import { useGetUsersDocuments } from '../../../shared/hooks/useGetUsersDocuments';
import { usePostUsersDocuments } from '../../../shared/hooks/usePostUsersDocuments/usePostUsersDocuments';
import useTranslation from '../../../shared/hooks/useTranslation';
import { createSchemaSignupForm } from '../../../shared/utils/createSchemaSignupForm';
import { useGetValidationsTypesForSignup } from '../../../shared/utils/useGetValidationsTypesForSignup';
import { AuthButton } from '../AuthButton';

interface Props {
  userId: string;
}

const _FormCompleteKYCWithoutLayout = ({ userId }: Props) => {
  const [translate] = useTranslation();
  const { mutate } = usePostUsersDocuments();
  const { companyId: tenantId } = useCompanyConfig();
  const [validForm, setValidForm] = useState<boolean>(false);

  const tenantInputs = useGetTenantInputsBySlug();

  const { data: documents } = useGetUsersDocuments({
    userId: userId ?? '',
    contextId: tenantInputs.data?.data[0].contextId ?? '',
  });

  const validations = useGetValidationsTypesForSignup(
    tenantInputs?.data?.data ?? []
  );
  const yupSchema = createSchemaSignupForm(validations);

  const dynamicSchema = object().shape(yupSchema);

  const dynamicMethods = useForm<DocumentDto>({
    mode: 'onChange',
    resolver: yupResolver(dynamicSchema),
  });

  const onSubmit = () => {
    const dynamicValues = dynamicMethods.getValues();
    if (tenantInputs.data?.data?.length && userId) {
      const { contextId } = tenantInputs.data.data[0];
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
    const values = dynamicMethods.getValues();
    const documents = Object.values(values);
    const isVallidForm = documents.every((obj) => obj !== undefined);
    setValidForm(isVallidForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicMethods.watch()]);

  function getDocumentByInputId(inputId: string) {
    return documents?.data.find((doc) => doc.inputId === inputId);
  }

  return (
    <FormProvider {...dynamicMethods}>
      <form onSubmit={dynamicMethods.handleSubmit(onSubmit)}>
        {tenantInputs?.data?.data &&
          tenantInputs?.data?.data.map((item) => (
            <SmartInputsController
              key={item.id}
              label={item.label}
              name={item.id}
              type={item.type}
              assetId={getDocumentByInputId(item?.id)?.assetId}
              value={getDocumentByInputId(item?.id)?.value}
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
