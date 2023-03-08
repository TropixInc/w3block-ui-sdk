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
import { createSchemaSignupForm } from '../../../shared/utils/createSchemaSignupForm';
import { getValidationsTypesForSignup } from '../../../shared/utils/getValidationsTypesForSignup';
import { AuthButton } from '../AuthButton';

interface Props {
  userId: string;
}

const _FormCompleteKYCWithoutLayout = ({ userId }: Props) => {
  const { mutate } = usePostUsersDocuments();
  const { companyId: tenantId } = useCompanyConfig();
  const [validForm, setValidForm] = useState<boolean>(false);

  const tenantInputs = useGetTenantInputsBySlug();

  const { data: documents } = useGetUsersDocuments({
    userId: userId ?? '',
    contextId: tenantInputs.data?.data[0].contextId ?? '',
  });

  const validations = getValidationsTypesForSignup(
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

    const arrayValues = Object.values(dynamicValues);

    if (tenantInputs.data?.data && userId)
      mutate({
        tenantId,
        contextId: tenantInputs.data?.data[0].contextId,
        userId: userId,
        documents: {
          documents: arrayValues,
        },
      });
  };

  useEffect(() => {
    const values = dynamicMethods.getValues();
    const arrayValues = Object.values(values);

    if (arrayValues.every((obj) => obj !== undefined)) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [dynamicMethods.watch()]);

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
              assetId={
                documents?.data.find((doc) => doc.inputId === item.id)
                  ? documents?.data.find((doc) => doc.inputId === item.id)
                      ?.assetId
                  : ''
              }
              value={
                documents?.data.find((doc) => doc.inputId === item.id)
                  ? documents?.data.find((doc) => doc.inputId === item.id)
                      ?.value
                  : ''
              }
            />
          ))}
        <AuthButton
          type="submit"
          className="pw-w-full pw-mt-5"
          disabled={!validForm}
        >
          Continuar
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
