import React, { useEffect, useState } from "react";
import { bannerApi, uploadApi } from "../../services/adminApi";
import DataTable from "../../components/admin/DataTable";
import FormModal from "../../components/admin/FormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/image";

interface Banner {
  id: string;
  file: string;
  mediaType: "image" | "video";
  position: string;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
}

type BannerPosition = "hero" | "home";
type MediaType = "image" | "video";

const Bannerpage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    file: "",
    mediaType: "image" as MediaType,
    position: "hero" as BannerPosition,
    sortOrder: 0,
    startDate: "",
    endDate: "",
  });

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const data = await bannerApi.getAll();
      setBanners(data);
    } catch {
      toast.error("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setFormData({
      file: "",
      mediaType: "image",
      position: "hero",
      sortOrder: 0,
      startDate: "",
      endDate: "",
    });
    setEditingBanner(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      file: banner.file,
      mediaType: banner.mediaType,
      position: banner.position as BannerPosition,
      sortOrder: banner.sortOrder,
      startDate: banner.startDate ? banner.startDate.slice(0, 16) : "",
      endDate: banner.endDate ? banner.endDate.slice(0, 16) : "",
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type === "video/mp4";
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      toast.error("Unsupported format. Use image or MP4 video.");
      return;
    }

    if (formData.position === "hero" && isVideo) {
      toast.error("Image Slider only supports images, not videos.");
      return;
    }

    if (isVideo && file.size > 20 * 1024 * 1024) {
      toast.error("Video maximum 20MB");
      return;
    }
    if (isImage && file.size > 5 * 1024 * 1024) {
      toast.error("Image maximum 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadApi.uploadBanner(file);
      setFormData((prev) => ({
        ...prev,
        file: result.path,
        mediaType: result.mediaType || (isVideo ? "video" : "image"),
      }));
      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      toast.error("Banner file is required");
      return;
    }

    if (formData.position === "hero" && formData.mediaType === "video") {
      toast.error("Image Slider only supports images, not videos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        file: formData.file,
        mediaType: formData.mediaType,
        position: formData.position,
        sortOrder: formData.sortOrder,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : undefined,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : undefined,
      };

      if (editingBanner) {
        await bannerApi.update(editingBanner.id, payload);
        toast.success("Banner updated successfully");
      } else {
        await bannerApi.create(payload);
        toast.success("Banner created successfully");
      }
      setIsModalOpen(false);
      resetForm();
      fetchBanners();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBanner) return;
    setIsSubmitting(true);
    try {
      await bannerApi.delete(deletingBanner.id);
      toast.success("Banner deleted successfully");
      setDeletingBanner(null);
      fetchBanners();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: "file",
      label: "",
      render: (b: Banner) =>
        b.file ? (
          b.mediaType === "video" ? (
            <video
              src={getImageUrl(b.file)}
              className="w-20 h-12 object-cover rounded"
              muted
            />
          ) : (
            <img
              src={getImageUrl(b.file)}
              alt="Banner"
              className="w-20 h-12 object-cover rounded"
            />
          )
        ) : (
          <div className="w-20 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-secondary">
            No File
          </div>
        ),
    },
    {
      key: "mediaType",
      label: "Type",
      render: (b: Banner) => (
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-black">
          {b.mediaType}
        </span>
      ),
    },
    {
      key: "position",
      label: "Position",
      render: (b: Banner) => (
        <span className="text-xs px-2 py-1 rounded-full bg-green-900 text-white">
          {b.position === "hero" ? "Image Slider" : "Home"}
        </span>
      ),
    },
    {
      key: "sortOrder",
      label: "Order",
      render: (b: Banner) => <span>{b.sortOrder}</span>,
    },
  ];

  return (
    <>
      <DataTable
        title="Manage Chemtial Banners"
        columns={columns}
        data={banners}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={setDeletingBanner}
        emptyMessage="No banners yet"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingBanner ? "Edit Banner" : "Add Banner"}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      >
        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Position
          </label>
          <select
            value={formData.position}
            onChange={(e) =>
              setFormData({
                ...formData,
                position: e.target.value as BannerPosition,
                mediaType:
                  e.target.value === "hero" ? "image" : formData.mediaType,
              })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="hero">Image Slider (images only)</option>
            <option value="home">Home (image or video)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Banner File
          </label>
          <input
            type="file"
            accept={
              formData.position === "hero"
                ? "image/jpeg,image/png,image/webp,image/gif"
                : "image/jpeg,image/png,image/webp,image/gif,video/mp4"
            }
            onChange={handleFileUpload}
            disabled={isUploading}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
          />
          <p className="text-xs text-secondary/60 mt-1">
            {formData.position === "hero"
              ? "Image max 5MB (JPEG/PNG/WEBP/GIF)"
              : "Image max 5MB, MP4 video max 20MB"}
          </p>
        </div>

        {formData.file && (
          <div className="border border-gray-200 rounded-lg p-3">
            {formData.mediaType === "video" ? (
              <video
                src={getImageUrl(formData.file)}
                className="w-full rounded-lg max-h-64"
                controls
                muted
              />
            ) : (
              <img
                src={getImageUrl(formData.file)}
                alt="Preview"
                className="w-full rounded-lg max-h-64 object-contain"
              />
            )}
            <p className="text-xs text-secondary/60 mt-2">
              Type: {formData.mediaType}
            </p>
          </div>
        )}

        <Input
          id="sortOrder"
          label="Order"
          type="number"
          value={formData.sortOrder.toString()}
          onChange={(v) =>
            setFormData({ ...formData, sortOrder: parseInt(v) || 0 })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Start Date
            </label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              End Date
            </label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deletingBanner}
        onClose={() => setDeletingBanner(null)}
        onConfirm={handleDelete}
        title="Delete Banner"
        message="Are you sure you want to delete this banner?"
        isLoading={isSubmitting}
      />
    </>
  );
};

export default Bannerpage;
