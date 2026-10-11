import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utils/image";
import {
  productApi,
  categoryApi,
  brandApi,
  uploadApi,
} from "../../services/adminApi";
import DataTable from "../../components/admin/DataTable";
import FormModal from "../../components/admin/FormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Input from "../../components/common/Input";
import MultiImageUpload from "../../components/common/MultiImageUpload";
import MultiUnitInput, {
  UnitRow,
} from "../../components/common/MultiUnitInput";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/format";

interface ProductImage {
  id: string;
  image: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductUnit {
  id: string;
  unit: string;
  price: number;
  stock: number;
  isActive: boolean;
}

interface Option {
  id: string;
  name: string;
  nameEn?: string | null;
}

interface Product {
  id: string;
  name: string;
  nameEn: string | null;
  nameZh: string | null;
  nameHi: string | null;
  nameRu: string | null;
  nameAr: string | null;
  description: string | null;
  descriptionEn: string | null;
  descriptionZh: string | null;
  descriptionHi: string | null;
  descriptionRu: string | null;
  descriptionAr: string | null;
  brand: string;
  brandId: string | null;
  category: string;
  categoryId: string | null;
  price: number;
  originalPrice: number | null;
  discountedPrice: number;
  image: string;
  images: ProductImage[];
  units: ProductUnit[];
  rating: number;
  reviews: number;
  inStock: boolean;
  unit: string;
  isPromo: boolean;
  promoDiscount: number | null;
  casNumber: string | null;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limit = 10;

  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    nameZh: "",
    nameHi: "",
    nameRu: "",
    nameAr: "",
    description: "",
    descriptionEn: "",
    descriptionZh: "",
    descriptionHi: "",
    descriptionRu: "",
    descriptionAr: "",
    brand: "",
    brandId: "",
    category: "",
    categoryId: "",
    price: 0,
    unit: "ml",
    casNumber: "",
    isPromo: false,
    promoDiscount: 0,
  });

  const [images, setImages] = useState<string[]>([]);
  const [units, setUnits] = useState<UnitRow[]>([]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const result = await productApi.getAll({
        page,
        limit,
        search: search || undefined,
      });
      setProducts(result.data);
      setTotal(result.meta?.total || result.data.length);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const [cats, brs] = await Promise.all([
        categoryApi.getAll(),
        brandApi.getAll(),
      ]);
      setCategories(cats);
      setBrands(brs);
    } catch {
      toast.error("Failed to load categories and brands");
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  useEffect(() => {
    loadOptions();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      nameZh: "",
      nameHi: "",
      nameRu: "",
      nameAr: "",
      description: "",
      descriptionEn: "",
      descriptionZh: "",
      descriptionHi: "",
      descriptionRu: "",
      descriptionAr: "",
      brand: "",
      brandId: "",
      category: "",
      categoryId: "",
      price: 0,
      unit: "ml",
      casNumber: "",
      isPromo: false,
      promoDiscount: 0,
    });
    setImages([]);
    setUnits([]);
    setEditingProduct(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameEn: product.nameEn || "",
      nameZh: product.nameZh || "",
      nameHi: product.nameHi || "",
      nameRu: product.nameRu || "",
      nameAr: product.nameAr || "",
      description: product.description || "",
      descriptionEn: product.descriptionEn || "",
      descriptionZh: product.descriptionZh || "",
      descriptionHi: product.descriptionHi || "",
      descriptionRu: product.descriptionRu || "",
      descriptionAr: product.descriptionAr || "",
      brand: product.brand,
      brandId: product.brandId || "",
      category: product.category,
      categoryId: product.categoryId || "",
      price: product.price,
      unit: product.unit,
      casNumber: product.casNumber || "",
      isPromo: product.isPromo,
      promoDiscount: product.promoDiscount || 0,
    });
    setImages(product.images?.map((img) => img.image) || [product.image]);
    setUnits(
      product.units?.map((u) => ({
        unit: u.unit,
        price: u.price,
        stock: u.stock,
      })) || [],
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (images.length === 0) {
        toast.error("At least 1 product photo is required");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        name: formData.name,
        nameEn: formData.nameEn || undefined,
        nameZh: formData.nameZh || undefined,
        nameHi: formData.nameHi || undefined,
        nameRu: formData.nameRu || undefined,
        nameAr: formData.nameAr || undefined,
        description: formData.description || undefined,
        descriptionEn: formData.descriptionEn || undefined,
        descriptionZh: formData.descriptionZh || undefined,
        descriptionHi: formData.descriptionHi || undefined,
        descriptionRu: formData.descriptionRu || undefined,
        descriptionAr: formData.descriptionAr || undefined,
        brand: formData.brand,
        brandId: formData.brandId || undefined,
        category: formData.category,
        categoryId: formData.categoryId || undefined,
        price: formData.price,
        image: images[0],
        images,
        units: units.filter((u) => u.unit && u.price > 0),
        unit: formData.unit,
        casNumber: formData.casNumber || undefined,
        isPromo: formData.isPromo,
        promoDiscount: formData.isPromo ? formData.promoDiscount : undefined,
      };

      if (editingProduct) {
        await productApi.update(editingProduct.id, payload);
        toast.success("Product updated successfully");
      } else {
        await productApi.create(payload);
        toast.success("Product created successfully");
      }
      setIsModalOpen(false);
      resetForm();
      loadProducts();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsSubmitting(true);
    try {
      await productApi.delete(deletingProduct.id);
      toast.success("Product deleted successfully");
      setDeletingProduct(null);
      loadProducts();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    setFormData({
      ...formData,
      brandId,
      brand: brand?.name || "",
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    setFormData({
      ...formData,
      categoryId,
      category: category?.name || "",
    });
  };

  const columns = [
    {
      key: "image",
      label: "Photo",
      render: (p: Product) =>
        p.image ? (
          <img
            src={getImageUrl(p.image)}
            alt={p.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded" />
        ),
    },
    {
      key: "name",
      label: "Product Name",
      render: (p: Product) => (
        <div className="font-medium text-secondary line-clamp-2 max-w-xs">
          {p.nameEn || p.name}
        </div>
      ),
    },
    {
      key: "brand",
      label: "Brand",
      render: (p: Product) => (
        <span className="text-sm text-secondary">{p.brand}</span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (p: Product) => {
        const matched = categories.find((c) => c.id === p.categoryId);
        const displayName = matched
          ? matched.nameEn || matched.name
          : p.category;
        return <span className="text-sm text-secondary">{displayName}</span>;
      },
    },
    {
      key: "price",
      label: "Price",
      render: (p: Product) => (
        <div>
          <div className="font-medium text-primary">
            {formatCurrency(p.discountedPrice ?? p.price)}
          </div>
          {p.isPromo && p.originalPrice && (
            <div className="text-xs text-secondary/60 line-through">
              {formatCurrency(p.originalPrice)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (p: Product) => {
        const activeUnits = p.units?.filter((u) => u.isActive) || [];
        const totalStock = activeUnits.reduce((s, u) => s + u.stock, 0);
        const hasUnits = activeUnits.length > 0;

        if (hasUnits) {
          return (
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                totalStock === 0
                  ? "bg-red-700 text-white"
                  : totalStock < 10
                    ? "bg-yellow-500 text-black"
                    : "bg-green-900 text-white"
              }`}
            >
              {totalStock === 0 ? "Out of Stock" : `${totalStock} units`}
            </span>
          );
        }

        return (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              p.inStock ? "bg-green-900 text-white" : "bg-red-700 text-white"
            }`}
          >
            {p.inStock ? "Available" : "Out of Stock"}
          </span>
        );
      },
    },
    {
      key: "promo",
      label: "Promo",
      render: (p: Product) =>
        p.isPromo && p.promoDiscount ? (
          <span className="text-xs px-2 py-1 rounded-full bg-red-700 text-white font-medium">
            −{p.promoDiscount}%
          </span>
        ) : (
          <span className="text-xs text-secondary/40">—</span>
        ),
    },
  ];
  return (
    <>
      <DataTable
        title="Manage Chemtial Products"
        columns={columns}
        data={products}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={setDeletingProduct}
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        emptyMessage="No products yet"
      />

      {total > limit && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-sm text-secondary/70">
            Total: {total} products
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-secondary">
              {page} / {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingProduct ? "Edit Product" : "Add Product"}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      >
        <Input
          id="name"
          label="Product Name (Indonesian)"
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          required
          placeholder="e.g., Sulfuric Acid 98%"
        />

        <Input
          id="nameEn"
          label="Product Name (English)"
          value={formData.nameEn}
          onChange={(v) => setFormData({ ...formData, nameEn: v })}
          placeholder="Sulfuric Acid 98%"
        />

        <Input
          id="nameZh"
          label="Product Name (中文)"
          value={formData.nameZh}
          onChange={(v) => setFormData({ ...formData, nameZh: v })}
          placeholder="硫酸 98%"
        />

        <Input
          id="nameHi"
          label="Product Name (हिन्दी)"
          value={formData.nameHi}
          onChange={(v) => setFormData({ ...formData, nameHi: v })}
          placeholder="सल्फ्यूरिक एसिड 98%"
        />

        <Input
          id="nameRu"
          label="Product Name (Русский)"
          value={formData.nameRu}
          onChange={(v) => setFormData({ ...formData, nameRu: v })}
          placeholder="Серная кислота 98%"
        />

        <Input
          id="nameAr"
          label="Product Name (العربية)"
          value={formData.nameAr}
          onChange={(v) => setFormData({ ...formData, nameAr: v })}
          placeholder="حمض الكبريتيك 98%"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Brand
            </label>
            <select
              value={formData.brandId}
              onChange={(e) => handleBrandChange(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <MultiImageUpload
          label="Product Photos"
          values={images}
          onChange={setImages}
          uploadFn={uploadApi.uploadProduct}
          maxImages={10}
        />

        <MultiUnitInput values={units} onChange={setUnits} maxUnits={20} />

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Product Description (Indonesian)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-y min-h-[80px]"
            placeholder="Product description in Indonesian..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Product Description (English)
          </label>
          <textarea
            value={formData.descriptionEn}
            onChange={(e) =>
              setFormData({ ...formData, descriptionEn: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-y min-h-[80px]"
            placeholder="Product description in English..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Product Description (中文)
          </label>
          <textarea
            value={formData.descriptionZh}
            onChange={(e) =>
              setFormData({ ...formData, descriptionZh: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-y min-h-[80px]"
            placeholder="中文产品描述..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Product Description (हिन्दी)
          </label>
          <textarea
            value={formData.descriptionHi}
            onChange={(e) =>
              setFormData({ ...formData, descriptionHi: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-y min-h-[80px]"
            placeholder="हिंदी में उत्पाद विवरण..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Product Description (Русский)
          </label>
          <textarea
            value={formData.descriptionRu}
            onChange={(e) =>
              setFormData({ ...formData, descriptionRu: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-y min-h-[80px]"
            placeholder="Описание продукта на русском..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Product Description (العربية)
          </label>
          <textarea
            value={formData.descriptionAr}
            onChange={(e) =>
              setFormData({ ...formData, descriptionAr: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-y min-h-[80px]"
            placeholder="وصف المنتج بالعربية..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="price"
            label="Price (USD)"
            type="number"
            value={formData.price.toString()}
            onChange={(v) =>
              setFormData({ ...formData, price: parseFloat(v) || 0 })
            }
            required
            placeholder="12.99"
          />
          <Input
            id="unit"
            label="Base Unit"
            value={formData.unit}
            onChange={(v) => setFormData({ ...formData, unit: v })}
            required
            placeholder="ml / gr / L / kg"
          />
        </div>

        <Input
          id="casNumber"
          label="CAS Number"
          value={formData.casNumber}
          onChange={(v) => setFormData({ ...formData, casNumber: v })}
          placeholder="7664-93-9"
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isPromo}
            onChange={(e) =>
              setFormData({ ...formData, isPromo: e.target.checked })
            }
            className="w-4 h-4 text-primary rounded"
          />
          <span className="text-sm text-secondary">Enable Promo</span>
        </label>

        {formData.isPromo && (
          <Input
            id="promoDiscount"
            label="Promo Discount (%)"
            type="number"
            value={formData.promoDiscount.toString()}
            onChange={(v) =>
              setFormData({ ...formData, promoDiscount: parseFloat(v) || 0 })
            }
          />
        )}
      </FormModal>

      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete product "${deletingProduct?.name}"?`}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default ProductsPage;
