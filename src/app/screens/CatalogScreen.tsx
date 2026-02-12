import React, { useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { CATEGORIES } from "../../domain/seed/categories";
import { CATALOG_SEED } from "../../domain/seed/catalog";

export function CatalogScreen() {
  const items = useMemo(() => CATALOG_SEED, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Itens pré-definidos</Text>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => {
          const cat = CATEGORIES.find((c) => c.id === item.categoryId);
          return (
            <View style={styles.row}>
              <Text style={styles.name}>
                {cat?.emoji ?? "•"} {item.name}
              </Text>
              <Text style={styles.badge}>
                {item.pricingType === "weight" ? "por peso" : "unitário"}
              </Text>
              {item.defaultUnit && <Text>{item.defaultUnit}</Text>}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: "700" },
  row: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  name: { fontSize: 16, fontWeight: "600", flexShrink: 1 },
  badge: { opacity: 0.7 },
  sep: { height: 10 },
});
