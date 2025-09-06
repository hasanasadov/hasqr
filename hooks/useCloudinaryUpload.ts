"use client";
import { useCallback, useState } from "react";

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const canUpload = Boolean(cloudName && preset);

  const upload = useCallback(
    (file: File) => {
      return new Promise<string>((resolve, reject) => {
        setError(null);
        if (!canUpload) {
          setError("Cloudinary konfiqurasiyası tapılmadı.");
          reject(new Error("Missing Cloudinary env"));
          return;
        }
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", preset as string);

        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
        );

        setUploading(true);
        setProgress(0);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setProgress(Math.round((e.loaded * 100) / e.total));
        };
        xhr.onload = () => {
          setUploading(false);
          try {
            const res = JSON.parse(xhr.responseText);
            if (res.secure_url) return resolve(res.secure_url);
            setError("Yükləmə uğursuz oldu.");
            reject(new Error("Upload failed"));
          } catch (err) {
            setError("Gözlənilməyən cavab.");
            reject(err);
          }
        };
        xhr.onerror = () => {
          setUploading(false);
          setError("Şəbəkə xətası baş verdi.");
          reject(new Error("Network error"));
        };
        xhr.send(form);
      });
    },
    [canUpload, cloudName, preset]
  );

  return { upload, uploading, progress, error, setError, canUpload };
}
