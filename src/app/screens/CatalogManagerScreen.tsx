import React from "react";
import { View, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { ListsStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import { CATEGORIES } from "../../domain/seed/categories";
import { AppText } from "../../ui/components/AppText";
import { Screen } from "../../ui/components/Screen";
import { useTheme } from "../../ui/theme/ThemeProvider";

type Props = NativeStackScreenProps<ListsStackParamList, "CatalogManager">;

export function CatalogManagerScreen({ navigation }: Props) {
  const { theme } = useTheme();

  const catalog = useListsStore((s) => s.catalog);
  const removeCatalogItem = useListsStore((s) => s.removeCatalogItem);

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  };

  const outlineBtn = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  };

  const dangerBtn = {
    backgroundColor: theme.colors.danger,
    borderColor: "transparent",
  };

  function handleDelete(id: string, name: string) {
    Alert.alert(
      "Excluir item",
      `Tem certeza que deseja excluir "${name}" do catálogo?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const res = removeCatalogItem(id);
            if (!res.ok) Alert.alert("Não foi possível excluir", res.reason);
          },
        },
      ],
    );
  }

  return (
    <Screen style={{ gap: 12 }} padded>
      <View style={styles.headerRow}>
        <AppText style={[styles.title, { color: theme.colors.text }]}>
          Catálogo
        </AppText>

        <Pressable
          style={[styles.btn, outlineBtn]}
          onPress={() => navigation.navigate("CatalogEditor", { id: null })}
        >
          <AppText style={[styles.btnText, { color: theme.colors.text }]}>
            + Novo
          </AppText>
        </Pressable>
      </View>

      <FlatList
        data={catalog}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={
          catalog.length === 0 ? { paddingTop: 10 } : undefined
        }
        renderItem={({ item }) => {
          const cat = CATEGORIES.find((c) => c.id === item.categoryId);

          return (
            <View style={[styles.card, cardStyle]}>
              <View style={{ flex: 1 }}>
                <AppText style={[styles.name, { color: theme.colors.text }]}>
                  {cat?.emoji ?? "•"} {item.name}
                </AppText>

                <AppText muted style={styles.sub}>
                  {cat?.label ?? item.categoryId} •{" "}
                  {item.pricingType === "weight" ? "por peso" : "unitário"}
                </AppText>
              </View>

              <Pressable
                style={[styles.smallBtn, outlineBtn]}
                onPress={() =>
                  navigation.navigate("CatalogEditor", { id: item.id })
                }
              >
                <AppText
                  style={{ fontWeight: "800", color: theme.colors.text }}
                >
                  Editar
                </AppText>
              </Pressable>

              <Pressable
                style={[styles.smallBtn, dangerBtn]}
                onPress={() => handleDelete(item.id, item.name)}
                accessibilityLabel={`Excluir ${item.name}`}
              >
                <AppText
                  style={{
                    color: theme.colors.onDanger ?? "#fff",
                    fontWeight: "900",
                  }}
                >
                  Del
                </AppText>
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <AppText muted>Nenhum item no catálogo ainda.</AppText>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "900" },

  btn: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  btnText: { fontWeight: "900" },

  card: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  name: { fontSize: 16, fontWeight: "900" },
  sub: { marginTop: 2 },

  smallBtn: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
});
