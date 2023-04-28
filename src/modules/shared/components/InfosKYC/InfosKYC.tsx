import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DocumentDto } from '@w3block/sdk-id';

import { useGetTenantInputsBySlug } from '../../hooks/useGetTenantInputs/useGetTenantInputsBySlug';
import { useGetUsersDocuments } from '../../hooks/useGetUsersDocuments';
import { Alert } from '../Alert';
import SmartInputsController from '../SmartInputsController';
import { Spinner } from '../Spinner';

interface InfosProps {
  contextId: string;
  contextName: string;
  userId: string;
}

const InfosKYC = ({ contextId, contextName, userId }: InfosProps) => {
  const [translate] = useTranslation();
  const { data: tenantInputs, isError: isErrorInputs } =
    useGetTenantInputsBySlug({
      slug: contextName,
    });
  const {
    data: documents,
    isLoading,
    isError,
  } = useGetUsersDocuments({
    userId: userId ?? '',
    contextId: contextId ?? '',
  });

  const dynamicMethods = useForm<DocumentDto>({
    mode: 'onChange',
  });

  function getDocumentByInputId(inputId: string) {
    return documents?.data.find((doc) => doc.inputId === inputId);
  }

  return (
    <div className="pw-mt-6 pw-w-full pw-flex pw-flex-col pw-gap-[34px] pw-items-start pw-bg-white pw-rounded-[20px] pw-shadow-[2px_2px_10px] pw-shadow-[#00000014] pw-p-[34px]">
      <FormProvider {...dynamicMethods}>
        <p className="pw-text-2xl pw-font-semibold pw-font-poppins">
          KYC - {contextName}
        </p>
        <div className="pw-w-full">
          {isErrorInputs || isError ? (
            <Alert
              className="pw-w-full pw-flex pw-justify-center"
              variant="error"
            >
              <Alert.Icon />
              <p className="pw-ml-4">
                {translate('shared>InfosKYC>errorRequest')}
              </p>
            </Alert>
          ) : isLoading ? (
            <Spinner />
          ) : (
            <div className="pw-w-full">
              {tenantInputs?.data?.map(({ type, label, id }) => (
                <SmartInputsController
                  key={id}
                  type={type}
                  label={label}
                  name={id}
                  assetId={getDocumentByInputId(id)?.assetId}
                  value={getDocumentByInputId(id)?.value}
                  docStatus={getDocumentByInputId(id)?.status}
                  docFileValue={
                    getDocumentByInputId(id)?.asset?.directLink ?? ''
                  }
                  openDocs
                />
              ))}
            </div>
          )}
        </div>
      </FormProvider>
    </div>
  );
};

export default InfosKYC;
