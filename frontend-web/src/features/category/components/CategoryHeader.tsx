export const CategoryHeader = () => {
  return (
    <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
      <h1 className="text-3xl font-black text-slate-900 tracking-[-0.75px] leading-9">
        Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Categories</span>
      </h1>
      <p className="text-slate-500 text-base font-normal leading-normal max-w-[600px]">
        Manage service categories, base pricing, and availability for the platform.
      </p>
    </div>
  );
};
