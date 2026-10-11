import React from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export interface UnitRow {
  unit: string;
  price: number;
  stock: number;
}

interface MultiUnitInputProps {
  values: UnitRow[];
  onChange: (units: UnitRow[]) => void;
  maxUnits?: number;
}

const MultiUnitInput: React.FC<MultiUnitInputProps> = ({
  values,
  onChange,
  maxUnits = 20,
}) => {
  const { t } = useTranslation();

  const handleAdd = (): void => {
    if (values.length >= maxUnits) {
      toast.error(t("unit_input.max_units", { count: maxUnits }));
      return;
    }
    onChange([...values, { unit: "", price: 0, stock: 0 }]);
  };

  const handleRemove = (index: number): void => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof UnitRow,
    value: string | number,
  ): void => {
    const next = [...values];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-secondary">
          {t("unit_input.title")}
        </label>
        <button
          type="button"
          onClick={handleAdd}
          disabled={values.length >= maxUnits}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark disabled:opacity-50 font-medium"
        >
          <Plus size={14} /> {t("unit_input.add_unit")}
        </button>
      </div>

      {values.length === 0 ? (
        <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-xs text-secondary/60">{t("unit_input.empty")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {values.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-lg p-2"
            >
              <div className="col-span-4">
                <input
                  type="text"
                  value={row.unit}
                  onChange={(e) => handleChange(index, "unit", e.target.value)}
                  placeholder={t("unit_input.placeholder_unit")}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div className="col-span-4">
                <input
                  type="number"
                  value={row.price || ""}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "price",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder={t("unit_input.placeholder_price")}
                  min={0}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  value={row.stock || ""}
                  onChange={(e) =>
                    handleChange(index, "stock", parseInt(e.target.value) || 0)
                  }
                  placeholder={t("unit_input.placeholder_stock")}
                  min={0}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title={t("unit_input.remove")}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiUnitInput;
