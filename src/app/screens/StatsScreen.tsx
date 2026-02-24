import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useListsStore } from "../../state/store/lists.store";
import {
  calculateMonthlyTotal,
  calculatePreviousMonthTotal,
  calculateTopItems,
  calculateTopCategories,
} from "../../domain/services/stats";
import { CATEGORIES } from "../../domain/seed/categories";
import { useTheme } from "@react-navigation/native";

function money(n: number) {
  return `R$ ${n.toFixed(2).replace(".", ",")}`;
}

function pct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

export function StatsScreen() {
  const lists = useListsStore((s) => s.lists);
  const items = useListsStore((s) => s.items);
  const getCatalogItem = useListsStore((s) => s.getCatalogItem);

  const theme = useTheme();

  const monthlyTotal = useMemo(() => calculateMonthlyTotal(lists), [lists]);
  const prevTotal = useMemo(() => calculatePreviousMonthTotal(lists), [lists]);

  const variation =
    prevTotal === 0 ? 0 : ((monthlyTotal - prevTotal) / prevTotal) * 100;

  const topItems = useMemo(
    () => calculateTopItems(items, getCatalogItem),
    [items, getCatalogItem],
  );

  const topCats = useMemo(
    () => calculateTopCategories(items, getCatalogItem),
    [items, getCatalogItem],
  );

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Text style={styles.title}>📊 Dashboard</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.label}>Mês atual</Text>
          <Text style={styles.value}>{money(monthlyTotal)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Mês anterior</Text>
          <Text style={styles.value}>{money(prevTotal)}</Text>
        </View>

        <View style={styles.cardFull}>
          <Text style={styles.label}>Variação</Text>
          <Text style={[styles.value, { fontSize: 20 }]}>{pct(variation)}</Text>
          <Text style={styles.hint}>
            Comparação com o mês anterior (listas finalizadas)
          </Text>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>🔥 Top itens (gasto)</Text>
        {topItems.length === 0 ? (
          <Text style={styles.empty}>
            Finalize uma lista para gerar estatísticas.
          </Text>
        ) : (
          topItems.map(([name, total]) => (
            <View key={name} style={styles.row}>
              <Text style={styles.rowLeft} numberOfLines={1}>
                {name}
              </Text>
              <Text style={styles.rowRight}>{money(total)}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>🧩 Top categorias (gasto)</Text>
        {topCats.length === 0 ? (
          <Text style={styles.empty}>Sem dados ainda.</Text>
        ) : (
          topCats.map(([categoryId, total]) => {
            const cat = CATEGORIES.find((c) => c.id === categoryId);
            const label = cat ? `${cat.emoji} ${cat.label}` : categoryId;

            return (
              <View key={categoryId} style={styles.row}>
                <Text style={styles.rowLeft} numberOfLines={1}>
                  {label}
                </Text>
                <Text style={styles.rowRight}>{money(total)}</Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 30 },
  title: { fontSize: 22, fontWeight: "900", marginBottom: 14 },

  grid: { gap: 10 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  cardFull: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  label: { opacity: 0.7, fontWeight: "700" },
  value: { fontSize: 18, fontWeight: "900", marginTop: 6 },
  hint: { marginTop: 6, opacity: 0.6 },

  block: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  blockTitle: { fontSize: 16, fontWeight: "900", marginBottom: 10 },
  empty: { opacity: 0.7 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  rowLeft: { flex: 1, fontWeight: "700" },
  rowRight: { fontWeight: "900" },
});
