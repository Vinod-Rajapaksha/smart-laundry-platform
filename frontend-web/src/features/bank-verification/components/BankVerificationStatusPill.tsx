type Status = "PENDING" | "APPROVED" | "REJECTED" ;

export const BankVerificationStatusPill = ({ status }: { status: Status }) => {
  const styles = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  const dotStyles = {
    PENDING: "bg-amber-500",
    APPROVED: "bg-emerald-500",
    REJECTED: "bg-red-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[13px] font-semibold ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status]}`}></span>
      {status}
    </span>
  );
};
