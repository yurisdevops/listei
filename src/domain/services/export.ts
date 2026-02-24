import type { CatalogItem } from "../models/catolog";
import type { ListItem } from "../models/list";
import { CATEGORIES } from "../seed/categories";
import { calculateItemTotal, calculateListTotal } from "./calc";
import { groupItemsByCategory } from "./group";

type Props = {
  listTitle: string;
  createdAt?: number;
  budget?: number;
  items: ListItem[];
  getCatalogItem: (id: string) => CatalogItem | undefined;
};

function money(n: number) {
  return `R$ ${n.toFixed(2).replace(".", ",")}`;
}

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
    text += `💰 Orçamento: ${money(budget)}\n`;
  }

  text += `✅ Total: ${money(total)}\n\n`;

  for (const [categoryId, data] of Object.entries(grouped)) {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    text += `${category?.emoji ?? "•"} ${category?.label ?? categoryId}\n`;

    for (const item of data.items) {
      const catItem = getCatalogItem(item.catalogItemId);
      const name = catItem?.name ?? "Item";

      if ("qty" in item) {
        const qty = item.qty ?? 0;
        const unit = catItem?.defaultUnit ?? "un";
        const price = item.unitPrice ?? 0;
        text += `- ${name} — ${qty} ${unit} × ${money(price)} = ${money(
          calculateItemTotal(item),
        )}\n`;
      } else {
        const kg = item.weightKg ?? 0;
        const priceKg = item.pricePerKg ?? 0;
        text += `- ${name} — ${kg} kg × ${money(priceKg)}/kg = ${money(
          calculateItemTotal(item),
        )}\n`;
      }
    }
    text += `Subtotal: ${money(data.total)}\n\n`;
  }
  return text.trim();
}
