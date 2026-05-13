export function formatPrice(amount: number): string {
  return `₼${amount.toLocaleString("az-AZ")}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("az-AZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
