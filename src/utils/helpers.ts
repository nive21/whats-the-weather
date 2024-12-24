export function getTimeString(
  timestampUTC: number,
  timeZoneDiffInSeconds: number
): string {
  const currentTimeInMs = (timestampUTC + timeZoneDiffInSeconds) * 1000;
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  };
  const localTime = new Date(currentTimeInMs).toLocaleString("en-US", options);
  return localTime;
}
