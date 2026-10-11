import React, { useEffect, useState } from "react";
import { brandApi, uploadApi } from "../../services/adminApi";
import DataTable from "../../components/admin/DataTable";
import FormModal from "../../components/admin/FormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Input from "../../components/common/Input";
import ImageUpload from "../../components/common/ImageUpload";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/image";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  sortOrder: number;
  productCount?: number;
}

const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    sortOrder: 0,
  });

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const data = await brandApi.getAll({ search: search || undefined });
      setBrands(data);
    } catch {
      toast.error("Failed to load brands");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [search]);

  const resetForm = () => {
    setFormData({ name: "", logo: "", sortOrder: 0 });
    setEditingBrand(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      logo: brand.logo || "",
      sortOrder: brand.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingBrand) {
        await brandApi.update(editingBrand.id, formData);
        toast.success("Brand updated successfully");
      } else {
        await brandApi.create(formData);
        toast.success("Brand created successfully");
      }
      setIsModalOpen(false);
      resetForm();
      fetchBrands();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBrand) return;
    setIsSubmitting(true);
    try {
      await brandApi.delete(deletingBrand.id);
      toast.success("Brand deleted successfully");
      setDeletingBrand(null);
      fetchBrands();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: "logo",
      label: "Logo",
      render: (brand: Brand) =>
        brand.logo ? (
          <img
            src={getImageUrl(brand.logo)}
            alt={brand.name}
            className="w-16 h-10 object-contain bg-gray-50 rounded p-1"
          />
        ) : (
          <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
            No Logo
          </div>
        ),
    },
    {
      key: "name",
      label: "Brand Name",
      render: (brand: Brand) => (
        <span className="font-medium text-secondary">{brand.name}</span>
      ),
    },
    {
      key: "productCount",
      label: "Products",
      render: (brand: Brand) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            (brand.productCount || 0) > 0
              ? "bg-primary/10 text-primary"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {brand.productCount || 0}
        </span>
      ),
    },
    {
      key: "sortOrder",
      label: "Order",
      render: (brand: Brand) => (
        <span className="text-sm text-secondary">{brand.sortOrder}</span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="Manage Chemtial Brands"
        columns={columns}
        data={brands}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={setDeletingBrand}
        searchValue={search}
        onSearchChange={setSearch}
        emptyMessage="No brands yet"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingBrand ? "Edit Brand" : "Add Brand"}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      >
        <Input
          id="name"
          label="Brand Name"
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          required
          placeholder="e.g., Merck"
        />

        <ImageUpload
          label="Brand Logo"
          value={formData.logo}
          onChange={(url) => setFormData({ ...formData, logo: url })}
          uploadFn={uploadApi.uploadBrand}
          aspectRatio="logo"
        />

        <Input
          id="sortOrder"
          label="Order"
          type="number"
          value={formData.sortOrder.toString()}
          onChange={(v) =>
            setFormData({ ...formData, sortOrder: parseInt(v) || 0 })
          }
        />

        <p className="text-xs text-secondary/60">
          Slug will be generated automatically from the brand name.
        </p>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deletingBrand}
        onClose={() => setDeletingBrand(null)}
        onConfirm={handleDelete}
        title="Delete Brand"
        message={`Are you sure you want to delete "${deletingBrand?.name}"?`}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default BrandsPage;
