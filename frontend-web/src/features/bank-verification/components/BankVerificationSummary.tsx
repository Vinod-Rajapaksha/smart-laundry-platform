export const VerificationSummarySection = () => {
  return (
    <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
      <h1 className="text-3xl font-black text-slate-900 tracking-[-0.75px] leading-9">
        Bank Transfer Verification
      </h1>
      <p className="text-slate-500 text-base font-normal leading-normal max-w-[600px]">
        Review and reconcile manual bank transfers. Verify the reference codes against the
        bank statement to confirm payment success.
      </p>
    </div>
  );
};