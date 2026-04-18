import UserContainer from "../components/UserContainer";

export default function UserListPage() {
  return (
    <div className="p-1 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 text-sm md:text-base">View and manage administrative staff and customers</p>
      </div>

      <UserContainer />
    </div>
  );
}
