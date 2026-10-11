import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/image";

type AspectRatio = "square" | "video" | "banner" | "logo";

interface ImageUploadProps {
  value: string;
  onChange: (path: string) => void;
  uploadFn: (file: File) => Promise<{ path: string; url: string }>;
  label?: string;
  aspectRatio?: AspectRatio;
  className?: string;
}

const ASPECT_CLASSES: Record<AspectRatio, string> = {
  square: "aspect-square",
  video: "aspect-video",
  banner: "aspect-[4/1]",
  logo: "aspect-[2/1]",
};

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_SIZE = 5 * 1024 * 1024;

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  uploadFn,
  label,
  aspectRatio = "video",
  className = "",
}) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClass = ASPECT_CLASSES[aspectRatio];
  const displayLabel = label || t("upload.click_to_upload");

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(t("upload.invalid_format"));
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error(t("upload.max_size"));
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setIsUploading(true);

    try {
      const result = await uploadFn(file);
      onChange(result.path);
      setPreview(result.url);
      toast.success(t("upload.upload_success"));
    } catch (error: unknown) {
      setPreview(value);
      const message =
        error instanceof Error ? error.message : t("upload.upload_failed");
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = (): void => {
    setPreview("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayPreview = preview
    ? preview.startsWith("blob:") || preview.startsWith("http")
      ? preview
      : getImageUrl(preview)
    : "";

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-secondary mb-1.5">
        {displayLabel}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
      />

      {displayPreview ? (
        <div
          className={`relative w-full ${aspectClass} rounded-lg overflow-hidden border border-gray-200 group bg-gray-50`}
        >
          <img
            src={displayPreview}
            alt="Preview"
            className="w-full h-full object-contain"
          />

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 size={32} className="text-white animate-spin" />
            </div>
          )}

          {!isUploading && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-secondary text-sm rounded-lg hover:bg-gray-100 flex items-center gap-1.5"
              >
                <Upload size={14} /> {t("upload.change")}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 flex items-center gap-1.5"
              >
                <X size={14} /> {t("upload.remove")}
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={`w-full ${aspectClass} border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-secondary disabled:opacity-50`}
        >
          {isUploading ? (
            <>
              <Loader2 size={32} className="text-primary animate-spin" />
              <span className="text-sm">{t("upload.uploading")}</span>
            </>
          ) : (
            <>
              <ImageIcon size={32} className="text-gray-400" />
              <span className="text-sm font-medium">
                {t("upload.click_to_upload")}
              </span>
              <span className="text-xs text-secondary/60">
                {t("upload.hint")}
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
