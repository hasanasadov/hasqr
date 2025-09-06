export const formatDateInput = (date: Date) => {
  return date.toISOString().slice(0, 7);
};

export const confirmAction = (message: string): boolean => {
  return window.confirm(message);
};
