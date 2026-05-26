export const getDaysSince = (date: Date | string) => {
  const now = Date.now();
  const since = new Date(date);
  return Math.floor(Math.abs((now - since.getTime()) / (24 * 60 * 60 * 1000)));
};
