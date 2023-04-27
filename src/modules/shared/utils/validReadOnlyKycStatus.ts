import { UserDocumentStatus } from '@w3block/sdk-id';

export function validateIfStatusKycIsReadonly(
  status: UserDocumentStatus
): boolean {
  return [UserDocumentStatus.Approved, UserDocumentStatus.Denied].includes(
    status
  );
}
