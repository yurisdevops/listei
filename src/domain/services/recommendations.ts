import type { ListItem } from "../models/list";
import type { CatalogItem } from "../models/catolog";

export function calculateMostFrequentItems(
  items: ListItem[],
  getCatalogItem: (id: string) => CatalogItem | undefined,
  limit = 5,
) {
  const counter: Record<string, number> = {};

  items.forEach((item) => {
    if (!item.checked) return;

    counter[item.catalogItemId] = (counter[item.catalogItemId] ?? 0) + 1;
  });

  const sorted = Object.entries(counter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  return sorted
    .map(([catalogId]) => getCatalogItem(catalogId))
    .filter(Boolean) as CatalogItem[];
}
