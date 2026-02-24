import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid/non-secure";

import type { ShoppingList, ListItem } from "../../domain/models/list";
import type { CatalogItem } from "../../domain/models/catolog";
import { CATALOG_SEED } from "../../domain/seed/catalog";
import type { CategoryId } from "../../domain/models/category";

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
    patch: Partial<
      Pick<CatalogItem, "name" | "categoryId" | "pricingType" | "defaultUnit">
    >,
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

  getCatalogItem: (catalogItemId: string) => CatalogItem | undefined;
};

export const useListsStore = create<ListsState>()(
  persist(
    (set, get) => ({
      lists: [],
      items: [],
      catalog: CATALOG_SEED,

      setBudget: (listId, budget) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, budget, updatedAt: Date.now() }
              : list,
          ),
        }));
      },

      createList: (title) => {
        const id = nanoid();

        const newList: ShoppingList = {
          id,
          title,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({ lists: [...state.lists, newList] }));
        return id;
      },

      addItemToList: (listId, catalogItem) => {
        const base: ListItem = {
          id: nanoid(),
          listId,
          catalogItemId: catalogItem.id,
          checked: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const newItem: ListItem =
          catalogItem.pricingType === "unit"
            ? { ...base, qty: 1, unitPrice: 0 }
            : { ...base, weightKg: 0, pricePerKg: 0 };

        set((state) => ({ items: [...state.items, newItem] }));
      },

      toggleItem: (itemId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item,
          ),
        }));
      },

      updateUnitItem: (itemId, qty, price) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, qty, unitPrice: price, updatedAt: Date.now() }
              : item,
          ),
        }));
      },

      updateWeightItem: (itemId, kg, pricePerKg) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, weightKg: kg, pricePerKg, updatedAt: Date.now() }
              : item,
          ),
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      getCatalogItem: (catalogItemId) => {
        return get().catalog.find((c) => c.id === catalogItemId);
      },

      duplicateList: (listId) => {
        const state = get();
        const original = state.lists.find((l) => l.id === listId);
        if (!original) return "";

        const newId = nanoid();

        const newList = {
          ...original,
          id: newId,
          title: original.title + " (cópia)",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          completedAt: undefined,
        };

        const newItems = state.items
          .filter((i) => i.listId === listId)
          .map((item) => ({
            ...item,
            id: nanoid(),
            listId: newId,
            checked: false,
          }));

        set({
          lists: [...state.lists, newList],
          items: [...state.items, ...newItems],
        });

        return newId;
      },

      completeList: (listId) => {
        const { items } = get();

        const total = items
          .filter((i) => i.listId === listId)
          .reduce((acc, item) => {
            if ("qty" in item) {
              return acc + (item.qty ?? 0) * (item.unitPrice ?? 0);
            }
            return acc + (item.weightKg ?? 0) * (item.pricePerKg ?? 0);
          }, 0);

        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  completedAt: Date.now(),
                  finalTotal: total,
                }
              : list,
          ),
        }));
      },

      removeList: (listId) => {
        set((state) => ({
          lists: state.lists.filter((l) => l.id !== listId),
          items: state.items.filter((i) => i.listId !== listId),
        }));
      },
      addCatalogItem: (data) => {
        const id = nanoid();
        const item: CatalogItem = {
          id,
          name: data.name.trim(),
          categoryId: data.categoryId,
          pricingType: data.pricingType,
          defaultUnit:
            data.defaultUnit ?? (data.pricingType === "unit" ? "un" : "kg"),
          createdBy: "user",
          createdAt: Date.now(),
        };

        set((state) => ({ catalog: [item, ...state.catalog] }));
        return id;
      },

      updateCatalogItem: (id, patch) => {
        set((state) => ({
          catalog: state.catalog.map((c) =>
            c.id === id ? { ...c, ...patch } : c,
          ),
        }));
      },

      removeCatalogItem: (id) => {
        const used = get().items.some((i) => i.catalogItemId === id);
        if (used)
          return {
            ok: false,
            reason: "Esse item está sendo usado em alguma lista.",
          };

        set((state) => ({ catalog: state.catalog.filter((c) => c.id !== id) }));
        return { ok: true };
      },

      toggleCatalogFavorite: (id) => {
        set((state) => ({
          catalog: state.catalog.map((c) =>
            c.id === id ? { ...c, favorite: !c.favorite } : c,
          ),
        }));
      },
      createFromLastCompleted: () => {
        const state = get();

        const lastCompleted = [...state.lists]
          .filter((l) => l.completedAt)
          .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))[0];

        if (!lastCompleted) return null;

        const newId = nanoid();

        const newList = {
          id: newId,
          title: lastCompleted.title + " (nova)",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const copiedItems = state.items
          .filter((i) => i.listId === lastCompleted.id)
          .map((item) => {
            const base = {
              id: nanoid(),
              listId: newId,
              catalogItemId: item.catalogItemId,
              checked: false,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };

            if ("qty" in item) {
              return { ...base, qty: 1, unitPrice: 0 };
            }

            return { ...base, weightKg: 0, pricePerKg: 0 };
          });

        set({
          lists: [...state.lists, newList],
          items: [...state.items, ...copiedItems],
        });

        return newId;
      },
    }),
    {
      name: "shopping-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
