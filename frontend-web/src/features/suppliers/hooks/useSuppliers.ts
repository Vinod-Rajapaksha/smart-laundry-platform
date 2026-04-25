import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { suppliersApi } from "../api/suppliers.api";
import type { Supplier, SupplierStats, SupplierTab } from "../types";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SupplierTab>("All Vendors");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const statusMap: Record<string, string> = {
        "Active": "ACTIVE",
        "Inactive": "INACTIVE"
      };
      
      const [suppliersRes, statsRes] = await Promise.all([
        suppliersApi.getSuppliers(statusMap[activeTab]),
        suppliersApi.getSupplierStats(),
      ]);

      setSuppliers(suppliersRes.suppliers || suppliersRes);
      setStats(statsRes);
    } catch (error) {
      toast.error("Failed to load supplier data");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveSupplier = async (data: Partial<Supplier>, id?: string) => {
    try {
      setActionLoading(true);
      if (id) {
        await suppliersApi.updateSupplier(id, data);
        toast.success("Supplier updated");
      } else {
        await suppliersApi.createSupplier(data);
        toast.success("New supplier added");
      }
      fetchData();
    } catch (error) {
      toast.error("Failed to save supplier");
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      setActionLoading(true);
      await suppliersApi.deleteSupplier(id);
      toast.success("Supplier deleted");
      fetchData();
    } catch (error) {
      toast.error("Deletion failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter((s) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    suppliers: filteredSuppliers,
    stats,
    loading,
    actionLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    handleSaveSupplier,
    handleDeleteSupplier,
    refresh: fetchData,
  };
};
