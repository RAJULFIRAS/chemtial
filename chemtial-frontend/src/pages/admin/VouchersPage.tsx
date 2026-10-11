import React, { useEffect, useState } from "react";
import { voucherApi } from "../../services/adminApi";
import DataTable from "../../components/admin/DataTable";
import FormModal from "../../components/admin/FormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/format";

interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string | null;
  type: string;
  category: string;
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  usageCount: number;
  perUserLimit: number;
  isActiveNow: boolean;
}

const VouchersPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [deletingVoucher, setDeletingVoucher] = useState<Voucher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    type: "percentage" as "percentage" | "fixed" | "free_shipping",
    category: "discount" as "discount" | "free_shipping" | "new_user",
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
    perUserLimit: 1,
  });

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const data = await voucherApi.getAll({ search: search || undefined });
      setVouchers(data);
    } catch {
      toast.error("Failed to load vouchers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [search]);

  const resetForm = () => {
    setFormData({
      code: "",
      title: "",
      description: "",
      type: "percentage",
      category: "discount",
      value: 0,
      minPurchase: 0,
      maxDiscount: 0,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      perUserLimit: 1,
    });
    setEditingVoucher(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      title: voucher.title,
      description: voucher.description || "",
      type: voucher.type as "percentage" | "fixed" | "free_shipping",
      category: voucher.category as "discount" | "free_shipping" | "new_user",
      value: voucher.value,
      minPurchase: voucher.minPurchase || 0,
      maxDiscount: voucher.maxDiscount || 0,
      startDate: new Date(voucher.startDate).toISOString().slice(0, 16),
      endDate: new Date(voucher.endDate).toISOString().slice(0, 16),
      perUserLimit: voucher.perUserLimit,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        code: formData.code,
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type,
        category: formData.category,
        value: formData.value,
        minPurchase: formData.minPurchase || undefined,
        maxDiscount: formData.maxDiscount || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        perUserLimit: formData.perUserLimit,
      };

      if (editingVoucher) {
        await voucherApi.update(editingVoucher.id, payload);
        toast.success("Voucher updated successfully");
      } else {
        await voucherApi.create(payload);
        toast.success("Voucher created successfully");
      }
      setIsModalOpen(false);
      resetForm();
      fetchVouchers();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingVoucher) return;
    setIsSubmitting(true);
    try {
      await voucherApi.delete(deletingVoucher.id);
      toast.success("Voucher deleted successfully");
      setDeletingVoucher(null);
      fetchVouchers();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") return `${value}%`;
    if (type === "fixed") return formatCurrency(value);
    return "Free Shipping";
  };

  const columns = [
    {
      key: "code",
      label: "Code",
      render: (v: Voucher) => (
        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded font-bold">
          {v.code}
        </span>
      ),
    },
    { key: "title", label: "Title" },
    {
      key: "value",
      label: "Value",
      render: (v: Voucher) => (
        <span className="font-medium text-primary">
          {formatValue(v.type, v.value)}
        </span>
      ),
    },
    {
      key: "period",
      label: "Period",
      render: (v: Voucher) => (
        <div className="text-xs">
          <div>{new Date(v.startDate).toLocaleDateString("en-US")}</div>
          <div className="text-secondary/60">
            to {new Date(v.endDate).toLocaleDateString("en-US")}
          </div>
        </div>
      ),
    },
    {
      key: "usage",
      label: "Usage",
      render: (v: Voucher) => <span className="text-xs">{v.usageCount}</span>,
    },
    {
      key: "isActiveNow",
      label: "Status",
      render: (v: Voucher) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            v.isActiveNow
              ? "bg-green-700 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {v.isActiveNow ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="Manage Chemtial Vouchers"
        columns={columns}
        data={vouchers}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={setDeletingVoucher}
        searchValue={search}
        onSearchChange={setSearch}
        emptyMessage="No vouchers yet"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingVoucher ? "Edit Voucher" : "Add Voucher"}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      >
        <Input
          id="code"
          label="Voucher Code"
          value={formData.code}
          onChange={(v) => setFormData({ ...formData, code: v.toUpperCase() })}
          required
          placeholder="CHEM10"
        />

        <Input
          id="title"
          label="Title"
          value={formData.title}
          onChange={(v) => setFormData({ ...formData, title: v })}
          required
          placeholder="10% off all products"
        />

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as
                  | "percentage"
                  | "fixed"
                  | "free_shipping",
              })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
            <option value="free_shipping">Free Shipping</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as
                  | "discount"
                  | "free_shipping"
                  | "new_user",
              })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
          >
            <option value="discount">Discount</option>
            <option value="free_shipping">Free Shipping</option>
            <option value="new_user">New User</option>
          </select>
        </div>

        <Input
          id="value"
          label="Value"
          type="number"
          value={formData.value.toString()}
          onChange={(v) =>
            setFormData({ ...formData, value: parseFloat(v) || 0 })
          }
          placeholder={formData.type === "percentage" ? "10" : "5.00"}
        />

        <Input
          id="minPurchase"
          label="Minimum Purchase (USD)"
          type="number"
          value={formData.minPurchase.toString()}
          onChange={(v) =>
            setFormData({ ...formData, minPurchase: parseFloat(v) || 0 })
          }
          placeholder="0"
        />

        <Input
          id="maxDiscount"
          label="Maximum Discount (USD)"
          type="number"
          value={formData.maxDiscount.toString()}
          onChange={(v) =>
            setFormData({ ...formData, maxDiscount: parseFloat(v) || 0 })
          }
          placeholder="0"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Start
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
              End
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

        <Input
          id="perUserLimit"
          label="Per User Limit"
          type="number"
          value={formData.perUserLimit.toString()}
          onChange={(v) =>
            setFormData({ ...formData, perUserLimit: parseInt(v) || 1 })
          }
        />

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
            rows={3}
            placeholder="Voucher description (optional)"
          />
        </div>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deletingVoucher}
        onClose={() => setDeletingVoucher(null)}
        onConfirm={handleDelete}
        title="Delete Voucher"
        message={`Are you sure you want to delete voucher "${deletingVoucher?.code}"?`}
        isLoading={isSubmitting}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};

export default VouchersPage;
