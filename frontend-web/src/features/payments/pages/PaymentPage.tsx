import PaymentContainer from "../components/PaymentContainer";

export default function PaymentPage() {
  return (
    <div className="p-1 md:p-6">
      <div className="mb-8 font-poppins">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments Ledger</h1>
        <p className="text-slate-500 text-sm md:text-base">Track and verify all financial transactions across the platform</p>
      </div>

      <PaymentContainer />
    </div>
  );
}
