import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid/non-secure";

import type { ShoppingList, ListItem, RecurrenceType } from "../../domain/models/list";
import type { CatalogItem } from "../../domain/models/catolog";
import { CATALOG_SEED } from "../../domain/seed/catalog";
import type { CategoryId } from "../../domain/models/category";
import type { BackupData } from "../../domain/services/backup";

type ListsState = {
  lists: ShoppingList[];
  items: ListItem[];
  catalog: CatalogItem[];

  addCatalogItem: (data: {
    name: string;
    categoryId: CategoryId;
    pricingType: "unit" | "weight";
    defaultUnit?: "un" | "kg";
  }) => string;

  updateCatalogItem: (
    id: string,
    patch: Partial<Pick<CatalogItem, "name" | "categoryId" | "pricingType" | "defaultUnit">>,
  ) => void;

  removeCatalogItem: (id: string) => { ok: boolean; reason?: string };

  createList: (title: string) => string;
  addItemToList: (listId: string, catalogItem: CatalogItem) => void;
  toggleItem: (itemId: string) => void;

  updateUnitItem: (itemId: string, qty: number, price: number) => void;
  updateWeightItem: (itemId: string, kg: number, pricePerKg: number) => void;

  removeItem: (itemId: string) => void;
  setBudget: (listId: string, budget: number) => void;

  duplicateList: (listId: string) => string;
  completeList: (listId: string) => void;
  removeList: (listId: string) => void;

  toggleCatalogFavorite: (id: string) => void;
  createFromLastCompleted: () => string | null;

  setRecurrence: (listId: string, recurrence: RecurrenceType) => void;
  generateRecurringList: (listId: string) => string | null;

  restoreBackup: (data: BackupData) => void;
  getCatalogItem: (catalogItemId: string) => CatalogItem | undefined;
};

const now = () => Date.now();
const clampMin = (n: number, min: number) => (Number.isFinite(n) ? Math.max(n, min) : min);

function computeListTotal(items: ListItem[]) {
  return items.reduce((acc, item) => {
    if ("qty" in item) return acc + (item.qty ?? 0) * (item.unitPrice ?? 0);
    return acc + (item.weightKg ?? 0) * (item.pricePerKg ?? 0);
  }, 0);
}

function cloneItemsForList(params: {
  sourceItems: ListItem[];
  sourceListId: string;
  targetListId: string;
  resetPrices?: boolean; // pra "criar da última compra"
}) {
  const { sourceItems, sourceListId, targetListId, resetPrices = false } = params;

  return sourceItems
    .filter((i) => i.listId === sourceListId)
    .map((item) => {
      const base = {
        id: nanoid(),
        listId: targetListId,
        catalogItemId: item.catalogItemId,
        checked: false,
        createdAt: now(),
        updatedAt: now(),
      };

      if (item.kind === "unit") {
        return {
          ...base,
          kind: "unit",
          qty: resetPrices ? 1 : item.qty,
          unitPrice: resetPrices ? 0 : item.unitPrice,
        } as ListItem;
      }

      return {
        ...base,
        kind: "weight",
        weightKg: resetPrices ? 0 : item.weightKg,
        pricePerKg: resetPrices ? 0 : item.pricePerKg,
      } as ListItem;
    });
}

export const useListsStore = create<ListsState>()(
  persist(
    (set, get) => ({
      lists: [],
      items: [],
      catalog: CATALOG_SEED,

      // ------- Catalog -------
      addCatalogItem: (data) => {
        const id = nanoid();
        const name = data.name.trim();

        const item: CatalogItem = {
          id,
          name,
          categoryId: data.categoryId,
          pricingType: data.pricingType,
          defaultUnit: data.defaultUnit ?? (data.pricingType === "unit" ? "un" : "kg"),
          createdBy: "user",
          createdAt: now(),
        };

        set((state) => ({ catalog: [item, ...state.catalog] }));
        return id;
      },

      updateCatalogItem: (id, patch) => {
        set((state) => ({
          catalog: state.catalog.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }));
      },

      removeCatalogItem: (id) => {
        const used = get().items.some((i) => i.catalogItemId === id);
        if (used) return { ok: false, reason: "Esse item está sendo usado em alguma lista." };

        set((state) => ({ catalog: state.catalog.filter((c) => c.id !== id) }));
        return { ok: true };
      },

      toggleCatalogFavorite: (id) => {
        set((state) => ({
          catalog: state.catalog.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)),
        }));
      },

      getCatalogItem: (catalogItemId) => get().catalog.find((c) => c.id === catalogItemId),

      // ------- Lists -------
      createList: (title) => {
        const id = nanoid();
        const t = title.trim();

        const newList: ShoppingList = {
          id,
          title: t,
          createdAt: now(),
          updatedAt: now(),
        };

        set((state) => ({ lists: [...state.lists, newList] }));
        return id;
      },

      setBudget: (listId, budget) => {
        const b = clampMin(budget, 0);

        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId ? { ...l, budget: b, updatedAt: now() } : l,
          ),
        }));
      },

      addItemToList: (listId, catalogItem) => {
        const base = {
          id: nanoid(),
          listId,
          catalogItemId: catalogItem.id,
          checked: false,
          createdAt: now(),
          updatedAt: now(),
        };

        const newItem: ListItem =
          catalogItem.pricingType === "unit"
            ? { ...base, kind: "unit", qty: 1, unitPrice: 0 }
            : { ...base, kind: "weight", weightKg: 0, pricePerKg: 0 };

        set((state) => ({ items: [...state.items, newItem] }));
      },

      toggleItem: (itemId) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, checked: !i.checked, updatedAt: now() } : i,
          ),
        }));
      },

      updateUnitItem: (itemId, qty, price) => {
        const safeQty = clampMin(qty, 1);
        const safePrice = clampMin(price, 0);

        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId && i.kind === "unit"
              ? { ...i, qty: safeQty, unitPrice: safePrice, updatedAt: now() }
              : i,
          ),
        }));
      },

      updateWeightItem: (itemId, kg, pricePerKg) => {
        const safeKg = clampMin(kg, 0);
        const safePrice = clampMin(pricePerKg, 0);

        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId && i.kind === "weight"
              ? { ...i, weightKg: safeKg, pricePerKg: safePrice, updatedAt: now() }
              : i,
          ),
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== itemId) }));
      },

      duplicateList: (listId) => {
        const state = get();
        const original = state.lists.find((l) => l.id === listId);
        if (!original) return "";

        const newId = nanoid();
        const newList: ShoppingList = {
          ...original,
          id: newId,
          title: `${original.title} (cópia)`,
          createdAt: now(),
          updatedAt: now(),
          completedAt: undefined,
          finalTotal: undefined,
        };

        const newItems = cloneItemsForList({
          sourceItems: state.items,
          sourceListId: listId,
          targetListId: newId,
          resetPrices: false,
        });

        set({
          lists: [...state.lists, newList],
          items: [...state.items, ...newItems],
        });

        return newId;
      },

      completeList: (listId) => {
        const state = get();
        const listItems = state.items.filter((i) => i.listId === listId);
        const total = computeListTotal(listItems);

        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === listId
              ? { ...l, completedAt: now(), finalTotal: total, updatedAt: now() }
              : l,
          ),
        }));
      },

      removeList: (listId) => {
        set((state) => ({
          lists: state.lists.filter((l) => l.id !== listId),
          items: state.items.filter((i) => i.listId !== listId),
        }));
      },

      createFromLastCompleted: () => {
        const state = get();

        const lastCompleted = [...state.lists]
          .filter((l) => l.completedAt)
          .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))[0];

        if (!lastCompleted) return null;

        const newId = nanoid();

        const newList: ShoppingList = {
          id: newId,
          title: `${lastCompleted.title} (nova)`,
          createdAt: now(),
          updatedAt: now(),
        };

        const copiedItems = cloneItemsForList({
          sourceItems: state.items,
          sourceListId: lastCompleted.id,
          targetListId: newId,
          resetPrices: true, // aqui faz sentido “zerar preços”
        });

        set({
          lists: [...state.lists, newList],
          items: [...state.items, ...copiedItems],
        });

        return newId;
      },

      // ------- Recurrence -------
      setRecurrence: (listId, recurrence) => {
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId ? { ...l, recurrence, updatedAt: now() } : l,
          ),
        }));
      },

      generateRecurringList: (listId) => {
        const state = get();
        const original = state.lists.find((l) => l.id === listId);
        if (!original) return null;

        const newId = nanoid();

        const newList: ShoppingList = {
          ...original,
          id: newId,
          createdAt: now(),
          updatedAt: now(),
          completedAt: undefined,
          finalTotal: undefined,
          lastGeneratedAt: now(),
        };

        const newItems = cloneItemsForList({
          sourceItems: state.items,
          sourceListId: listId,
          targetListId: newId,
          resetPrices: false,
        });

        set({
          lists: [...state.lists, newList],
          items: [...state.items, ...newItems],
        });

        return newId;
      },

      // ------- Backup -------
      restoreBackup: (data) => {
        set({
          lists: data.lists,
          items: data.items,
          catalog: data.catalog,
        });
      },
    }),
    {
      name: "shopping-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);