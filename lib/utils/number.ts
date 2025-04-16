export function formatNumber(number: number) {
  return (
    number?.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) || 0
  );
}
