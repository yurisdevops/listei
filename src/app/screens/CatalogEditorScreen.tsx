import React, { useMemo, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import { CATEGORIES } from "../../domain/seed/categories";
import { AppText } from "../../ui/components/AppText";


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
      <AppText style={styles.title}>{id ? "Editar item" : "Novo item"}</AppText>

      <AppText style={styles.label}>Nome</AppText>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ex: Café"
        style={styles.input}
      />

      <AppText style={styles.label}>Categoria</AppText>
      <View style={styles.pills}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.id}
            style={[styles.pill, c.id === categoryId && styles.pillActive]}
            onPress={() => setCategoryId(c.id)}
          >
            <AppText style={{ fontWeight: "700" }}>
              {c.emoji} {c.label}
            </AppText>
          </Pressable>
        ))}
      </View>

      <AppText style={styles.label}>Tipo</AppText>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          style={[styles.pill, pricingType === "unit" && styles.pillActive]}
          onPress={() => setPricingType("unit")}
        >
          <AppText style={{ fontWeight: "700" }}>Unitário</AppText>
        </Pressable>

        <Pressable
          style={[styles.pill, pricingType === "weight" && styles.pillActive]}
          onPress={() => setPricingType("weight")}
        >
          <AppText style={{ fontWeight: "700" }}>Por peso</AppText>
        </Pressable>
      </View>

      <Pressable style={styles.saveBtn} onPress={save}>
        <AppText style={{ color: "#fff", fontWeight: "800" }}>Salvar</AppText>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()}>
        <AppText style={{ textAlign: "center", marginTop: 12, opacity: 0.7 }}>
          Cancelar
        </AppText>
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
