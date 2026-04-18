import { Table, type TableColumn } from "../../../components/ui/Table";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Edit2, Trash2, Star } from "lucide-react";
import type { LaundryService } from "../types";

interface ServiceTableProps {
  data: LaundryService[];
  loading?: boolean;
  onEdit: (service: LaundryService) => void;
  onDelete: (service: LaundryService) => void;
}

export default function ServiceTable({ data, loading, onEdit, onDelete }: ServiceTableProps) {
  const columns: TableColumn<LaundryService>[] = [
    {
      header: "Service Details",
      cell: (svc) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 tracking-tight">{svc.name}</span>
              {svc.isPopular && (
                <Badge variant="warning" className="text-[8px] font-black uppercase tracking-tighter h-4 px-1">
                  <Star size={8} className="mr-0.5 fill-amber-500" /> Popular
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{svc.category}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Pricing",
      cell: (svc) => (
        <div className="flex flex-col">
          <span className="font-black text-slate-900 leading-none">Rs.{svc.basePrice.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 font-bold">per {svc.unit}</span>
        </div>
      ),
    },
    {
      header: "Estimated Time",
      cell: (svc) => (
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
          {svc.estimatedHours} hrs
        </span>
      ),
    },
    {
      header: "Status",
      cell: (svc) => (
        <Badge variant={svc.isActive ? "success" : "default"} className="text-[9px] font-black uppercase tracking-widest">
          {svc.isActive ? "Active" : "Disabled"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (svc) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(svc)}
            className="p-2 h-9 w-9 rounded-xl border-slate-100 text-slate-400 hover:text-blue-600 transition-all shadow-sm"
          >
            <Edit2 size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(svc)}
            className="p-2 h-9 w-9 rounded-xl border-slate-100 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading && data.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Accessing service registry...</p>
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      data={data}
    />
  );
}
