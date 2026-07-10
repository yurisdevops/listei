import type { CatalogItem } from "../models/catalog";
import type { ListItem } from "../models/list";
import { calculateItemTotal } from "./calc";

export function groupItemsByCategory(
  items: ListItem[],
  getCatalogItem: (id: string) => CatalogItem | undefined,
) {
  const map: Record<string, { items: ListItem[]; total: number }> = {};

  items.forEach((item) => {
    const catalog = getCatalogItem(item.catalogItemId);

    if (!catalog) return;

    const category = catalog.categoryId;

    if (!map[category]) {
      map[category] = { items: [], total: 0 };
    }

    map[category].items.push(item);
    map[category].total += calculateItemTotal(item);
  });

  return map;
}
