type DateInput = Date | string | number;

export const now = (): Date => new Date();

export const formatDate = (date: DateInput = new Date()): string => {
  return new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
};

export const formatDateTime = (date: DateInput = new Date()): string => {
  return new Date(date).toISOString();
};

export const addMinutes = (
  minutes: number,
  date: DateInput = new Date()
): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};

export const addHours = (
  hours: number,
  date: DateInput = new Date()
): Date => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

export const isExpired = (date: DateInput): boolean => {
  return new Date(date).getTime() < Date.now();
};

export const diffInMinutes = (
  from: DateInput,
  to: DateInput = new Date()
): number => {
  return Math.floor(
    (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60)
  );
};

export const diffInSeconds = (
  from: DateInput,
  to: DateInput = new Date()
): number => {
  return Math.floor(
    (new Date(to).getTime() - new Date(from).getTime()) / 1000
  );
};