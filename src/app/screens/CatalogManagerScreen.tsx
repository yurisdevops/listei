import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import { CATEGORIES } from "../../domain/seed/categories";

type Props = NativeStackScreenProps<RootStackParamList, "CatalogManager">;

export function CatalogManagerScreen({ navigation }: Props) {
  const catalog = useListsStore((s) => s.catalog);
  const removeCatalogItem = useListsStore((s) => s.removeCatalogItem);

  const [editingId, setEditingId] = useState<string | null>(null);

  const data = useMemo(() => catalog, [catalog]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Catálogo</Text>

        <Pressable
          style={styles.btn}
          onPress={() => navigation.navigate("CatalogEditor", { id: null })}
        >
          <Text style={{ fontWeight: "700" }}>+ Novo</Text>
        </Pressable>
      </View>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const cat = CATEGORIES.find((c) => c.id === item.categoryId);
          return (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>
                  {cat?.emoji ?? "•"} {item.name}
                </Text>
                <Text style={styles.sub}>
                  {cat?.label ?? item.categoryId} •{" "}
                  {item.pricingType === "weight" ? "por peso" : "unitário"}
                </Text>
              </View>

              <Pressable
                style={[styles.smallBtn, { borderWidth: 1 }]}
                onPress={() =>
                  navigation.navigate("CatalogEditor", { id: item.id })
                }
              >
                <Text>Editar</Text>
              </Pressable>

              <Pressable
                style={[styles.smallBtn, { backgroundColor: "#c62828" }]}
                onPress={() => {
                  const res = removeCatalogItem(item.id);
                  if (!res.ok) {
                    // depois a gente troca por modal/toast
                    alert(res.reason);
                  }
                }}
              >
                <Text style={{ color: "#fff" }}>Del</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700" },
  btn: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  card: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  name: { fontSize: 16, fontWeight: "700" },
  sub: { opacity: 0.7, marginTop: 2 },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 },
});
