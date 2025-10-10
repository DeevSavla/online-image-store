"use client";
import React, { useState } from "react";
import { authenticator } from "../../../lib/authenticator";
import { upload } from "@imagekit/next";

export default function FileUpload() {
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string>("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
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
    } else {
      console.error("No URL returned from ImageKit response:", response);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <input type="file" onChange={handleUpload} className="border p-2" />
      <progress value={progress} max={100} className="w-64" />
      {fileUrl && (
        <div className="mt-4 text-center">
          <p>✅ Uploaded Successfully!</p>
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
