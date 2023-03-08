import { useMutation } from 'react-query';

import { AttachDocumentsToUser } from '@w3block/sdk-id';

import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';

interface Params {
  tenantId: string;
  userId: string;
  contextId: string;
  documents: AttachDocumentsToUser;
}

export const usePostUsersDocuments = () => {
  const getSDK = useGetW3blockIdSDK();

  return useMutation(
    [],
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
