import React, { useMemo, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import { CATEGORIES } from "../../domain/seed/categories";

type Props = NativeStackScreenProps<RootStackParamList, "CatalogEditor">;

export function CatalogEditorScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const catalog = useListsStore((s) => s.catalog);
  const addCatalogItem = useListsStore((s) => s.addCatalogItem);
  const updateCatalogItem = useListsStore((s) => s.updateCatalogItem);

  const editing = useMemo(
    () => catalog.find((c) => c.id === id),
    [catalog, id],
  );

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(
    CATEGORIES[0]?.id ?? "mercearia",
  );
  const [pricingType, setPricingType] = useState<"unit" | "weight">("unit");

  useEffect(() => {
    if (!editing) return;
    setName(editing.name);
    setCategoryId(editing.categoryId);
    setPricingType(editing.pricingType);
  }, [editing?.id]);

  function save() {
    if (!name.trim()) return;

    if (!id) {
      addCatalogItem({ name: name.trim(), categoryId, pricingType });
    } else {
      updateCatalogItem(id, { name: name.trim(), categoryId, pricingType });
    }
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{id ? "Editar item" : "Novo item"}</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ex: Café"
        style={styles.input}
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pills}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.id}
            style={[styles.pill, c.id === categoryId && styles.pillActive]}
            onPress={() => setCategoryId(c.id)}
          >
            <Text style={{ fontWeight: "700" }}>
              {c.emoji} {c.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Tipo</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          style={[styles.pill, pricingType === "unit" && styles.pillActive]}
          onPress={() => setPricingType("unit")}
        >
          <Text style={{ fontWeight: "700" }}>Unitário</Text>
        </Pressable>

        <Pressable
          style={[styles.pill, pricingType === "weight" && styles.pillActive]}
          onPress={() => setPricingType("weight")}
        >
          <Text style={{ fontWeight: "700" }}>Por peso</Text>
        </Pressable>
      </View>

      <Pressable style={styles.saveBtn} onPress={save}>
        <Text style={{ color: "#fff", fontWeight: "800" }}>Salvar</Text>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ textAlign: "center", marginTop: 12, opacity: 0.7 }}>
          Cancelar
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 6 },
  label: { fontWeight: "700", opacity: 0.8, marginTop: 6 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pillActive: { backgroundColor: "#e8f5e9", borderColor: "#2e7d32" },
  saveBtn: {
    marginTop: 12,
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
});
