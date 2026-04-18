import LoyaltyContainer from "../components/LoyaltyContainer";

export default function LoyaltyPage() {
  return (
    <div className="p-1 md:p-6 font-poppins text-slate-900">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Loyalty & Rewards</h1>
        <p className="text-slate-500 text-sm md:text-base">Monitor customer points, tiers, and loyalty program performance</p>
      </div>

      <LoyaltyContainer />
    </div>
  );
}
