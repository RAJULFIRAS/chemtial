import React from "react";
import { Edit, Trash2, Search, Plus } from "lucide-react";
import Button from "../common/Button";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  emptyMessage?: string;
  addLabel?: string;
  searchPlaceholder?: string;
}

function DataTable<T extends { id: string }>({
  title,
  description,
  columns,
  data,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  searchValue = "",
  onSearchChange,
  emptyMessage = "No data available",
  addLabel = "Add",
  searchPlaceholder = "Search...",
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-secondary">{title}</h2>
            {description && (
              <p className="text-sm text-secondary/60 mt-1">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {onSearchChange && (
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}

            {onAdd && (
              <Button variant="primary" size="sm" onClick={onAdd} icon={Plus}>
                {addLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            <p className="text-secondary mt-3">Loading data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-secondary">{emptyMessage}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="text-right px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-sm text-secondary"
                    >
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DataTable;
