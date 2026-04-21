import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Supplier } from "../types";
import { Edit2, ExternalLink, Phone, Mail } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  loading?: boolean;
}

export const SupplierTable = ({ suppliers, onEdit, loading }: SupplierTableProps) => {
  const columns: TableColumn<Supplier>[] = [
    {
      header: "Vendor & Category",
      cell: (supplier) => (
        <div className="group">
          <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-none">
            {supplier.name}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-slate-100 rounded-[4px]">{supplier.category}</span>
          </p>
        </div>
      ),
    },
    {
      header: "Contact Person",
      cell: (supplier) => (
        <p className="text-sm font-semibold text-slate-600">{supplier.contactPerson}</p>
      ),
    },
    {
      header: "Connectivity",
      cell: (supplier) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-slate-400">
             <Mail size={12} />
             <span className="text-[11px] font-bold lowercase">{supplier.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
             <Phone size={12} />
             <span className="text-[11px] font-bold">{supplier.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (supplier) => (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
          supplier.status === 'ACTIVE' 
            ? "bg-emerald-100 text-emerald-700" 
            : "bg-slate-100 text-slate-500"
        }`}>
          {supplier.status}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (supplier) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(supplier)}
            className="p-2 h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            <ExternalLink size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading && suppliers.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-20 flex flex-col items-center justify-center">
         <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-b-blue-600 mb-4"></div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Synchronizing Chain Data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
      <Table
        columns={columns}
        data={suppliers}
      />
    </div>
  );
};
