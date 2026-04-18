import VoucherContainer from "../components/VoucherContainer";

export default function VouchersPage() {
  return (
    <div className="p-1 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Voucher Management</h1>
        <p className="text-slate-500 text-sm md:text-base">Create and manage discount codes and promotional offers</p>
      </div>

      <VoucherContainer />
    </div>
  );
}
