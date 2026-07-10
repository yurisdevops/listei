import type { ListItem } from "../models/list";

export function calculateItemTotal(item: ListItem): number {
  if (item.kind === "unit") {
    return item.qty * item.unitPrice;
  }

  return item.weightKg * item.pricePerKg;
}

export function calculateListTotal(items: ListItem[]): number {
  return items.reduce((acc, item) => acc + calculateItemTotal(item), 0);
}
