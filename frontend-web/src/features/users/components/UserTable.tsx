import { Table, type TableColumn } from "../../../components/ui/Table";
import type { User } from "../types";
import { format } from "date-fns";
import { Edit2, Shield, User as UserIcon } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

export default function UserTable({ users, onEdit }: UserTableProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-purple-100 text-purple-700 border-purple-200";
      case "STAFF": return "bg-blue-100 text-blue-700 border-blue-200";
      case "CUSTOMER": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  const columns: TableColumn<User>[] = [
    {
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            {user.role === "ADMIN" ? <Shield size={16} /> : <UserIcon size={16} />}
          </div>
          <div>
            <p className="font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 lowercase">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (user) => (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${getRoleBadge(user.role)}`}>
          {user.role}
        </span>
      ),
    },
    {
      header: "Telephone",
      cell: (user) => (
        <span className="text-slate-600 text-sm font-mono">{user.telephone}</span>
      ),
    },
    {
      header: "Status",
      cell: (user) => (
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-green-500" : "bg-slate-300"}`} />
          <span className={`text-xs ${user.isActive ? "text-green-700 font-medium" : "text-slate-500"}`}>
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      header: "Joined",
      cell: (user) => (
        <span className="text-slate-500 text-sm italic">
          {format(new Date(user.createdAt), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (user) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(user)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600 border-none"
        >
          <Edit2 size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <Table 
        columns={columns} 
        data={users} 
      />
    </div>
  );
}
