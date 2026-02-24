import type { ShoppingList, ListItem } from "../models/list";
import type { CatalogItem } from "../models/catolog";
import { calculateItemTotal } from "./calc";

function isSameMonth(a: number, b: number) {
  const da = new Date(a);
  const db = new Date(b);

  return (
    da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth()
  );
}

export function calculateMonthlyTotal(lists: ShoppingList[]) {
  const now = Date.now();

  return lists
    .filter((l) => l.completedAt && isSameMonth(l.completedAt, now))
    .reduce((acc, l) => acc + (l.finalTotal ?? 0), 0);
}

export function calculatePreviousMonthTotal(lists: ShoppingList[]) {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return lists
    .filter((l) => {
      if (!l.completedAt) return false;
      return isSameMonth(l.completedAt, prevMonth.getTime());
    })
    .reduce((acc, l) => acc + (l.finalTotal ?? 0), 0);
}

export function calculateTopItems(
  items: ListItem[],
  getCatalogItem: (id: string) => CatalogItem | undefined,
) {
  const map = new Map<string, number>();

  for (const item of items) {
    const cat = getCatalogItem(item.catalogItemId);
    if (!cat) continue;

    const total = calculateItemTotal(item);
    map.set(cat.name, (map.get(cat.name) ?? 0) + total);
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

export function calculateTopCategories(
  items: ListItem[],
  getCatalogItem: (id: string) => CatalogItem | undefined,
) {
  const map = new Map<string, number>();

  for (const item of items) {
    const catItem = getCatalogItem(item.catalogItemId);
    if (!catItem) continue;

    const key = catItem.categoryId;
    const total = calculateItemTotal(item);
    map.set(key, (map.get(key) ?? 0) + total);
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}
