"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { cn } from "@/lib/utils";

export default function UploadDropzone({
  onFileUrl,
}: {
  onFileUrl: (url: string) => void;
}) {
  const { upload, uploading, progress, error, setError, canUpload } =
    useCloudinaryUpload();
  const [dragActive, setDragActive] = useState(false);

  async function handleFile(file?: File | null) {
    if (!file) return;
    try {
      const url = await upload(file);
      onFileUrl(url);
    } catch {}
  }

  return (
    <section
      onDragEnter={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFile(e.dataTransfer?.files?.[0]);
      }}
      className={cn(
        "rounded-2xl border-2 border-dashed p-8 text-center transition",
        "border-white/40 bg-white/60 dark:bg-gray-800/50 backdrop-blur shadow-xl",
        dragActive
          ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-900/20"
          : "border-gray-300 dark:border-gray-600"
      )}
      tabIndex={0}
      role="button"
    >
      <input
        id="file-u"
        type="file"
        accept="*/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <label
        htmlFor="file-u"
        className="cursor-pointer select-none flex flex-col items-center text-gray-700 dark:text-gray-300"
      >
        <Upload className="w-10 h-10 text-indigo-600 mb-2" />
        <span className="font-medium">
          {canUpload ? "Fayl seç və ya sürüklə" : "Cloudinary env tələb olunur"}
        </span>
      </label>

      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-5"
          >
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {progress}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3"
          >
            <p
              className="px-3 py-2 rounded-lg inline-block bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-sm"
              onAnimationEnd={() => setError(null)}
            >
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
