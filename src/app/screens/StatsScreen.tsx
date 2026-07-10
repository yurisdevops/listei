import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useListsStore } from "../../state/store/lists.store";
import {
  calculateMonthlyTotal,
  calculatePreviousMonthTotal,
  calculateTopItems,
  calculateTopCategories,
} from "../../domain/services/stats";
import { calculateLastDaysTotals } from "../../domain/services/timeseries";
import { shouldGenerate } from "../../domain/services/recurrence";
import { CATEGORIES } from "../../domain/seed/categories";

import { AppText } from "../../ui/components/AppText";
import { Screen } from "../../ui/components/Screen";
import { SimpleBarChart } from "../../ui/components/SimpleBarChart";
import { QuickActions } from "../../ui/components/QuickActions";
import { useTheme } from "../../ui/theme/ThemeProvider";

import type { TabsParamList, ListsStackParamList } from "../navigation/types";
import { formatBRL } from "../../utils/money";

function pct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

type ListsStackNav = NativeStackNavigationProp<ListsStackParamList>;
type TabsNav = BottomTabNavigationProp<TabsParamList>;

// Navigation do Stats (que está dentro de StatsTab),
// mas precisa navegar pra telas dentro do ListsTab (stack aninhado)
type StatsNavigation = CompositeNavigationProp<
  TabsNav,
  NativeStackNavigationProp<{ ListsTab: NavigatorScreenParams<ListsStackParamList> }>
>;

export function StatsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<StatsNavigation>();

  const lists = useListsStore((s) => s.lists);
  const items = useListsStore((s) => s.items);
  const getCatalogItem = useListsStore((s) => s.getCatalogItem);
  const generateRecurringList = useListsStore((s) => s.generateRecurringList);

  const createList = useListsStore((s) => s.createList);
  const createFromLastCompleted = useListsStore((s) => s.createFromLastCompleted);

  const lastCreatedList = useMemo(() => {
    // evita sort (O(n log n)) — pega o maior createdAt em O(n)
    let best = null as any;
    for (const l of lists) {
      if (!best) best = l;
      else if ((l.createdAt ?? 0) > (best.createdAt ?? 0)) best = l;
    }
    return best;
  }, [lists]);

  const monthlyTotal = useMemo(() => calculateMonthlyTotal(lists), [lists]);
  const prevTotal = useMemo(() => calculatePreviousMonthTotal(lists), [lists]);
  const last7 = useMemo(() => calculateLastDaysTotals(lists, 7), [lists]);

  const variation =
    prevTotal === 0 ? 0 : ((monthlyTotal - prevTotal) / prevTotal) * 100;

  const topItems = useMemo(
    () => calculateTopItems(items, getCatalogItem),
    [items, getCatalogItem]
  );
  const topCats = useMemo(
    () => calculateTopCategories(items, getCatalogItem),
    [items, getCatalogItem]
  );

  const recurringDue = useMemo(() => lists.filter((l) => shouldGenerate(l)), [lists]);

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
        navigation.navigate("ListsTab", {
          screen: "ListDetails",
          params: { listId: id },
        });
      },
    },
    {
      key: "from-last",
      label: "Base: última",
      icon: "repeat-outline" as const,
      onPress: () => {
        const id = createFromLastCompleted?.();
        if (!id) return Alert.alert("Ops", "Nenhuma lista finalizada encontrada.");

        navigation.navigate("ListsTab", {
          screen: "ListDetails",
          params: { listId: id },
        });
      },
    },
    {
      key: "catalog",
      label: "Abrir catálogo",
      icon: "pricetags-outline" as const,
      onPress: () => {
        if (!lastCreatedList?.id) return Alert.alert("Ops", "Crie uma lista primeiro.");

        navigation.navigate("ListsTab", {
          screen: "Catalog",
          params: { listId: lastCreatedList.id },
        });
      },
    },
    {
      key: "favorites",
      label: "Favoritos",
      icon: "star-outline" as const,
      onPress: () => {
        if (!lastCreatedList?.id) return Alert.alert("Ops", "Crie uma lista primeiro.");

        navigation.navigate("ListsTab", {
          screen: "Catalog",
          params: { listId: lastCreatedList.id, filterFavorites: true },
        });
      },
    },
    {
      key: "open-last",
      label: "Abrir última",
      icon: "time-outline" as const,
      onPress: () => {
        if (!lastCreatedList?.id) return Alert.alert("Ops", "Nenhuma lista criada ainda.");

        navigation.navigate("ListsTab", {
          screen: "ListDetails",
          params: { listId: lastCreatedList.id },
        });
      },
    },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <AppText style={[styles.title, { color: theme.colors.text }]}>
          📊 Dashboard
        </AppText>

        <QuickActions actions={actions} />

        {recurringDue.length > 0 && (
          <View style={[styles.block, cardStyle]}>
            <AppText style={[styles.blockTitle, { color: theme.colors.text }]}>
              🔁 Listas recorrentes
            </AppText>

            {recurringDue.map((l) => (
              <Pressable
                key={l.id}
                onPress={() => {
                  const newId = generateRecurringList(l.id);
                  if (newId) {
                    navigation.navigate("ListsTab", {
                      screen: "ListDetails",
                      params: { listId: newId },
                    });
                  }
                }}
                style={{ paddingVertical: 8 }}
              >
                <AppText style={{ color: theme.colors.text }}>
                  {l.title} — recriar agora
                </AppText>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.grid}>
          <View style={[styles.card, cardStyle]}>
            <AppText muted style={styles.label}>
              Mês atual
            </AppText>
            <AppText style={[styles.value, { color: theme.colors.text }]}>
              {formatBRL(monthlyTotal)}
            </AppText>
          </View>

          <View style={[styles.card, cardStyle]}>
            <AppText muted style={styles.label}>
              Mês anterior
            </AppText>
            <AppText style={[styles.value, { color: theme.colors.text }]}>
              {formatBRL(prevTotal)}
            </AppText>
          </View>

          <View style={[styles.cardFull, cardStyle]}>
            <AppText muted style={styles.label}>
              Variação
            </AppText>
            <AppText style={[styles.value, { fontSize: 20, color: theme.colors.text }]}>
              {pct(variation)}
            </AppText>
            <AppText muted style={styles.hint}>
              Comparação com o mês anterior (listas finalizadas)
            </AppText>
          </View>
        </View>

        <View style={[styles.block, { borderColor: theme.colors.border }]}>
          <AppText style={[styles.blockTitle, { color: theme.colors.text }]}>
            📈 Últimos 7 dias
          </AppText>

          {last7.every((p) => p.value === 0) ? (
            <AppText style={styles.empty}>
              Finalize uma lista para aparecer o gráfico.
            </AppText>
          ) : (
            <SimpleBarChart data={last7} />
          )}
        </View>

        <View style={[styles.block, cardStyle]}>
          <AppText style={[styles.blockTitle, { color: theme.colors.text }]}>
            🔥 Top itens (gasto)
          </AppText>

          {topItems.length === 0 ? (
            <AppText muted>Finalize uma lista para gerar estatísticas.</AppText>
          ) : (
            topItems.map(([name, total]) => (
              <View key={name} style={styles.row}>
                <AppText style={[styles.rowLeft, { color: theme.colors.text }]} numberOfLines={1}>
                  {name}
                </AppText>
                <AppText style={[styles.rowRight, { color: theme.colors.text }]}>
                  {formatBRL(total)}
                </AppText>
              </View>
            ))
          )}
        </View>

        <View style={[styles.block, cardStyle]}>
          <AppText style={[styles.blockTitle, { color: theme.colors.text }]}>
            🧩 Top categorias (gasto)
          </AppText>

          {topCats.length === 0 ? (
            <AppText muted>Sem dados ainda.</AppText>
          ) : (
            topCats.map(([categoryId, total]) => {
              const cat = CATEGORIES.find((c) => c.id === categoryId);
              const label = cat ? `${cat.emoji} ${cat.label}` : categoryId;

              return (
                <View key={categoryId} style={styles.row}>
                  <AppText style={[styles.rowLeft, { color: theme.colors.text }]} numberOfLines={1}>
                    {label}
                  </AppText>
                  <AppText style={[styles.rowRight, { color: theme.colors.text }]}>
                    {formatBRL(total)}
                  </AppText>
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
  empty: { marginTop: 8, opacity: 0.7, lineHeight: 20 },
});