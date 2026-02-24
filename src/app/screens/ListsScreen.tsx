import React, { useMemo, useState } from "react";
import { View, Pressable, FlatList, StyleSheet, TextInput } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import { Screen } from "../../ui/components/Screen";
import { AppText } from "../../ui/components/AppText";
import { useTheme } from "../../ui/theme/ThemeProvider";
import { calculateMostFrequentItems } from "../../domain/services/recommendations";

type Props = NativeStackScreenProps<RootStackParamList, "Lists">;

export function ListsScreen({ navigation }: Props) {
  const theme = useTheme();
  const lists = useListsStore((s) => s.lists);
  const createList = useListsStore((s) => s.createList);
  const createFromLastCompleted = useListsStore(
    (s) => s.createFromLastCompleted,
  );
  const items = useListsStore((s) => s.items);
  const getCatalogItem = useListsStore((s) => s.getCatalogItem);

  const [title, setTitle] = useState("");

  const activeLists = useMemo(
    () => lists.filter((l) => !l.completedAt),
    [lists],
  );
  const historyLists = useMemo(
    () => lists.filter((l) => l.completedAt),
    [lists],
  );

  const suggestions = useMemo(
    () => calculateMostFrequentItems(items, getCatalogItem, 5),
    [items],
  );

  function handleCreate() {
    if (!title.trim()) return;
    const id = createList(title.trim());
    setTitle("");
    navigation.navigate("ListDetails", { listId: id });
  }

  const inputStyle = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
  };

  const cardStyle = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  };

  return (
    <Screen style={{ gap: 12 }} padded>
      <AppText style={styles.title}>Minhas listas</AppText>

      {suggestions.length > 0 && (
        <>
          <AppText style={{ fontWeight: "900", marginTop: 10 }}>
            🔁 Itens frequentes
          </AppText>

          <FlatList
            horizontal
            data={suggestions}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingVertical: 8 }}
            renderItem={({ item }) => (
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 14,
                  padding: 10,
                  minWidth: 100,
                }}
              >
                <AppText numberOfLines={1}>{item.name}</AppText>
              </View>
            )}
          />
        </>
      )}

      <TextInput
        placeholder="Nome da lista (ex: Compra do mês)"
        placeholderTextColor={theme.colors.mutedText}
        value={title}
        onChangeText={setTitle}
        style={[styles.input, inputStyle]}
      />

      <Pressable
        style={[
          styles.btn,
          { backgroundColor: theme.colors.primary, borderColor: "transparent" },
        ]}
        onPress={handleCreate}
      >
        <AppText style={{ color: "#fff", fontWeight: "900" }}>
          Criar lista
        </AppText>
      </Pressable>
      <Pressable
        style={styles.secondaryBtn}
        onPress={() => {
          const id = createFromLastCompleted();
          if (id) {
            navigation.navigate("ListDetails", { listId: id });
          }
        }}
      >
        <AppText style={{ fontWeight: "800" }}>
          Criar com base na última compra
        </AppText>
      </Pressable>

      <AppText style={styles.sectionTitle}>Ativas</AppText>
      <FlatList
        data={activeLists}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={() => (
          <AppText muted style={styles.empty}>
            Nenhuma lista ativa.
          </AppText>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, cardStyle]}
            onPress={() =>
              navigation.navigate("ListDetails", { listId: item.id })
            }
          >
            <AppText style={styles.cardTitle}>{item.title}</AppText>
            <AppText muted style={styles.cardSub}>
              Toque para abrir
            </AppText>
          </Pressable>
        )}
      />

      <AppText style={styles.sectionTitle}>Histórico</AppText>
      <FlatList
        data={historyLists}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={() => (
          <AppText muted style={styles.empty}>
            Nenhuma lista finalizada ainda.
          </AppText>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, cardStyle]}
            onPress={() =>
              navigation.navigate("ListDetails", { listId: item.id })
            }
          >
            <AppText style={styles.cardTitle}>{item.title}</AppText>
            <AppText muted style={styles.cardSub}>
              Finalizada em:{" "}
              {new Date(item.completedAt!).toLocaleDateString("pt-BR")}
            </AppText>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900" },
  sectionTitle: { marginTop: 8, fontSize: 16, fontWeight: "800" },
  input: { borderWidth: 1, borderRadius: 12, padding: 12 },
  btn: { borderWidth: 1, borderRadius: 12, padding: 12, alignItems: "center" },
  empty: { marginTop: 12 },
  card: { padding: 14, borderWidth: 1, borderRadius: 14 },
  cardTitle: { fontSize: 16, fontWeight: "900" },
  cardSub: { marginTop: 4 },
  sep: { height: 10 },
  secondaryBtn: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
});
