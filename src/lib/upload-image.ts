import type { CloudinarySubfolder } from "@/lib/cloudinary";

export type UploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
};

export async function uploadImage(
  file: File,
  folder: CloudinarySubfolder = "general",
): Promise<UploadResult> {
  const payload = new FormData();
  payload.append("file", file);
  payload.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: payload,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Image upload failed");
  }

  return result;
}
