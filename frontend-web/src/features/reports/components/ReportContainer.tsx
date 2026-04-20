import { useState, useEffect } from "react";
import ReportFilters from "./ReportFilters";
import ReportTable from "./ReportTable";
import ReportModal from "./ReportModal";
import type { Report, Tab } from "../types";
import { getReports, downloadReport, createReport } from "../api/reports.api";
import { toast } from "react-hot-toast";

export default function ReportContainer() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All Reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getReports();
      const reportData = (response as any).data || response;
      setReports(Array.isArray(reportData) ? reportData : []);
    } catch (error) {
      toast.error("Failed to fetch reports");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async (data: Partial<Report>) => {
    try {
      setActionLoading(true);
      await createReport(data);
      toast.success("Report generated and saved");
      setIsModalOpen(false);
      fetchReports();
    } catch (error) {
      toast.error("Generation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      toast.loading("Preparing download...", { id: "dl" });
      const blob = await downloadReport(id);
      
      // Trigger actual browser download
      const url = window.URL.createObjectURL(new Blob([blob as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report-${id.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Download success", { id: "dl" });
    } catch (error) {
      toast.error("Download failed", { id: "dl" });
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.reportType.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "Sales") return matchesSearch && r.reportType.toUpperCase() === "SALES";
    if (activeTab === "Inventory") return matchesSearch && r.reportType.toUpperCase() === "INVENTORY";
    if (activeTab === "Staff") return matchesSearch && r.reportType.toUpperCase() === "STAFF";
    return matchesSearch;
  });

  return (
    <div className="space-y-6 font-poppins text-slate-900">
      {/* ANALYTICS SUMMARY */}
      <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-1/2 -translate-y-1/2 scale-150 group-hover:rotate-12 transition-transform duration-1000">
          <FileText size={200} />
        </div>

        <div className="z-10 text-center md:text-left">
          <h2 className="text-2xl font-black mb-2 tracking-tight">Intelligence Reports</h2>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">Cross-referenced historical data across all platform nodes available for instant compilation.</p>
        </div>

        <div className="z-10 flex gap-12 border-l border-white/10 pl-12 hidden md:flex">
          <div className="text-center">
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Generated</p>
            <p className="text-3xl font-black">{reports.length}</p>
          </div>
          <div className="text-center">
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Health</p>
            <p className="text-3xl font-black uppercase">100%</p>
          </div>
        </div>
      </div>

      <ReportFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onGenerateClick={() => setIsModalOpen(true)}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-indigo-500">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <ReportTable
          reports={filteredReports}
          onDownload={handleDownload}
        />
      )}

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerate}
        loading={actionLoading}
      />
    </div>
  );
}

import { FileText } from "lucide-react";
