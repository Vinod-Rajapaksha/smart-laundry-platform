import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "../types";
import { createUserSchema, updateUserSchema } from "../../../validation/user.schema";
import { Save, Loader2 } from "lucide-react";

interface UserFormProps {
  initialData?: User | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function UserForm({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) {
  const isNew = !initialData;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isNew ? createUserSchema : updateUserSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      telephone: initialData?.telephone || "",
      address: initialData?.address || "",
      role: initialData?.role || "CUSTOMER",
      staffType: initialData?.staffType || null,
      salary: initialData?.salary || null,
      password: "",
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        telephone: initialData.telephone,
        address: initialData.address || "",
        role: initialData.role,
        staffType: initialData.staffType || null,
        salary: initialData.salary || null,
        password: "",
      });
    } else {
      reset({
        name: "",
        email: "",
        telephone: "",
        address: "",
        role: "CUSTOMER",
        staffType: null,
        salary: null,
        password: "",
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: any) => {
    const payload = { ...data };
    if (!isNew && !payload.password) {
      delete payload.password;
    }
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
          <input
            {...register("name")}
            className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.name ? 'border-red-500' : ''}`}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1 font-bold">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
          <input
            type="email"
            {...register("email")}
            className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.email ? 'border-red-500' : ''}`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1 font-bold">{errors.email.message as string}</p>}
        </div>

        {isNew && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1 font-bold">{errors.password.message as string}</p>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Telephone</label>
            <input
              {...register("telephone")}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.telephone ? 'border-red-500' : ''}`}
              placeholder="0771234567"
            />
            {errors.telephone && <p className="text-xs text-red-500 mt-1 font-bold">{errors.telephone.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Role</label>
            <select
              {...register("role")}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        {selectedRole === "STAFF" && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Staff Type</label>
              <select
                {...register("staffType")}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
              >
                <option value="">Select Type</option>
                <option value="STORE">Store</option>
                <option value="DELIVERY">Delivery</option>
                <option value="BOTH">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Monthly Salary</label>
              <input
                type="number"
                {...register("salary", { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="50000"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Address</label>
          <input
            {...register("address")}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="123, Main Street, Colombo"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isNew ? "Create User" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
