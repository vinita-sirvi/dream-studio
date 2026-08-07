import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api-auth";
import { env } from "@/lib/env";
import { errorResponse, successResponse } from "@/lib/http";
import { enforceRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function getCloudinaryCloudName() {
  return env.CLOUDINARY_CLOUD_NAME ?? env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
}

/**
 * Media types this endpoint will forward.
 *
 * Cloudinary is called on the `auto` resource type, which happily accepts
 * arbitrary files — including HTML and SVG, which are script-bearing and would be
 * served from the CDN domain. Only raster images and video are allowed through.
 */
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

/**
 * Upload product media to Cloudinary.
 *
 * This endpoint had no authorization at all. Since it forwards to Cloudinary using
 * this account's own credentials, anyone on the internet could store files there —
 * running up the bill, filling the media library, and hosting content of their
 * choosing on the project's CDN domain. It is admin-only now, rate limited, and
 * restricted to image and video types.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const limited = await enforceRateLimit("upload", auth.session.user.id);
  if (limited) return limited;

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

  if (file.size > MAX_UPLOAD_BYTES) {
    return errorResponse("File is too large. Please upload a file smaller than 20 MB.", 413);
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return errorResponse(
      "Only JPEG, PNG, WebP, AVIF, GIF images and MP4, WebM or MOV video can be uploaded.",
      415,
    );
  }

  const cloudName = getCloudinaryCloudName();
  if (!cloudName) {
    return errorResponse("Cloudinary cloud name is not configured.", 500);
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const payload = new FormData();
  payload.append("file", file);

  // Constrain the folder to a simple path so it cannot traverse into unrelated
  // parts of the Cloudinary account.
  const folder = String(formData.get("folder") ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9/_-]/g, "")
    .replace(/\.{2,}/g, "")
    .replace(/^\/+|\/+$/g, "");

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
