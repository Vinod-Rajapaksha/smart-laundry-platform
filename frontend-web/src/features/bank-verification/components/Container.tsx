import { useState, useEffect } from "react";
import { VerificationSummarySection } from "./BankVerificationSummary";
import { BankVerificationFilters } from "./BankVerificationFilters";
import { BankVerificationTable } from "./BankVerificationTable";
import { VerificationDrawer } from "./VerificationDrawer";
import { bankVerificationApi, type PendingTransferData } from "../api/bank-verification.api";

export const Container = () => {
  const [transfers, setTransfers] = useState<PendingTransferData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransfer, setSelectedTransfer] = useState<PendingTransferData | null>(null);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const res = await bankVerificationApi.getTransfers({
        status: activeTab,
        search: searchQuery
      });
      console.log("Bank Transfers API Response:", res);

      const transfersData = Array.isArray(res)
        ? res
        : (res as any).data || (res as any).pendingTransfers || [];

      setTransfers(transfersData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [activeTab, searchQuery]);

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in zoom-in duration-700 font-poppins">
      <VerificationSummarySection />
      <BankVerificationFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSearch={setSearchQuery}
      />
      <BankVerificationTable
        data={transfers}
        loading={loading}
        onViewDetails={(item) => setSelectedTransfer(item)}
      />
      <VerificationDrawer
        isOpen={!!selectedTransfer}
        transfer={selectedTransfer}
        onClose={() => setSelectedTransfer(null)}
        onSuccess={() => {
          fetchTransfers();
        }}
      />
    </div>
  );
};