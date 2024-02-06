/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, ReactNode, SetStateAction } from 'react';

import { DocumentEntityDto, TenantInputEntityDto } from '@w3block/sdk-id';

import { AuthButton } from '../../../auth/components/AuthButton';
import SmartInputsController from '../SmartInputsController';
import { Spinner } from '../Spinner';

interface Props {
  isLoading: boolean;
  buttonDisabled: boolean;
  onSubmit(): void;
  tenantInputs: TenantInputEntityDto[];
  setUploadProgress: Dispatch<SetStateAction<boolean>>;
  getDocumentByInputId(inputId: string): DocumentEntityDto | undefined;
  children?: ReactNode;
}

export const FormTemplate = ({
  isLoading,
  buttonDisabled,
  onSubmit,
  tenantInputs,
  setUploadProgress,
  getDocumentByInputId,
  children,
}: Props) => {
  return (
    <form onSubmit={onSubmit}>
      {tenantInputs &&
        tenantInputs?.map((item) => {
          const doc = getDocumentByInputId(item?.id);
          return (
            <div
              key={item.id}
              style={{
                width:
                  item?.data && (item?.data as any)['width']
                    ? (item?.data as any)['width']
                    : '100%',
              }}
            >
              <SmartInputsController
                key={item.id}
                label={item.label}
                name={item.id}
                type={item.type}
                options={item.options}
                autofill={(item.data as any)?.autofill}
                assetId={doc?.assetId}
                simpleValue={doc?.simpleValue}
                complexValue={doc?.complexValue}
                docStatus={doc?.status}
                docFileValue={doc?.asset?.directLink ?? ''}
                onChangeUploadProgess={setUploadProgress}
                selectData={item.data}
              />
            </div>
          );
        })}
      {children}
      <AuthButton
        type="submit"
        className="pw-w-full pw-mt-5 pw-flex pw-items-center pw-justify-center"
        disabled={buttonDisabled}
      >
        {isLoading ? (
          <Spinner className="!pw-w-4 !pw-h-4 !pw-border-2" />
        ) : (
          'Continuar'
        )}
      </AuthButton>
    </form>
  );
};
