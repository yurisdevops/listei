import type { ShoppingList, ListItem } from "../models/list";
import type { CatalogItem } from "../models/catalog";

export type BackupData = {
  version: 1;
  exportedAt: number;
  lists: ShoppingList[];
  items: ListItem[];
  catalog: CatalogItem[];
};

export function buildBackup(data: {
  lists: ShoppingList[];
  items: ListItem[];
  catalog: CatalogItem[];
}): string {
  const backup: BackupData = {
    version: 1,
    exportedAt: Date.now(),
    lists: data.lists,
    items: data.items,
    catalog: data.catalog,
  };

  return JSON.stringify(backup, null, 2);
}

export function parseBackup(json: string): BackupData | null {
  try {
    const parsed = JSON.parse(json);

    if (!parsed.version || parsed.version !== 1) return null;
    if (!Array.isArray(parsed.lists)) return null;
    if (!Array.isArray(parsed.items)) return null;
    if (!Array.isArray(parsed.catalog)) return null;

    return parsed;
  } catch {
    return null;
  }
}
