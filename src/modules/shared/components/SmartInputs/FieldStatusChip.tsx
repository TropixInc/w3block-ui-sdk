import { UserDocumentStatus } from '@w3block/sdk-id';

import useTranslation from '../../hooks/useTranslation';

interface FieldStatusChipProps {
  status?: UserDocumentStatus;
}

const STATUS_STYLES: Record<
  UserDocumentStatus,
  { label: string; className: string }
> = {
  [UserDocumentStatus.Approved]: {
    label: 'shared>KYCStatys>approved',
    className: 'pw-text-[#0e9f6e] pw-bg-[#e7f7f0]',
  },
  [UserDocumentStatus.Denied]: {
    label: 'shared>KYCStatys>denied',
    className: 'pw-text-[#e23b3e] pw-bg-[#fdecec]',
  },
  [UserDocumentStatus.RequiredReview]: {
    label: 'shared>KYCStatys>requiredReview',
    className: 'pw-text-[#3b7ddd] pw-bg-[#eaf1fc]',
  },
  [UserDocumentStatus.Created]: {
    label: 'shared>KYCStatys>created',
    className: 'pw-text-[#d9920a] pw-bg-[#fdf5e6]',
  },
};

/**
 * Per-field KYC moderation status (Approved / RequiredReview / Denied /
 * Created). Distinct from InputStatus, which only reflects client-side
 * validation. Rendered on the admin review surface (keyPage) so each field's
 * moderation state is visible at a glance.
 */
const FieldStatusChip = ({ status }: FieldStatusChipProps) => {
  const [translate] = useTranslation();

  if (!status) return null;

  const style = STATUS_STYLES[status];
  if (!style) return null;

  return (
    <span
      className={`pw-inline-flex pw-items-center pw-rounded-md pw-px-2 pw-py-[2px] pw-text-[10px] pw-font-semibold pw-whitespace-nowrap ${style.className}`}
    >
      {translate(style.label)}
    </span>
  );
};

export default FieldStatusChip;
