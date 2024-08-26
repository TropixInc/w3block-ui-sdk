/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, ReactNode, SetStateAction } from 'react';

import {
  DocumentEntityDto,
  TenantInputEntityDto,
  UserContextStatus,
} from '@w3block/sdk-id';
import classNames from 'classnames';

import { AuthButton } from '../../../auth/components/AuthButton';
import { Alert } from '../Alert';
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
  formState?: string;
  inputRequestable?: boolean;
  inputsIdRequestReview?: Array<string>;
  onChangeInputsIdRequestReview?: (value: Array<string>) => void;
  keyPage?: boolean;
  profilePage?: boolean;
  statusContext?: UserContextStatus;
  hideComplexPhone?: boolean;
  hideContinue?: boolean;
  readonly?: boolean;
}

export const FormTemplate = ({
  isLoading,
  buttonDisabled,
  onSubmit,
  tenantInputs,
  setUploadProgress,
  getDocumentByInputId,
  children,
  formState,
  inputRequestable,
  inputsIdRequestReview,
  onChangeInputsIdRequestReview,
  keyPage,
  profilePage,
  statusContext,
  hideComplexPhone,
  hideContinue,
  readonly,
}: Props) => {
  const isInitial = typeof formState === 'string' && formState === 'initial';

  return (
    <form onSubmit={onSubmit}>
      <div
        className={classNames(
          keyPage ? 'pw-grid pw-grid-cols-2 pw-gap-x-6' : ''
        )}
      >
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
                  assetId={isInitial ? undefined : doc?.assetId}
                  simpleValue={isInitial ? undefined : doc?.simpleValue}
                  complexValue={isInitial ? undefined : doc?.complexValue}
                  docStatus={isInitial ? undefined : doc?.status}
                  docFileValue={
                    isInitial ? undefined : doc?.asset?.directLink ?? ''
                  }
                  onChangeUploadProgess={setUploadProgress}
                  selectData={item.data}
                  inputRequestable={inputRequestable}
                  inputsIdRequestReview={inputsIdRequestReview}
                  onChangeInputsIdRequestReview={onChangeInputsIdRequestReview}
                  profilePage={profilePage}
                  isKeyPage={keyPage}
                  required={item.mandatory}
                  statusContext={statusContext}
                  hideComplexPhone={hideComplexPhone}
                  readonly={readonly}
                />
              </div>
            );
          })}
      </div>

      {children}
      {statusContext === UserContextStatus.Approved ||
      statusContext === UserContextStatus.Denied ? (
        <div>
          <Alert>
            Formulários aprovados ou reprovados não podem ser editados. Por
            favor, clique em solicitar revisão para realizar uma nova edição
          </Alert>
        </div>
      ) : null}
      {hideContinue ? null : (
        <AuthButton
          type="submit"
          className="pw-w-full pw-mt-5 pw-flex pw-items-center pw-justify-center"
          disabled={
            buttonDisabled ||
            statusContext === UserContextStatus.Approved ||
            statusContext === UserContextStatus.Denied
          }
        >
          {isLoading ? (
            <Spinner className="!pw-w-4 !pw-h-4 !pw-border-2" />
          ) : keyPage ? (
            'Salvar'
          ) : (
            'Continuar'
          )}
        </AuthButton>
      )}
    </form>
  );
};
