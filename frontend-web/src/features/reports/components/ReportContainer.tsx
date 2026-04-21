import { useState, useEffect } from "react";
import ReportFilters from "./ReportFilters";
import ReportTable from "./ReportTable";
import ReportModal from "./ReportModal";
import { ReportHeader } from "./ReportHeader";
import type { Report, Tab } from "../types";
import { getReports, createReport, downloadReport } from "../api/reports.api";
import { toast } from "react-hot-toast";

export default function ReportContainer() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All Reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

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

  const handleCreate = async (data: Partial<Report>) => {
    try {
      setActionLoading(true);
      await createReport(data);
      toast.success("Report generated successfully");
      setIsModalOpen(false);
      fetchReports();
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      toast.loading("Preparing download...", { id: "dl" });
      const blob = await downloadReport(id);

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
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in zoom-in duration-700 font-poppins pb-20">
      <ReportHeader />

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
        onGenerate={handleCreate}
        loading={actionLoading}
      />
    </div>
  );
}
