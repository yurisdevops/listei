import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { CATEGORIES } from "../../domain/seed/categories";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import { Pressable } from "react-native";
import { AppText } from "../../ui/components/AppText";
type Props = NativeStackScreenProps<RootStackParamList, "Catalog">;

export function CatalogScreen({ route, navigation }: Props) {
  const { listId } = route.params;
  const addItemToList = useListsStore((s) => s.addItemToList);
  const catalog = useListsStore((s) => s.catalog);
  const toggleFavorite = useListsStore((s) => s.toggleCatalogFavorite);

  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState<
    "all" | (typeof CATEGORIES)[number]["id"]
  >("all");

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();

    const filtered = catalog.filter((i) => {
      const matchName = !query || i.name.toLowerCase().includes(query);
      const matchCat = catFilter === "all" || i.categoryId === catFilter;

      return matchName && matchCat;
    });

    filtered.sort((a, b) => {
      const fa = a.favorite ? 1 : 0;
      const fb = b.favorite ? 1 : 0;

      if (fb !== fa) return fb - fa;

      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [catalog, q, catFilter]);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.manageBtn}
        onPress={() => navigation.navigate("CatalogManager")}
      >
        <AppText style={{ fontWeight: "700" }}>Gerenciar catálogo</AppText>
      </Pressable>
      <AppText style={styles.title}>Itens pré-definidos</AppText>

      <TextInput
        placeholder="Buscar item (ex: arroz, banana...)"
        value={q}
        onChangeText={setQ}
        style={styles.search}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => setCatFilter("all")}
            style={[styles.chip, catFilter === "all" && styles.chipActive]}
          >
            <AppText style={{ fontWeight: "700" }}>Todas</AppText>
          </Pressable>

          {CATEGORIES.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.chip, catFilter === c.id && styles.chipActive]}
              onPress={() => setCatFilter(c.id)}
            >
              <AppText style={{ fontWeight: "700" }}>
                {c.emoji} {c.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => {
          const cat = CATEGORIES.find((c) => c.id === item.categoryId);

          return (
            <Pressable
              style={styles.row}
              onPress={() => {
                addItemToList(listId, item);
                navigation.goBack();
              }}
            >
              <AppText style={styles.name}>
                {cat?.emoji ?? "•"} {item.name}
              </AppText>

              <View style={styles.right}>
                <AppText style={styles.meta} numberOfLines={1}>
                  {item.pricingType === "weight" ? "peso" : "unid"}
                  {item.defaultUnit ? ` • ${item.defaultUnit}` : ""}
                </AppText>

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  hitSlop={10}
                >
                  <AppText style={styles.star}>
                    {item.favorite ? "⭐" : "☆"}
                  </AppText>
                </Pressable>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: "700" },

  badge: { opacity: 0.7 },
  sep: { height: 10 },
  manageBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },

  chip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 20,
  },

  chipActive: {
    backgroundColor: "#e8f5e9",
    borderColor: "#2e7d32",
  },

  row: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },

  meta: {
    opacity: 0.7,
    marginRight: 10,
  },

  star: {
    fontSize: 18,
  },
});
