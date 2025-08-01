

import { useMutation } from '@tanstack/react-query';
import { AssetEntityWithProviderUploadParamsDto } from '@w3block/sdk-id';
import axios from 'axios';
import { getEnvVar } from '../utils/env';

interface UploadFileConfig {
  onProgress?: (event: ProgressEvent) => void;
  abortController?: AbortController;
}

interface CloudinaryTransformation {
  transformation: string;
  width: number;
  height: number;
  url: string;
  secure_url: string;
}

export interface CloudinaryUploadFileResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  recourse_type: string;
  created_at: string;
  tags: Array<string>;
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  eager: Array<CloudinaryTransformation>;
}

export interface UploadFromSaleOrderConfig {
  apiKey: string;
  timestamp: number;
  signature: string;
  publicId: string;
  filename_override: string;
  unique_filename: string;
  video_url?: string;
}

interface UploadProps {
  assets: AssetEntityWithProviderUploadParamsDto;
  file: File;
  config: UploadFileConfig;

  saleOrderConfig?: UploadFromSaleOrderConfig;
}

export const useUploadFileToCloudinary = () => {
  const formData = new FormData();
  const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  console.log(cloudinaryName, "cloudinaryName")
  return useMutation(
    [
      `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`,
    ],
    ({ file, config = {}, assets, saleOrderConfig }: UploadProps) => {
      if (saleOrderConfig && file) {
        formData.append(
          'file',
          saleOrderConfig.video_url ? saleOrderConfig.video_url : file
        );
        formData.append('timestamp', saleOrderConfig.timestamp.toString());
        formData.append('public_id', saleOrderConfig.publicId);
        formData.append('api_key', saleOrderConfig.apiKey);
        formData.append('signature', saleOrderConfig.signature);
        formData.append('filename_override', saleOrderConfig.filename_override);
        formData.append('unique_filename', saleOrderConfig.unique_filename);
      } else {
        if (assets && file) {
          const {
            apiKey,
            publicId,
            signature,
            timestamp,
            uploadPreset,
            queryParams,
          } = assets.providerUploadParams;
          formData.append('api_key', apiKey);
          formData.append('timestamp', timestamp.toString());
          formData.append('signature', signature);
          formData.append('public_id', publicId);
          if (uploadPreset) {
            formData.append('upload_preset', uploadPreset as string);
          }

          formData.append(
            'filename_override',
            queryParams?.filename_override?.toString()
          );

          formData.append(
            'unique_filename',
            queryParams?.unique_filename?.toString()
          );
          formData.append('file', file);
        }
      }
      return axios
        .post<CloudinaryUploadFileResponse>(
          `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`,
          formData,
          {
            signal: config.abortController?.signal,
            onUploadProgress: config.onProgress as any,
          }
        )
        .then((res) => res);
    }
  );
};
