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

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidList(value: unknown): value is ShoppingList {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;

  return typeof v.id === "string" && typeof v.title === "string";
}

function isValidCatalog(value: unknown): value is CatalogItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;

  return typeof v.id === "string" && typeof v.name === "string";
}

function isValidItem(value: unknown): value is ListItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;

  if (
    typeof v.id !== "string" ||
    typeof v.listId !== "string" ||
    typeof v.catalogItemId !== "string"
  ) {
    return false;
  }

  if (v.kind === "unit") {
    return isFiniteNumber(v.qty) && isFiniteNumber(v.unitPrice);
  }

  if (v.kind === "weight") {
    return isFiniteNumber(v.weightKg) && isFiniteNumber(v.pricePerKg);
  }

  return false;
}

export function parseBackup(json: string): BackupData | null {
  try {
    const parsed = JSON.parse(json);

    if (!parsed.version || parsed.version !== 1) return null;
    if (!Array.isArray(parsed.lists)) return null;
    if (!Array.isArray(parsed.items)) return null;
    if (!Array.isArray(parsed.catalog)) return null;

    if (!parsed.lists.every(isValidList)) return null;
    if (!parsed.items.every(isValidItem)) return null;
    if (!parsed.catalog.every(isValidCatalog)) return null;

    return parsed as BackupData;
  } catch {
    return null;
  }
}
