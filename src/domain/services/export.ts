import type { CatalogItem } from "../models/catolog";
import type { ListItem } from "../models/list";
import { CATEGORIES } from "../seed/categories";
import { calculateItemTotal, calculateListTotal } from "./calc";
import { groupItemsByCategory } from "./group";
import { formatBRL } from "../../utils/money";

type Props = {
  listTitle: string;
  createdAt?: number;
  budget?: number;
  items: ListItem[];
  getCatalogItem: (id: string) => CatalogItem | undefined;
};

export function buildListExportText({
  getCatalogItem,
  items,
  listTitle,
  budget,
  createdAt,
}: Props) {
  const total = calculateListTotal(items);
  const grouped = groupItemsByCategory(items, getCatalogItem);

  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  let text = `🛒 Lista: ${listTitle}\n📅 ${dateStr}\n`;

  if (typeof budget === "number") {
    text += `💰 Orçamento: ${formatBRL(budget)}\n`;
  }

  text += `✅ Total: ${formatBRL(total)}\n\n`;

  for (const [categoryId, data] of Object.entries(grouped)) {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    text += `${category?.emoji ?? "•"} ${category?.label ?? categoryId}\n`;

    for (const item of data.items) {
      const catItem = getCatalogItem(item.catalogItemId);
      const name = catItem?.name ?? "Item";

      if (item.kind === "unit") {
        const qty = item.qty;
        const unit = catItem?.defaultUnit ?? "un";
        const price = item.unitPrice;
        text += `- ${name} — ${qty} ${unit} × ${formatBRL(price)} = ${formatBRL(
          calculateItemTotal(item),
        )}\n`;
      } else {
        const kg = item.weightKg;
        const priceKg = item.pricePerKg;
        text += `- ${name} — ${kg} kg × ${formatBRL(priceKg)}/kg = ${formatBRL(
          calculateItemTotal(item),
        )}\n`;
      }
    }
    text += `Subtotal: ${formatBRL(data.total)}\n\n`;
  }
  return text.trim();
}
