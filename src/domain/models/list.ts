export type RecurrenceType = "weekly" | "biweekly" | "monthly" | null;

export type ShoppingList = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  budget?: number;
  completedAt?: number;
  finalTotal?: number;

  recurrence?: RecurrenceType;
  lastGeneratedAt?: number;
};

type ListItemBase = {
  id: string;
  listId: string;
  catalogItemId: string;

  checked: boolean;

  note?: string;
  createdAt: number;
  updatedAt: number;
};

export type UnitListItem = ListItemBase & {
  kind: "unit";
  qty: number;
  unitPrice: number;
};

export type WeightListItem = ListItemBase & {
  kind: "weight";
  weightKg: number;
  pricePerKg: number;
};

export type ListItem = UnitListItem | WeightListItem;
