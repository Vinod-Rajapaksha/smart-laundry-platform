import InventoryContainer from "../components/InventoryContainer";

export default function InventoryPage() {
  return (
    <div className="p-1 md:p-6">
      <div className="mb-8 font-poppins text-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">Inventory & Stock</h1>
        <p className="text-slate-500 text-sm md:text-base">Manage items, stock levels, and category pricing</p>
      </div>

      <InventoryContainer />
    </div>
  );
}
