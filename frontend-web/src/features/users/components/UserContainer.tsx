import { useState, useEffect } from "react";
import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import UserDrawer from "./UserDrawer";
import type { User, Tab } from "../types";
import { getUsers, updateUser } from "../api/user.api";
import { toast } from "react-hot-toast";

export default function UserContainer() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const roleMap: Record<string, string> = {
        "Admin": "ADMIN",
        "Staff": "STAFF",
        "Customer": "CUSTOMER"
      };
      const role = roleMap[activeTab];
      const data = await getUsers(role);
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const handleUpdateStatus = async (id: string, isActive: boolean) => {
    try {
      setActionLoading(true);
      await updateUser(id, { isActive });
      toast.success(isActive ? "Account activated" : "Account suspended");

      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive } : u));
      if (selectedUser?._id === id) {
        setSelectedUser(prev => prev ? { ...prev, isActive } : null);
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-slate-500 mb-1">Active Staff</p>
          <p className="text-3xl font-bold text-blue-600">
            {users.filter(u => u.role === "STAFF" && u.isActive).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-slate-500 mb-1">New Customers</p>
          <p className="text-3xl font-bold text-indigo-600">
            {users.filter(u => u.role === "CUSTOMER").length}
          </p>
        </div>
      </div>

      <UserFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          onEdit={setSelectedUser}
        />
      )}

      <UserDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onUpdateStatus={handleUpdateStatus}
        loading={actionLoading}
      />
    </div>
  );
}
