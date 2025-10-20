import { createBufferFromBase64 } from "@/lib/invoice/create-buffer-from-base64";
import { getImageMimeType } from "@/lib/invoice/get-image-mime";
import { InvoiceImageType } from "@/types/common/invoice";
import { supabaseAdmin, STORAGE_BUCKET } from "./server";
import { v4 as uuidv4 } from "uuid";

export interface SupabaseFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  };
}

export const uploadImage = async (base64: string, userId: string, imageType: InvoiceImageType) => {
  const imageBuffer = createBufferFromBase64(base64);
  const contentType = getImageMimeType(base64);

  if (!contentType) {
    return null;
  }

  const imageKey = `${userId}/${imageType}-${uuidv4()}`;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(imageKey, imageBuffer, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    return null;
  }

  // Get public URL for the uploaded file
  const { data: publicUrlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(imageKey);

  return publicUrlData.publicUrl;
};

export const getUserImages = async (userId: string): Promise<SupabaseFile[]> => {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .list(userId, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    console.error("Supabase list error:", error);
    return [];
  }

  return data || [];
};

export const getUserImagesCount = async (userId: string): Promise<number> => {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .list(userId, {
      limit: 1000, // High limit to count all files
      offset: 0,
    });

  if (error) {
    console.error("Supabase count error:", error);
    return 0;
  }

  return data?.length || 0;
};

export const deleteImage = async (key: string): Promise<boolean> => {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([key]);

  if (error) {
    console.error("Supabase delete error:", error);
    return false;
  }

  return true;
};

export const getSignedUrl = async (key: string, expiresIn: number = 3600): Promise<string | null> => {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(key, expiresIn);

  if (error) {
    console.error("Supabase signed URL error:", error);
    return null;
  }

  return data.signedUrl;
};

export const getPublicUrl = (key: string): string => {
  const { data } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(key);

  return data.publicUrl;
};
