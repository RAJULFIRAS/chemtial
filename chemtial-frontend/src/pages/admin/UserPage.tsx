import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userApi } from "../../services/adminApi";
import DataTable from "../../components/admin/DataTable";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { RootState } from "../../store";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastSeen: string | null;
  createdAt: string;
}

const ROLE_DISPLAY: Record<string, string> = {
  manager: "Manager",
  admin: "Admin",
  courier: "Courier",
  user: "User",
};

const ROLE_COLORS: Record<string, string> = {
  manager: "bg-green-100 text-black",
  admin: "bg-blue-700 text-white",
  courier: "bg-green-900 text-white",
  user: "bg-gray-100 text-black",
};

const UserPage: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isManager = currentUser?.role === "manager";

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limit = 10;

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const result = await userApi.getAll({
        page,
        limit,
        search: search || undefined,
      });
      setUsers(result.data);
      setTotal(result.meta?.total || result.data.length);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const handleRoleChange = async (user: User, newRole: string) => {
    if (!isManager) {
      toast.error("Only managers can change roles");
      return;
    }

    try {
      await userApi.updateRole(user.id, newRole);
      toast.success(`${user.name}'s role changed to ${ROLE_DISPLAY[newRole]}`);
      loadUsers();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to change role";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setIsSubmitting(true);
    try {
      await userApi.delete(deletingUser.id);
      toast.success("User deleted successfully");
      setDeletingUser(null);
      loadUsers();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (u: User) => {
        const isTargetManager = u.role === "manager";
        const isSelf = u.id === currentUser?.id;
        const canEdit = isManager && !isTargetManager && !isSelf;

        if (!canEdit) {
          return (
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                ROLE_COLORS[u.role] || "bg-gray-100"
              }`}
            >
              {ROLE_DISPLAY[u.role] || u.role}
            </span>
          );
        }

        return (
          <select
            value={u.role}
            onChange={(e) => handleRoleChange(u, e.target.value)}
            className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer font-medium ${
              ROLE_COLORS[u.role] || "bg-gray-100"
            }`}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="courier">Courier</option>
          </select>
        );
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (u: User) => {
        const isOnline = u.lastSeen
          ? Date.now() - new Date(u.lastSeen).getTime() < 5 * 60 * 1000
          : false;
        return (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isOnline ? "bg-green-700 text-white" : "bg-gray-100 text-black"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Registered",
      render: (u: User) => (
        <span className="text-xs text-secondary/70">
          {new Date(u.createdAt).toLocaleDateString("en-US")}
        </span>
      ),
    },
  ];

  const canDeleteUser = (u: User): boolean => {
    return u.role !== "manager" && u.id !== currentUser?.id;
  };

  return (
    <>
      <DataTable
        title="Manage Chemtial Users"
        columns={columns}
        data={users}
        isLoading={isLoading}
        onDelete={
          currentUser?.role === "manager" || currentUser?.role === "admin"
            ? (user) => {
                if (canDeleteUser(user)) {
                  setDeletingUser(user);
                } else {
                  toast.error("This user cannot be deleted");
                }
              }
            : undefined
        }
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        emptyMessage="No users yet"
      />

      {total > limit && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-sm text-secondary/70">
            Total: {total} users
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

      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deletingUser?.name}" (${deletingUser?.email})? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default UserPage;
