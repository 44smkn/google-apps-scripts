export function calculateAmountPerCapita(housingCost: number, billing: number): number {
  const totalCostPerCapita = (housingCost + billing) / 2;
  // 123,456 -> 124,000
  return Math.ceil(totalCostPerCapita / 1000) * 1000;
}
