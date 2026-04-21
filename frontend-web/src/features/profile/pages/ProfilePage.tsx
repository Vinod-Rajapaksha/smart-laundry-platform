import ProfileContainer from "../components/ProfileContainer";

export default function ProfilePage() {
  return (
    <div className="p-1 md:p-6 font-poppins text-slate-900">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Administrative Profile</h1>
        <p className="text-slate-500 text-sm md:text-base">Manage your personal credentials and platform access protocols</p>
      </div>

      <ProfileContainer />
    </div>
  );
}
