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

export type ListItem = {
  id: string;
  listId: string;
  catalogItemId: string;

  checked: boolean;

  qty?: number;
  unitPrice?: number;

  weightKg?: number;
  pricePerKg?: number;

  note?: string;
  createdAt: number;
  updatedAt: number;
};
