import StaffJobContainer from "../components/StaffJobContainer";

export default function PickupDeliveryPage() {
  return (
    <div className="p-1 md:p-6 font-poppins text-slate-900">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Logistics & Field Ops</h1>
        <p className="text-slate-500 text-sm md:text-base">Monitor and manage all pickup and delivery tasks for staff members</p>
      </div>

      <StaffJobContainer />
    </div>
  );
}
