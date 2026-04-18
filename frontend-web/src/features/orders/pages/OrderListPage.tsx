import OrderContainer from "../components/OrderContainer";

export default function OrderListPage() {
  return (
    <div className="p-1 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
        <p className="text-slate-500 text-sm md:text-base">Monitor and manage all customer laundry service requests</p>
      </div>

      <OrderContainer />
    </div>
  );
}
