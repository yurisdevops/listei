import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { ListsStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import { CATEGORIES } from "../../domain/seed/categories";
import { AppText } from "../../ui/components/AppText";
import { useTheme } from "../../ui/theme/ThemeProvider";

type Props = NativeStackScreenProps<ListsStackParamList, "CatalogEditor">;

const DEFAULT_CATEGORY_ID = CATEGORIES[0]?.id ?? "mercearia";

export function CatalogEditorScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { id } = route.params;

  const catalog = useListsStore((s) => s.catalog);
  const addCatalogItem = useListsStore((s) => s.addCatalogItem);
  const updateCatalogItem = useListsStore((s) => s.updateCatalogItem);

  const editing = useMemo(() => {
    if (!id) return null;
    return catalog.find((c) => c.id === id) ?? null;
  }, [catalog, id]);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORY_ID);
  const [pricingType, setPricingType] = useState<"unit" | "weight">("unit");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setCategoryId(editing.categoryId);
      setPricingType(editing.pricingType);
      return;
    }

    setName("");
    setCategoryId(DEFAULT_CATEGORY_ID);
    setPricingType("unit");
  }, [editing]);

  const trimmedName = name.trim();
  const canSave = trimmedName.length > 0;

  function handleSave() {
    if (!canSave) {
      alert("Informe o nome do item.");
      return;
    }

    if (!id) {
      addCatalogItem({ name: trimmedName, categoryId, pricingType });
    } else {
      updateCatalogItem(id, { name: trimmedName, categoryId, pricingType });
    }

    navigation.goBack();
  }

  const inputStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  };

  const pillBase = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  };

  const pillActive = {
    backgroundColor: theme.colors.chipBg,
    borderColor: theme.colors.primary,
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppText style={[styles.title, { color: theme.colors.text }]}>
        {id ? "Editar item" : "Novo item"}
      </AppText>

      <AppText style={[styles.label, { color: theme.colors.mutedText }]}>
        Nome
      </AppText>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ex: Café"
        placeholderTextColor={theme.colors.mutedText}
        style={[styles.input, inputStyle]}
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />

      <AppText style={[styles.label, { color: theme.colors.mutedText }]}>
        Categoria
      </AppText>

      <View style={styles.pills}>
        {CATEGORIES.map((c) => {
          const active = c.id === categoryId;
          return (
            <Pressable
              key={c.id}
              style={[styles.pill, pillBase, active && pillActive]}
              onPress={() => setCategoryId(c.id)}
            >
              <AppText style={{ fontWeight: "700", color: theme.colors.text }}>
                {c.emoji} {c.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <AppText style={[styles.label, { color: theme.colors.mutedText }]}>
        Tipo
      </AppText>

      <View style={styles.typeRow}>
        <Pressable
          style={[styles.pill, pillBase, pricingType === "unit" && pillActive]}
          onPress={() => setPricingType("unit")}
        >
          <AppText style={{ fontWeight: "700", color: theme.colors.text }}>
            Unitário
          </AppText>
        </Pressable>

        <Pressable
          style={[
            styles.pill,
            pillBase,
            pricingType === "weight" && pillActive,
          ]}
          onPress={() => setPricingType("weight")}
        >
          <AppText style={{ fontWeight: "700", color: theme.colors.text }}>
            Por peso
          </AppText>
        </Pressable>
      </View>

      <Pressable
        style={[
          styles.saveBtn,
          {
            backgroundColor: theme.colors.primary,
            opacity: canSave ? 1 : 0.55,
          },
        ]}
        onPress={handleSave}
        disabled={!canSave}
      >
        <AppText
          style={{
            color: theme.colors.onPrimary ?? "#fff",
            fontWeight: "900",
          }}
        >
          Salvar
        </AppText>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()} style={styles.cancelBtn}>
        <AppText
          style={{
            textAlign: "center",
            color: theme.colors.mutedText,
            fontWeight: "800",
          }}
        >
          Cancelar
        </AppText>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 20, fontWeight: "900", marginBottom: 6 },
  label: { fontWeight: "800", marginTop: 6 },

  input: { borderWidth: 1, borderRadius: 12, padding: 12 },

  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  typeRow: { flexDirection: "row", gap: 10 },

  saveBtn: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  cancelBtn: { paddingVertical: 10 },
});
