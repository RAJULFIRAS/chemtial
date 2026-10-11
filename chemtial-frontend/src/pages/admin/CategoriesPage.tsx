import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { categoryApi } from "../../services/adminApi";
import DataTable from "../../components/admin/DataTable";
import FormModal from "../../components/admin/FormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Input from "../../components/common/Input";
import { AppDispatch } from "../../store";
import { invalidateCategoryCache } from "../../store/slices/categorySlice";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  nameZh: string | null;
  nameHi: string | null;
  nameRu: string | null;
  nameAr: string | null;
  slug: string;
  sortOrder: number;
  productCount?: number;
}

const CategoriesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    nameZh: "",
    nameHi: "",
    nameRu: "",
    nameAr: "",
    sortOrder: 0,
  });

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryApi.getAll({ search: search || undefined });
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [search]);

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      nameZh: "",
      nameHi: "",
      nameRu: "",
      nameAr: "",
      sortOrder: 0,
    });
    setEditingCategory(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameEn: category.nameEn || "",
      nameZh: category.nameZh || "",
      nameHi: category.nameHi || "",
      nameRu: category.nameRu || "",
      nameAr: category.nameAr || "",
      sortOrder: category.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        nameEn: formData.nameEn || undefined,
        nameZh: formData.nameZh || undefined,
        nameHi: formData.nameHi || undefined,
        nameRu: formData.nameRu || undefined,
        nameAr: formData.nameAr || undefined,
        sortOrder: formData.sortOrder,
      };

      if (editingCategory) {
        await categoryApi.update(editingCategory.id, payload);
        toast.success("Category updated successfully");
      } else {
        await categoryApi.create(payload);
        toast.success("Category created successfully");
      }
      dispatch(invalidateCategoryCache());
      setIsModalOpen(false);
      resetForm();
      loadCategories();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setIsSubmitting(true);
    try {
      await categoryApi.delete(deletingCategory.id);
      toast.success("Category deleted successfully");
      dispatch(invalidateCategoryCache());
      setDeletingCategory(null);
      loadCategories();
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
      key: "name",
      label: "Category Name",
      render: (cat: Category) => (
        <div className="font-medium text-secondary">
          {cat.nameEn || cat.name}
        </div>
      ),
    },
    {
      key: "productCount",
      label: "Products",
      render: (cat: Category) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            (cat.productCount || 0) > 0
              ? "bg-primary/10 text-primary"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {cat.productCount || 0}
        </span>
      ),
    },
    {
      key: "sortOrder",
      label: "Order",
      render: (cat: Category) => (
        <span className="text-sm text-secondary">{cat.sortOrder}</span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="Manage Chemtial Categories"
        columns={columns}
        data={categories}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={setDeletingCategory}
        searchValue={search}
        onSearchChange={setSearch}
        emptyMessage="No categories yet"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingCategory ? "Edit Category" : "Add Category"}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      >
        <Input
          id="name"
          label="Category Name (Indonesian)"
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          required
          placeholder="e.g., Acids & Bases"
        />

        <Input
          id="nameEn"
          label="Category Name (English)"
          value={formData.nameEn}
          onChange={(v) => setFormData({ ...formData, nameEn: v })}
          placeholder="Acids & Bases"
        />

        <Input
          id="nameZh"
          label="Category Name (中文)"
          value={formData.nameZh}
          onChange={(v) => setFormData({ ...formData, nameZh: v })}
          placeholder="酸和碱"
        />

        <Input
          id="nameHi"
          label="Category Name (हिन्दी)"
          value={formData.nameHi}
          onChange={(v) => setFormData({ ...formData, nameHi: v })}
          placeholder="अम्ल और क्षार"
        />

        <Input
          id="nameRu"
          label="Category Name (Русский)"
          value={formData.nameRu}
          onChange={(v) => setFormData({ ...formData, nameRu: v })}
          placeholder="Кислоты и основания"
        />

        <Input
          id="nameAr"
          label="Category Name (العربية)"
          value={formData.nameAr}
          onChange={(v) => setFormData({ ...formData, nameAr: v })}
          placeholder="الأحماض والقواعد"
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
          Slug will be generated automatically from the category name.
        </p>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default CategoriesPage;
