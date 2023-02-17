import { useMutation } from 'react-query';

import {
  AssetTargetEnum,
  AssetTypeEnum,
  W3blockDirectorySDK,
} from '@w3block/sdk-directory';

import { PixwayAPIRoutes } from '../../enums/PixwayAPIRoutes';
import { useGetW3blockIdSDK } from '../useGetW3blockIdSDK';
import { usePixwayAPIURL } from '../usePixwayAPIURL/usePixwayAPIURL';
import useRouter from '../useRouter';

export const useSignedCloudinaryUrl = () => {
  const router = useRouter();
  const { tenantId } = router.query;
  const { w3blockIdAPIUrl } = usePixwayAPIURL();
  const getW3blockIdSDK = useGetW3blockIdSDK();

  return useMutation([PixwayAPIRoutes.GET_SIGNED_CLOUDINARY_URL], async () => {
    const sdkId = await getW3blockIdSDK();

    const sdk = new W3blockDirectorySDK({
      idSdk: sdkId,
      baseURL: w3blockIdAPIUrl,
    });
    return sdk.api.assets.requestUpload(tenantId as string, {
      type: AssetTypeEnum.Image,
      target: AssetTargetEnum.UserDocument,
    });
  });
};
