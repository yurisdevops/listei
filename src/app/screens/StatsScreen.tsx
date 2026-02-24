import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useListsStore } from "../../state/store/lists.store";
import {
  calculateMonthlyTotal,
  calculatePreviousMonthTotal,
  calculateTopItems,
  calculateTopCategories,
} from "../../domain/services/stats";
import { CATEGORIES } from "../../domain/seed/categories";
import { AppText } from "../../ui/components/AppText";
import { Screen } from "../../ui/components/Screen";
import { useTheme } from "../../ui/theme/ThemeProvider";
import { calculateLastDaysTotals } from "../../domain/services/timeseries";
import { SimpleBarChart } from "../../ui/components/SimpleBarChart";
import { useNavigation } from "@react-navigation/native";
import { QuickActions } from "../../ui/components/QuickActions";

function money(n: number) {
  return `R$ ${n.toFixed(2).replace(".", ",")}`;
}
function pct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

export function StatsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const lists = useListsStore((s) => s.lists);
  const items = useListsStore((s) => s.items);
  const getCatalogItem = useListsStore((s) => s.getCatalogItem);

  const createList = useListsStore((s) => s.createList);
  const createFromLastCompleted = useListsStore(
    (s) => s.createFromLastCompleted,
  );
  const lastCreatedList = [...lists].sort(
    (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0),
  )[0];

  const monthlyTotal = useMemo(() => calculateMonthlyTotal(lists), [lists]);
  const prevTotal = useMemo(() => calculatePreviousMonthTotal(lists), [lists]);

  const last7 = useMemo(() => calculateLastDaysTotals(lists, 7), [lists]);

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

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  };

  const actions = [
    {
      key: "new",
      label: "Nova lista",
      icon: "add-circle-outline" as const,
      onPress: () => {
        const id = createList("Nova lista");
        // navigate to details
        // @ts-ignore - navigation typing in hooks
        navigation.navigate("ListDetails", { listId: id });
      },
    },
    {
      key: "from-last",
      label: "Base: última",
      icon: "repeat-outline" as const,
      onPress: () => {
        const id = createFromLastCompleted?.();
        if (id) {
          // @ts-ignore
          navigation.navigate("ListDetails", { listId: id });
        } else {
          alert("Nenhuma lista finalizada encontrada.");
        }
      },
    },
    {
      key: "catalog",
      label: "Abrir catálogo",
      icon: "pricetags-outline" as const,
      onPress: () => {
        // @ts-ignore
        navigation.navigate("Catalog", { listId: lastCreatedList?.id ?? "" });
      },
    },
    {
      key: "favorites",
      label: "Favoritos",
      icon: "star-outline" as const,
      onPress: () => {
        // open catalog manager or catalog filtered by favorites
        // we'll navigate to Catalog and the screen can use route params to pre-filter if you implement it
        // @ts-ignore
        navigation.navigate("Catalog", {
          listId: lastCreatedList?.id ?? "",
          filterFavorites: true,
        });
      },
    },
    {
      key: "open-last",
      label: "Abrir última",
      icon: "time-outline" as const,
      onPress: () => {
        if (!lastCreatedList) {
          alert("Nenhuma lista criada ainda.");
          return;
        }
        // @ts-ignore
        navigation.navigate("ListDetails", { listId: lastCreatedList.id });
      },
    },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <AppText style={styles.title}>📊 Dashboard</AppText>
        <QuickActions actions={actions} />

        <View style={styles.grid}>
          <View style={[styles.card, cardStyle]}>
            <AppText muted style={styles.label}>
              Mês atual
            </AppText>
            <AppText style={styles.value}>{money(monthlyTotal)}</AppText>
          </View>

          <View style={[styles.card, cardStyle]}>
            <AppText muted style={styles.label}>
              Mês anterior
            </AppText>
            <AppText style={styles.value}>{money(prevTotal)}</AppText>
          </View>

          <View style={[styles.cardFull, cardStyle]}>
            <AppText muted style={styles.label}>
              Variação
            </AppText>
            <AppText style={[styles.value, { fontSize: 20 }]}>
              {pct(variation)}
            </AppText>
            <AppText muted style={styles.hint}>
              Comparação com o mês anterior (listas finalizadas)
            </AppText>
          </View>
        </View>

        <View style={styles.block}>
          <AppText style={styles.blockTitle}>📈 Últimos 7 dias</AppText>

          {last7.every((p) => p.value === 0) ? (
            <AppText style={styles.empty}>
              Finalize uma lista para aparecer o gráfico.
            </AppText>
          ) : (
            <SimpleBarChart data={last7} />
          )}
        </View>

        <View style={[styles.block, cardStyle]}>
          <AppText style={styles.blockTitle}>🔥 Top itens (gasto)</AppText>
          {topItems.length === 0 ? (
            <AppText muted>Finalize uma lista para gerar estatísticas.</AppText>
          ) : (
            topItems.map(([name, total]) => (
              <View key={name} style={styles.row}>
                <AppText style={styles.rowLeft} numberOfLines={1}>
                  {name}
                </AppText>
                <AppText style={styles.rowRight}>{money(total)}</AppText>
              </View>
            ))
          )}
        </View>

        <View style={[styles.block, cardStyle]}>
          <AppText style={styles.blockTitle}>🧩 Top categorias (gasto)</AppText>
          {topCats.length === 0 ? (
            <AppText muted>Sem dados ainda.</AppText>
          ) : (
            topCats.map(([categoryId, total]) => {
              const cat = CATEGORIES.find((c) => c.id === categoryId);
              const label = cat ? `${cat.emoji} ${cat.label}` : categoryId;

              return (
                <View key={categoryId} style={styles.row}>
                  <AppText style={styles.rowLeft} numberOfLines={1}>
                    {label}
                  </AppText>
                  <AppText style={styles.rowRight}>{money(total)}</AppText>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900", marginBottom: 14 },
  grid: { gap: 10 },
  card: { borderWidth: 1, borderRadius: 14, padding: 14 },
  cardFull: { borderWidth: 1, borderRadius: 14, padding: 14 },
  label: { fontWeight: "700" },
  value: { fontSize: 18, fontWeight: "900", marginTop: 6 },
  hint: { marginTop: 6 },
  block: { marginTop: 14, borderWidth: 1, borderRadius: 14, padding: 14 },
  blockTitle: { fontSize: 16, fontWeight: "900", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  rowLeft: { flex: 1, fontWeight: "700" },
  rowRight: { fontWeight: "900" },
  empty: {
    marginTop: 8,
    opacity: 0.7,
    lineHeight: 20,
  },
});
