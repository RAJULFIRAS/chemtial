import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Loader2, Plus, Star } from "lucide-react";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/image";

interface MultiImageUploadProps {
  values: string[];
  onChange: (paths: string[]) => void;
  uploadFn: (file: File) => Promise<{ path: string; url: string }>;
  label?: string;
  maxImages?: number;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_SIZE = 5 * 1024 * 1024;

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  values,
  onChange,
  uploadFn,
  label,
  maxImages = 10,
}) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayLabel = label || t("upload.product_photos");

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (values.length >= maxImages) {
      toast.error(t("upload.max_images", { count: maxImages }));
      return;
    }

    const remaining = maxImages - values.length;
    const fileArray = Array.from(files).slice(0, remaining);

    setIsUploading(true);
    const newPaths: string[] = [];

    try {
      for (const file of fileArray) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`${file.name}: ${t("upload.invalid_format")}`);
          continue;
        }
        if (file.size > MAX_SIZE) {
          toast.error(`${file.name}: ${t("upload.max_size")}`);
          continue;
        }
        const result = await uploadFn(file);
        newPaths.push(result.path);
      }

      if (newPaths.length > 0) {
        onChange([...values, ...newPaths]);
        toast.success(t("upload.images_uploaded", { count: newPaths.length }));
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : t("upload.upload_failed_generic");
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number): void => {
    const next = values.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleSetPrimary = (index: number): void => {
    if (index === 0) return;
    const next = [...values];
    const [removed] = next.splice(index, 1);
    next.unshift(removed);
    onChange(next);
    toast.success(t("upload.primary_changed"));
  };

  const displayUrl = (path: string): string => {
    if (path.startsWith("blob:") || path.startsWith("http")) return path;
    return getImageUrl(path);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-secondary">
          {displayLabel}
        </label>
        <span className="text-xs text-secondary/60">
          {values.length}/{maxImages}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileSelect}
        disabled={isUploading || values.length >= maxImages}
        multiple
        className="hidden"
      />

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {values.map((path, index) => (
          <div
            key={`${path}-${index}`}
            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-50"
          >
            <img
              src={displayUrl(path)}
              alt={t("upload.photo_label", { index: index + 1 })}
              className="w-full h-full object-cover"
            />

            {index === 0 && (
              <div className="absolute top-1 left-1 bg-yellow-400 text-white rounded-full p-1">
                <Star size={10} className="fill-white" />
              </div>
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  className="p-1.5 bg-yellow-400 text-white rounded-full hover:bg-yellow-500"
                  title={t("upload.set_primary")}
                >
                  <Star size={12} />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                title={t("upload.remove")}
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}

        {values.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 size={20} className="text-primary animate-spin" />
            ) : (
              <>
                <Plus size={20} className="text-gray-400" />
                <span className="text-[10px] text-secondary/60">
                  {t("upload.add")}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiImageUpload;
