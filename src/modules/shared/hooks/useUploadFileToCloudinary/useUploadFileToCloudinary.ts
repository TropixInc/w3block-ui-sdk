import axios from 'axios';

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

export const uploadFileToCloudinary = async (
  file: File,
  token: string,
  config: UploadFileConfig = {},
  saleOrderConfig?: UploadFromSaleOrderConfig
) => {
  const formData = new FormData();
  if (saleOrderConfig) {
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
    const signatureResponse = await getSignedCloudinaryUrl(token);
    const { apiKey, publicId, signature, timestamp, uploadPreset } =
      signatureResponse.data;
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('public_id', publicId);
    formData.append('upload_preset', uploadPreset);
    formData.append('file', file);
  }

  const isVideo = file.type ? file.type.split('/')[0] === 'video' : false;

  return axios.post<CloudinaryUploadFileResponse>(
    `https://api.cloudinary.com/v1_1/${
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    }/${saleOrderConfig?.video_url || isVideo ? 'video/' : 'image/'}upload`,
    formData,
    {
      signal: config.abortController?.signal,
      onUploadProgress: config.onProgress,
    }
  );
};
