import { create } from "zustand";
import { nanoid } from "nanoid/non-secure";
import type { ShoppingList, ListItem } from "../../domain/models/list";
import type { CatalogItem } from "../../domain/models/catolog";
import { CATALOG_SEED } from "../../domain/seed/catalog";
type ListsState = {
  lists: ShoppingList[];
  items: ListItem[];

  createList: (title: string) => string;
  addItemToList: (listId: string, catalogItem: CatalogItem) => void;
  toggleItem: (itemId: string) => void;
  updateUnitItem: (itemId: string, qty: number, price: number) => void;
  updateWeightItem: (itemId: string, kg: number, pricePerKg: number) => void;
  removeItem: (itemId: string) => void;

  getItemsFromList: (listId: string) => ListItem[];
  getCatalogItem: (catalogItemId: string) => CatalogItem | undefined;
};

export const useListsStore = create<ListsState>((set, get) => ({
  lists: [],
  items: [],

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
    const newItem: ListItem = {
      id: nanoid(),
      listId,
      catalogItemId: catalogItem.id,
      checked: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

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

  getItemsFromList: (listId) => {
    return get().items.filter((i) => i.listId === listId);
  },

  getCatalogItem: (catalogItemId) => {
    return CATALOG_SEED.find((c) => c.id === catalogItemId);
  },
}));
