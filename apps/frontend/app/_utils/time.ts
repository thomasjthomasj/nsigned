export const getPlayerTime = (seconds: number) => {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const time = new Date(0);
  time.setSeconds(Math.floor(seconds));
  const formatted = time.toISOString().substring(11, 19);
  return formatted.replace(/^00:([0-9]{2}:[0-9]{2})$/, "$1");
};
