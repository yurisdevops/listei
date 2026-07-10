export function onlyDigits(text: string) {
  return text.replace(/\D/g, "");
}

export function formatCentsBRL(cents: number) {
  const value = (cents / 100).toFixed(2);
  return value.replace(".", ",");
}

export function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
