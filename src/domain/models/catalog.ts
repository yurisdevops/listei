import { CategoryId } from "./category";

export type PricingType = "unit" | "weight";

export type CatalogItem = {
  id: string;
  name: string;
  categoryId: CategoryId;
  pricingType: PricingType;
  defaultUnit?: "un" | "kg";
  createdBy: "system" | "user";
  createdAt: number;
  favorite?: boolean;

  lastPrice?: number;
  lastPricedAt?: number;
};
