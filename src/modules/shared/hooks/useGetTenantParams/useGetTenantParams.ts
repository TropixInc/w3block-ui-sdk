import { W3blockDirectorySDK } from '@w3block/sdk-directory';

import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { useRouterConnect } from '../useRouterConnect';

export const useGetTenantParams = async () => {
  const router = useRouterConnect();

  // eslint-disable-next-line no-unsafe-optional-chaining
  const { tenantId } = router?.query;

  const getW3blockIdSDK = useGetW3blockIdSDK();
  const sdkId = await getW3blockIdSDK();

  const sdk = new W3blockDirectorySDK({
    idSdk: sdkId,
    baseURL: 'https://directory.stg.w3block.io/',
  });

  return await sdk.api.tenantParams.listBy(tenantId as string);
};
