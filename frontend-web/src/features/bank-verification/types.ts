export type Tab =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "All Transactions";

export type Transaction = {
  id: string;
  date: string;
  time: string;
  orderId: string;
  referenceId: string;
  customerName: string;
  customerInitial: string;
  amount: string;
  status: "Pending" | "Approved" | "Rejected";
};