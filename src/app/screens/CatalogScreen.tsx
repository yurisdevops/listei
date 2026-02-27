import React, { useMemo, useState, useDeferredValue } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { CATEGORIES } from "../../domain/seed/categories";
import type { ListsStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import { AppText } from "../../ui/components/AppText";
import { Screen } from "../../ui/components/Screen";
import { useTheme } from "../../ui/theme/ThemeProvider";

type Props = NativeStackScreenProps<ListsStackParamList, "Catalog">;

type CategoryFilter = "all" | (typeof CATEGORIES)[number]["id"];

export function CatalogScreen({ route, navigation }: Props) {
  const { theme } = useTheme();

  const { listId, filterFavorites } = route.params;
  const addItemToList = useListsStore((s) => s.addItemToList);
  const catalog = useListsStore((s) => s.catalog);
  const toggleFavorite = useListsStore((s) => s.toggleCatalogFavorite);

  const [q, setQ] = useState("");
  const qDeferred = useDeferredValue(q);
  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");

  const items = useMemo(() => {
    const query = qDeferred.trim().toLowerCase();

    const filtered = catalog.filter((i) => {
      const matchFavorite = filterFavorites ? i.favorite : true;
      const matchName = !query || i.name.toLowerCase().includes(query);
      const matchCat = catFilter === "all" || i.categoryId === catFilter;
      return matchFavorite && matchName && matchCat;
    });

    filtered.sort((a, b) => {
      const fa = a.favorite ? 1 : 0;
      const fb = b.favorite ? 1 : 0;
      if (fb !== fa) return fb - fa;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [catalog, qDeferred, catFilter, filterFavorites]);

  const inputStyle = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
  };

  const rowStyle = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  };

  const chipBase = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  };

  const chipActive = {
    backgroundColor: theme.colors.chipBg,
    borderColor: theme.colors.primary,
  };

  return (
    <Screen style={{ gap: 12 }} padded>
      <Pressable
        style={[styles.manageBtn, chipBase]}
        onPress={() => navigation.navigate("CatalogManager")}
      >
        <AppText style={{ fontWeight: "900", color: theme.colors.text }}>
          Gerenciar catálogo
        </AppText>
      </Pressable>

      <AppText style={[styles.title, { color: theme.colors.text }]}>
        Itens do catálogo
      </AppText>

      <TextInput
        placeholder="Buscar item (ex: arroz, banana...)"
        placeholderTextColor={theme.colors.mutedText}
        value={q}
        onChangeText={setQ}
        style={[styles.search, inputStyle]}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipsRow}>
          <Pressable
            onPress={() => setCatFilter("all")}
            style={[styles.chip, chipBase, catFilter === "all" && chipActive]}
          >
            <AppText style={{ fontWeight: "800", color: theme.colors.text }}>
              Todas
            </AppText>
          </Pressable>

          {CATEGORIES.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.chip, chipBase, catFilter === c.id && chipActive]}
              onPress={() => setCatFilter(c.id)}
            >
              <AppText style={{ fontWeight: "800", color: theme.colors.text }}>
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
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const cat = CATEGORIES.find((c) => c.id === item.categoryId);

          return (
            <Pressable
              style={[styles.row, rowStyle]}
              onPress={() => {
                addItemToList(listId, item);
                navigation.goBack();
              }}
            >
              <AppText
                style={[styles.name, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {cat?.emoji ?? "•"} {item.name}
              </AppText>

              <View style={styles.right}>
                <AppText muted style={styles.meta} numberOfLines={1}>
                  {item.pricingType === "weight" ? "peso" : "unid"}
                  {item.defaultUnit ? ` • ${item.defaultUnit}` : ""}
                </AppText>

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel={
                    item.favorite
                      ? `Remover ${item.name} dos favoritos`
                      : `Adicionar ${item.name} aos favoritos`
                  }
                >
                  <AppText style={[styles.star, { color: theme.colors.text }]}>
                    {item.favorite ? "⭐" : "☆"}
                  </AppText>
                </Pressable>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={() => (
          <AppText muted style={{ marginTop: 10 }}>
            Nenhum item encontrado.
          </AppText>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "900" },
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

  chipsRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 2,
  },

  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 38,
    justifyContent: "center",
    marginBottom: 18, // menor que 30 pra não “comer” espaço
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
    fontWeight: "800",
    marginRight: 10,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },

  meta: { marginRight: 10 },
  star: { fontSize: 18 },
});
