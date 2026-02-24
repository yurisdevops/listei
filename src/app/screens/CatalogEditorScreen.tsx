import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import { CATEGORIES } from "../../domain/seed/categories";
import { AppText } from "../../ui/components/AppText";
import { Screen } from "../../ui/components/Screen";
import { useTheme } from "../../ui/theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "CatalogEditor">;

export function CatalogEditorScreen({ route, navigation }: Props) {
  const theme = useTheme();
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

  const inputStyle = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
  };

  const pillBase = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  };

  const pillActive = {
    backgroundColor: theme.colors.chipBg,
    borderColor: theme.colors.primary,
  };

  return (
    <Screen style={{ gap: 10 }} padded>
      <AppText style={styles.title}>{id ? "Editar item" : "Novo item"}</AppText>

      <AppText muted style={styles.label}>
        Nome
      </AppText>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ex: Café"
        placeholderTextColor={theme.colors.mutedText}
        style={[styles.input, inputStyle]}
      />

      <AppText muted style={styles.label}>
        Categoria
      </AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.pillsRow}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.pill, pillBase, c.id === categoryId && pillActive]}
              onPress={() => setCategoryId(c.id)}
            >
              <AppText style={{ fontWeight: "800" }}>
                {c.emoji} {c.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <AppText muted style={styles.label}>
        Tipo
      </AppText>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          style={[styles.pill, pillBase, pricingType === "unit" && pillActive]}
          onPress={() => setPricingType("unit")}
        >
          <AppText style={{ fontWeight: "800" }}>Unitário</AppText>
        </Pressable>

        <Pressable
          style={[
            styles.pill,
            pillBase,
            pricingType === "weight" && pillActive,
          ]}
          onPress={() => setPricingType("weight")}
        >
          <AppText style={{ fontWeight: "800" }}>Por peso</AppText>
        </Pressable>
      </View>

      <Pressable
        style={[
          styles.saveBtn,
          { backgroundColor: theme.colors.primary, borderColor: "transparent" },
        ]}
        onPress={save}
      >
        <AppText style={{ color: "#fff", fontWeight: "900" }}>Salvar</AppText>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()}>
        <AppText muted style={{ textAlign: "center", marginTop: 12 }}>
          Cancelar
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "900", marginBottom: 6 },
  label: { fontWeight: "800", marginTop: 6 },

  input: { borderWidth: 1, borderRadius: 12, padding: 12 },

  pillsRow: { flexDirection: "row", gap: 8, paddingBottom: 2 },

  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 38,
    justifyContent: "center",
  },

  saveBtn: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
});
