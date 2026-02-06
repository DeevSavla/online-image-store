"use client";

import React, { useState } from "react";
import { upload } from "@imagekit/next";
import { authenticator } from "../../../lib/authenticator";

interface FileUploadProps {
  onSuccess?: (fileUrl: string) => void;
}

export default function FileUpload({ onSuccess }: FileUploadProps) {
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      const { signature, expire, token, publicKey } = await authenticator();

      const response = await upload({
        file,
        fileName: file.name,
        signature,
        expire,
        token,
        publicKey,
        onProgress: (evt) => {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      });

      if (response.url) {
        setFileUrl(response.url);
        onSuccess?.(response.url);
      } else {
        console.error("No URL returned from ImageKit response:", response);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-[#E5E7EB] bg-[#F5F7FA] px-4 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-[#111827]">
            Upload preview image
          </p>
          <p className="text-xs text-[#6B7280]">
            JPG or PNG, up to 10MB. We&apos;ll optimize it automatically.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-medium text-[#111827] shadow-sm hover:border-[#2563EB] hover:bg-[#F5F7FA] transition-colors">
          <span>{isUploading ? "Uploading…" : "Choose file"}</span>
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {isUploading && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Uploading</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
            <div
              className="h-full rounded-full bg-[#2563EB] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {fileUrl && (
        <div className="mt-1 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
          <p className="font-medium">Uploaded successfully</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-[11px] font-medium text-green-700 underline underline-offset-2"
          >
            View image
          </a>
        </div>
      )}
    </div>
  );
}
