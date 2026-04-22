export function formatMinutes(minutes: number): string {
  const sign = minutes < 0 ? "-" : "";
  const absoluteMinutes = Math.abs(minutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const remainderMinutes = absoluteMinutes % 60;

  if (hours === 0) return `${sign}${remainderMinutes}m`;
  if (remainderMinutes === 0) return `${sign}${hours}h`;
  return `${sign}${hours}h ${remainderMinutes}m`;
}