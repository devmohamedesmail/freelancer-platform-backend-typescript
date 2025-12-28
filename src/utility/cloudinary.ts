import { v2 as cloudinary } from 'cloudinary';

export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder?: string;
  original_filename: string;
}

/**
 * Upload a file buffer to Cloudinary
 * @param fileBuffer - Buffer of the file
 * @param folder - Cloudinary folder name
 * @returns CloudinaryUploadResult
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'uploads'
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as CloudinaryUploadResult);
      }
    );
    stream.end(fileBuffer);
  });
};
