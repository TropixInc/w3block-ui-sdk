/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  DataTypesEnum,
  DocumentEntityDto,
  TenantInputEntityDto,
  UserContextStatus,
} from '@w3block/sdk-id';

import useTranslation from '../../hooks/useTranslation';
import { Alert } from '../Alert';
import { BaseButton } from '../Buttons';
import { SmartInputsController } from '../SmartInputsController';
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
  const [translate] = useTranslation();
  const [completed, setCompleted] = useState(false);
  const handleMessage = useCallback((e: MessageEvent<any>) => {
    if (e.data === 'form-completed') {
      setCompleted(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  const disableButton = useMemo(() => {
    const hasIframe = tenantInputs?.some(
      (item) => item.type === DataTypesEnum.Iframe
    );
    return hasIframe && !completed;
  }, [completed, tenantInputs]);

  return (
    <form onSubmit={onSubmit}>
      <div className="pw-flex pw-flex-col pw-gap-4">
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
                  openDocs={!!doc?.asset?.directLink}
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
          <Alert>{translate('shared>formTemplate>formApprovedNotEdit')}</Alert>
        </div>
      ) : null}
      {hideContinue || readonly ? null : (
        <BaseButton
          type="submit"
          className="pw-mt-5"
          fullWidth
          disabled={
            buttonDisabled ||
            disableButton ||
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
        </BaseButton>
      )}
    </form>
  );
};
