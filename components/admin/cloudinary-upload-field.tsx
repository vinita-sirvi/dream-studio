"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;
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

function inferAssetKind(value: string) {
  if (/\/video\//i.test(value) || /\.(mp4|mov|webm|m4v)(\?|$)/i.test(value)) {
    return "video";
  }

  return "image";
}

export function CloudinaryUploadField({
  label,
  value,
  onChange,
  folder,
  accept = "image/*",
  helperText = "Drag and drop a file here or click to upload.",
  compact = false,
  allowClear = true,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  folder: string;
  accept?: string;
  helperText?: string;
  compact?: boolean;
  allowClear?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedKind, setUploadedKind] = useState<string | null>(null);
  const assetKind = uploadedKind ?? (value ? inferAssetKind(value) : null);

  async function uploadFile(file: File) {
    setUploading(true);
    setMessage("");

    try {
      if (file.size > MAX_UPLOAD_SIZE) {
        setMessage("File is too large. Please upload a file smaller than 20 MB.");
        return;
      }

      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        setMessage("Only JPEG, PNG, WebP, AVIF, GIF images and MP4, WebM or MOV video can be uploaded.");
        return;
      }

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) {
        setMessage("Cloudinary upload is not configured.");
        return;
      }

      const payload = new FormData();
      payload.append("upload_preset", uploadPreset);
      if (folder) {
        payload.append("folder", folder);
      }
      payload.append("file", file);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: payload,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setMessage(data?.message ?? "Upload failed. Please try again.");
        return;
      }

      const uploaded = data?.data ?? data;
      onChange(uploaded?.secure_url ?? uploaded?.secureUrl ?? "");
      setUploadedKind(uploaded?.resource_type ?? uploaded?.resourceType ?? inferAssetKind(file.name));
    } catch {
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) {
      return;
    }

    void uploadFile(file);
  }

  const baseShell =
    "rounded-2xl border border-dashed bg-[#eef3f2] transition " +
    (dragActive ? "border-[#b23a17] bg-[#fff1ec]" : "border-[#c3cfce]");

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0f1e1e]">{label}</p>
          <p className="mt-1 text-xs text-[#4a5d5d]">{helperText}</p>
        </div>
        <div className="flex items-center gap-2">
          {value && allowClear ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setMessage("");
                setUploadedKind(null);
              }}
              className="rounded-full border border-[#c3cfce] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#b23a17]"
            >
              Clear
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-[#0b1717] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
          >
            Browse
          </button>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`${baseShell} ${compact ? "p-3" : "p-4"}`}
      >
        {value ? (
          <div className={`grid gap-4 ${compact ? "md:grid-cols-[140px_1fr]" : "md:grid-cols-[180px_1fr]"}`}>
            <div className="overflow-hidden rounded-2xl border border-[#dce4e3] bg-white shadow-[0_10px_24px_rgba(15,30,30,0.08)]">
              {assetKind === "video" ? (
                <video src={value} controls className="h-full min-h-[150px] w-full object-cover" />
              ) : (
                <img src={value} alt="" className="h-full min-h-[150px] w-full object-cover" />
              )}
            </div>
            <div className="flex min-w-0 flex-col justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#0f1e1e]">File uploaded to Cloudinary</p>
                <p className="mt-2 break-all text-xs leading-6 text-[#4a5d5d]">{value}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-full border border-[#c3cfce] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#b23a17]"
                >
                  Replace
                </button>
                <span className="rounded-full bg-[#fff1ec] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#b23a17]">
                  {assetKind ?? "image"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl border border-[#dce4e3] bg-white text-[#b23a17]">
                +
              </div>
              <div>
                <p className="text-sm font-medium text-[#0f1e1e]">Drop your file here</p>
                <p className="mt-1 text-xs text-[#4a5d5d]">Cloudinary will store the asset and return a secure URL automatically.</p>
              </div>
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b23a17]">
              {uploading ? "Uploading..." : "Ready"}
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.currentTarget.value = "";
          }}
        />
      </div>

      {message ? <p className="text-sm text-[#b23a17]">{message}</p> : null}
      {uploading ? <p className="text-sm text-[#b23a17]">Uploading to Cloudinary...</p> : null}
    </div>
  );
}
