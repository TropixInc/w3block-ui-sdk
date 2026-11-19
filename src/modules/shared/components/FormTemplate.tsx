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
import classNames from 'classnames';

import { Alert } from './Alert';
import { BaseButton } from './Buttons';
import { SmartInputsController } from './SmartInputsController';
import { Spinner } from './Spinner';
import { DefinitionList } from './ui/DefinitionList';
import { UI } from './ui/tokens';
import useTranslation from '../hooks/useTranslation';

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
  /** The caller already shows the status (profile page). */
  hideStatusAlert?: boolean;
  /**
   * Render the answers as a label/value list instead of disabled inputs
   * (approved context on the profile page). Empty answers are left out.
   */
  readView?: boolean;
}

const stripLabel = (label?: string | null) =>
  String(label ?? '')
    .replace(/[\s:*]+$/, '')
    .trim();

const optionLabel = (item: TenantInputEntityDto, raw: string) => {
  const options = ((item as any)?.options ?? []) as Array<any>;
  const found = options.find((option) =>
    typeof option === 'string' ? option === raw : option?.value === raw
  );
  if (!found) return raw;
  return typeof found === 'string' ? found : found.label ?? raw;
};

const formatDate = (raw: string) => {
  const date = new Date(raw);
  return Number.isNaN(date.getTime())
    ? raw
    : date.toLocaleDateString(undefined, { timeZone: 'UTC' });
};

/** Human-readable answer of one input, or `null` when nothing was filled. */
const readAnswer = (
  item: TenantInputEntityDto,
  doc: DocumentEntityDto | undefined,
  yes: string,
  no: string,
  fileLabel: string
): ReactNode => {
  if (!doc) return null;
  if (
    item.type === DataTypesEnum.Separator ||
    item.type === DataTypesEnum.Iframe
  )
    return null;
  const link = (doc as any)?.asset?.directLink as string | undefined;
  if (link) {
    return (
      <a href={link} target="_blank" rel="noreferrer" className={UI.link}>
        {fileLabel}
      </a>
    );
  }
  const simple = (doc as any)?.simpleValue;
  if (simple !== undefined && simple !== null && String(simple).trim() !== '') {
    const raw = String(simple).trim();
    switch (item.type) {
      case DataTypesEnum.Checkbox:
        return raw === 'true' ? yes : raw === 'false' ? no : raw;
      case DataTypesEnum.SimpleSelect:
      case DataTypesEnum.DynamicSelect:
        return optionLabel(item, raw);
      case DataTypesEnum.Birthdate:
      case DataTypesEnum.Date:
        return formatDate(raw);
      default:
        return raw;
    }
  }
  const complex = (doc as any)?.complexValue;
  if (complex && typeof complex === 'object') {
    return describeComplex(complex);
  }
  return null;
};

/** Keys that carry the human-readable part of a complex answer (places, addresses, products). */
const DESCRIPTIVE_KEYS = [
  'name',
  'description',
  'formattedAddress',
  'formatted_address',
  'label',
  'address',
  'street',
  'number',
  'complement',
  'district',
  'city',
  'state',
  'country',
  'zipCode',
  'postalCode',
  'countryCode',
  'areaCode',
  'phone',
];

/** Opaque ids (placeId, hashes) read like noise: long, no spaces. */
const looksLikeId = (value: string) =>
  value.length > 20 &&
  !/\s/.test(value) &&
  /[A-Za-z]/.test(value) &&
  /\d|_|-/.test(value);

const describeComplex = (complex: Record<string, unknown>): string | null => {
  // Places inputs store "Name - formatted address" in `home`.
  if (typeof complex.home === 'string' && complex.home.trim()) {
    return complex.home.trim();
  }
  const direct = DESCRIPTIVE_KEYS.map((key) => complex[key])
    .filter(
      (part): part is string | number =>
        (typeof part === 'string' && part.trim() !== '') ||
        typeof part === 'number'
    )
    .map((part) => String(part).trim());
  if (direct.length) {
    // `name` + `description` cover places; address-like objects list their parts.
    return Array.from(new Set(direct)).join(', ');
  }
  const parts = Object.values(complex)
    .map((part) =>
      typeof part === 'object' && part ? Object.values(part as object) : part
    )
    .flat()
    .filter((part) => typeof part === 'string' || typeof part === 'number')
    .map((part) => String(part).trim())
    .filter((part) => part && !looksLikeId(part));
  return parts.length ? Array.from(new Set(parts)).join(', ') : null;
};

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
  hideStatusAlert,
  readView,
}: Props) => {
  const isInitial = typeof formState === 'string' && formState === 'initial';
  const [translate] = useTranslation();

  const readItems = useMemo(() => {
    if (!readView) return [];
    const yes = translate('shared>yes');
    const no = translate('shared>no');
    const fileLabel = translate('shared>formTemplate>viewFile');
    return (tenantInputs ?? [])
      .map((item) => ({
        term: stripLabel(item.label),
        value: readAnswer(
          item,
          getDocumentByInputId(item?.id),
          yes,
          no,
          fileLabel
        ),
      }))
      .filter((entry) => entry.value !== null && entry.value !== '');
  }, [readView, tenantInputs, getDocumentByInputId, translate]);
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

  if (readView) {
    return readItems.length ? (
      <DefinitionList items={readItems} />
    ) : (
      <p className={classNames('pw-m-0 pw-text-[13px]', UI.textMuted)}>
        {translate('shared>formTemplate>nothingFilled')}
      </p>
    );
  }

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
      {!hideStatusAlert &&
      (statusContext === UserContextStatus.Approved ||
        statusContext === UserContextStatus.Denied) ? (
        <div>
          <Alert>{translate('shared>formTemplate>formApprovedNotEdit')}</Alert>
        </div>
      ) : null}
      {hideContinue || readonly || disableButton ? null : (
        <BaseButton
          type="submit"
          className="pw-mt-5"
          fullWidth
          disabled={
            buttonDisabled ||
            statusContext === UserContextStatus.Approved ||
            statusContext === UserContextStatus.Denied
          }
        >
          {isLoading ? (
            <Spinner className="!pw-w-4 !pw-h-4 !pw-border-2" />
          ) : keyPage ? (
            translate('shared>formTemplate>save')
          ) : (
            translate('components>advanceButton>continue')
          )}
        </BaseButton>
      )}
    </form>
  );
};
