import React, { useMemo, useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";

type Props = NativeStackScreenProps<RootStackParamList, "Lists">;

export function ListsScreen({ navigation }: Props) {
  const { lists, createList } = useListsStore();
  const [title, setTitle] = useState("");

  function handleCreate() {
    if (!title.trim()) return;

    const id = createList(title);
    setTitle("");
    navigation.navigate("ListDetails", { listId: id });
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Suas listas</Text>

        <Pressable
          onPress={() => navigation.navigate("Catalog")}
          style={styles.linkBtn}
        >
          <Text style={styles.linkText}>Abrir Catálogo</Text>
        </Pressable>
      </View>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate("ListDetails", { listId: item.id })
            }
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>Toque para abrir</Text>
          </Pressable>
        )}
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
  title: { fontSize: 22, fontWeight: "700" },
  linkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  linkText: { fontWeight: "600" },
  card: { padding: 14, borderWidth: 1, borderRadius: 14 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardSub: { marginTop: 4, opacity: 0.7 },
  sep: { height: 10 },
});
