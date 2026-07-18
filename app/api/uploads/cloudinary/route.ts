import { NextRequest } from "next/server";

import { env } from "@/lib/env";
import { errorResponse, successResponse } from "@/lib/http";

export const dynamic = "force-dynamic";

function getCloudinaryCloudName() {
  return env.CLOUDINARY_CLOUD_NAME ?? env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return errorResponse("Invalid upload payload.", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return errorResponse("Missing upload file.", 400);
  }

  if (file.size <= 0) {
    return errorResponse("Empty upload file.", 400);
  }

  if (file.size > 20 * 1024 * 1024) {
    return errorResponse("File is too large. Please upload a file smaller than 20 MB.", 413);
  }

  const cloudName = getCloudinaryCloudName();
  if (!cloudName) {
    return errorResponse("Cloudinary cloud name is not configured.", 500);
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const payload = new FormData();
  payload.append("file", file);

  const folder = String(formData.get("folder") ?? "").trim();
  if (folder) {
    payload.append("folder", folder);
  }

  const canUseBasicAuth = Boolean(env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
  if (canUseBasicAuth) {
    const credentials = Buffer.from(`${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}`).toString("base64");
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      body: payload,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return errorResponse(data?.error?.message ?? "Cloudinary upload failed.", response.status, data);
    }

    return successResponse({
      secureUrl: data.secure_url,
      publicId: data.public_id,
      resourceType: data.resource_type,
      width: data.width,
      height: data.height,
      bytes: data.bytes,
      format: data.format,
      originalFilename: data.original_filename,
    });
  }

  const uploadPreset = env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!uploadPreset) {
    return errorResponse("Cloudinary upload preset is not configured.", 500);
  }

  payload.append("upload_preset", uploadPreset);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: payload,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return errorResponse(data?.error?.message ?? "Cloudinary upload failed.", response.status, data);
  }

  return successResponse({
    secureUrl: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    width: data.width,
    height: data.height,
    bytes: data.bytes,
    format: data.format,
    originalFilename: data.original_filename,
  });
}
