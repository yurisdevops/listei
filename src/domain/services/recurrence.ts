import type { ShoppingList } from "../models/list";

export function shouldGenerate(list: ShoppingList): boolean {
  if (!list.recurrence || !list.completedAt) return false;

  const now = Date.now();
  const last = list.lastGeneratedAt ?? list.completedAt;

  const diffDays = (now - last) / (1000 * 60 * 60 * 24);

  switch (list.recurrence) {
    case "weekly":
      return diffDays >= 7;
    case "biweekly":
      return diffDays >= 14;
    case "monthly":
      return diffDays >= 30;
    default:
      return false;
  }
}
