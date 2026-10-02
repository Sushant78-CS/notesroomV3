import axios from "axios";

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  original_filename?: string;
  bytes?: number;
  format?: string;
}

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!cloudName) {
  console.warn("VITE_CLOUDINARY_CLOUD_NAME is not configured.");
}

if (!uploadPreset) {
  console.warn("VITE_CLOUDINARY_UPLOAD_PRESET is not configured.");
}

export async function uploadFileToCloudinary(
  file: File,
): Promise<CloudinaryUploadResponse> {
  if (!cloudName) {
    throw new Error("Cloudinary cloud name is missing.");
  }

  if (!uploadPreset) {
    throw new Error("Cloudinary upload preset is missing.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const response = await axios.post<CloudinaryUploadResponse>(
    uploadUrl,
    formData,
  );

  return response.data;
}
