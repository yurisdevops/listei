export function formatGramsToKg(grams: number) {
  const kg = (grams / 1000).toFixed(3);
  return kg.replace(".", ",");
}
