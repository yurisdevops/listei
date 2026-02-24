import type { ShoppingList } from "../models/list";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function fmtDayLabel(d: Date) {
  // "seg", "ter"...
  return d.toLocaleDateString("pt-BR", { weekday: "short" });
}

export type DayPoint = {
  label: string;
  value: number;
  date: Date;
};

export function calculateLastDaysTotals(
  lists: ShoppingList[],
  days = 7,
): DayPoint[] {
  const now = new Date();
  const points: DayPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = startOfDay(new Date(now));
    d.setDate(d.getDate() - i);

    const total = lists
      .filter((l) => l.completedAt)
      .filter((l) => sameDay(startOfDay(new Date(l.completedAt!)), d))
      .reduce((acc, l) => acc + (l.finalTotal ?? 0), 0);

    points.push({ label: fmtDayLabel(d), value: total, date: d });
  }

  return points;
}
