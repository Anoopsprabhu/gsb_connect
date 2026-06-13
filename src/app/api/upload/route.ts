import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { UploadApiResponse } from "cloudinary";
import { getCloudinary, getCloudinaryFolder } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("admin_auth")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadFolder = getCloudinaryFolder(
      typeof folder === "string" ? folder : undefined,
    );

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = getCloudinary().uploader.upload_stream(
        {
          folder: uploadFolder,
          resource_type: "image",
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Upload failed"));
            return;
          }

          resolve(uploadResult);
        },
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
