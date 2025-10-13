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
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        onChange={handleUpload}
        className="border p-2 rounded-md cursor-pointer"
        disabled={isUploading}
      />

      {isUploading && (
        <progress value={progress} max={100} className="w-64" />
      )}

      {fileUrl && (
        <div className="mt-4 text-center">
          <p className="text-green-600 font-medium">✅ Uploaded Successfully!</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View File
          </a>
        </div>
      )}
    </div>
  );
}
