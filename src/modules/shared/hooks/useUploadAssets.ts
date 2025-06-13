import { useMutation } from "@tanstack/react-query";
import { RequestAssetUploadDto } from "@w3block/sdk-id";
import { useGetW3blockIdSDK } from "./useGetW3blockIdSDK";

interface AssetsParams {
  tenantId: string;
  body: RequestAssetUploadDto;
}

const useUploadAssets = (): any => {
  const getSDK = useGetW3blockIdSDK();

  return useMutation(async (payload: AssetsParams) => {
    const sdk = await getSDK();
    return await sdk.api.assets.requestUpload(payload.tenantId, payload.body);
  });
};

export default useUploadAssets;
