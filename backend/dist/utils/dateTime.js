export const now = () => new Date();
export const formatDate = (date = new Date()) => {
    return new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
};
export const formatDateTime = (date = new Date()) => {
    return new Date(date).toISOString();
};
export const addMinutes = (minutes, date = new Date()) => {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
};
export const addHours = (hours, date = new Date()) => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
};
export const isExpired = (date) => {
    return new Date(date).getTime() < Date.now();
};
export const diffInMinutes = (from, to = new Date()) => {
    return Math.floor((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60));
};
export const diffInSeconds = (from, to = new Date()) => {
    return Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 1000);
};
