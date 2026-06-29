import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

function ensureCloudinaryConfig() {
  if (isConfigured) {
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary environment variables");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  isConfigured = true;
}

export function getCloudinary() {
  ensureCloudinaryConfig();
  return cloudinary;
}

export function getCloudinaryBaseFolder() {
  return process.env.CLOUDINARY_FOLDER || "gsbconnect/startup";
}

export type CloudinarySubfolder = "events" | "team" | "gallery" | "webinars" | "general";

export function getCloudinaryFolder(subfolder?: string) {
  const base = getCloudinaryBaseFolder();

  if (!subfolder) {
    return base;
  }

  if (subfolder.startsWith(base)) {
    return subfolder;
  }

  return `${base}/${subfolder.replace(/^\/+/, "")}`;
}

export async function destroyCloudinaryImage(publicId: string) {
  try {
    await getCloudinary().uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("Failed to delete Cloudinary image:", publicId, error);
  }
}
