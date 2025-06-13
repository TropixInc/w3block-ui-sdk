import { useMutation } from '@tanstack/react-query';
import { AttachDocumentsToUser } from '@w3block/sdk-id';
import { PixwayAPIRoutes } from '../enums/PixwayAPIRoutes';
import { useGetW3blockIdSDK } from './useGetW3blockIdSDK';

interface Params {
  tenantId: string;
  userId: string;
  contextId: string;
  documents: AttachDocumentsToUser;
  currentStep?: string;
}

export const usePostUsersDocuments = (): any => {
  const getSDK = useGetW3blockIdSDK();

  return useMutation(
    [PixwayAPIRoutes.SAVE_DOCUMENTS_BY_USER],
    async ({ tenantId, userId, contextId, documents }: Params) => {
      const sdk = await getSDK();

      return sdk.api.users.attachDocumentsToUserByContextId(
        tenantId,
        userId,
        contextId,
        documents
      );
    }
  );
};
