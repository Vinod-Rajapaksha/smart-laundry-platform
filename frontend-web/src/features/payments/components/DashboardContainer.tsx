import { DashboardHeader } from "./DashboardHeader";
import { DashboardGrid } from "./DashboardGrid";

export const DashboardContainer = () => {
  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in zoom-in duration-700 font-poppins">
      <DashboardHeader />
      <DashboardGrid />
    </div>
  );
};
