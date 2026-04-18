import ReportContainer from "../components/ReportContainer";

export default function ReportsPage() {
  return (
    <div className="p-1 md:p-6 font-poppins text-slate-900">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-500 text-sm md:text-base">Generate and download periodic performance reports for the business</p>
      </div>

      <ReportContainer />
    </div>
  );
}
