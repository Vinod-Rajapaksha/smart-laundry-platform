import { useState, useEffect } from "react";
import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import UserDrawer from "./UserDrawer";
import UserForm from "./UserForm";
import { UserHeader } from "./UserHeader";
import type { User, Tab } from "../types";
import { getUsers, updateUser, createUser, deleteUser } from "../api/user.api";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

export default function UserContainer() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
      const userData = Array.isArray(data) ? data : (data as any)?.users || [];
      setUsers(userData);
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

  const handleCreateUser = async (data: any) => {
    try {
      setActionLoading(true);
      const newUser = await createUser(data);
      setUsers(prev => [newUser, ...prev]);
      toast.success("User created successfully");
      setIsAddModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (id: string, data: any) => {
    try {
      setActionLoading(true);
      const updatedUser = await updateUser(id, data);
      setUsers(prev => prev.map(u => u._id === id ? updatedUser : u));
      setSelectedUser(updatedUser);
      toast.success("User updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setActionLoading(true);
      await deleteUser(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: false } : u));
      if (selectedUser?._id === id) {
        setSelectedUser(prev => prev ? { ...prev, isActive: false } : null);
      }
      toast.success("User deactivated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to deactivate user");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.telephone.includes(searchQuery)
  );

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in duration-500 font-poppins">
      <UserHeader />

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={users.length} color="slate" />
        <StatCard title="Active Staff" value={users.filter(u => u.role === "STAFF" && u.isActive).length} color="blue" />
        <StatCard title="New Customers" value={users.filter(u => u.role === "CUSTOMER").length} color="indigo" />
      </div>

      <UserFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsAddModalOpen(true)}
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

      {/* CREATE USER MODAL */}
      {isAddModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" onClick={() => setIsAddModalOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] overflow-y-auto font-poppins animate-in slide-in-from-right duration-300 p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
                <p className="text-sm text-slate-500">Register a new administrative staff or customer</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
                <X size={20} />
              </button>
            </div>
            <UserForm
              onSubmit={handleCreateUser}
              onCancel={() => setIsAddModalOpen(false)}
              isLoading={actionLoading}
            />
          </div>
        </>
      )}

      <UserDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        loading={actionLoading}
      />
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
  const colorMap: any = {
    slate: "text-slate-900",
    blue: "text-blue-600",
    indigo: "text-indigo-600"
  };
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
