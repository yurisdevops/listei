import type { ListItem } from "../models/list";

export function calculateItemTotal(item: ListItem): number {
  if (item.qty && item.unitPrice) {
    return item.qty * item.unitPrice;
  }

  if (item.weightKg && item.pricePerKg) {
    return item.weightKg * item.pricePerKg;
  }

  return 0;
}

export function calculateListTotal(items: ListItem[]): number {
  return items.reduce((acc, item) => acc + calculateItemTotal(item), 0);
}
