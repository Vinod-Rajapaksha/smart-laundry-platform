export interface FinanceEntryPayload {
  date?: unknown;
  name?: unknown;
  amount?: unknown;
}

export const validateFinanceEntryPayload = (
  payload: FinanceEntryPayload,
): string | null => {
  const date = new Date(String(payload.date ?? ''));
  const name = String(payload.name ?? '').trim();
  const amount = Number(payload.amount);

  if (Number.isNaN(date.getTime())) {
    return 'Date is required and must be valid.';
  }

  if (!name) {
    return 'Name is required.';
  }

  if (!Number.isFinite(amount) || amount < 0) {
    return 'Amount must be a valid non-negative number.';
  }

  return null;
};
