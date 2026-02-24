import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import { Screen } from "../../ui/components/Screen";
import { AppText } from "../../ui/components/AppText";

type Props = NativeStackScreenProps<RootStackParamList, "Lists">;

export function ListsScreen({ navigation }: Props) {
  const lists = useListsStore((s) => s.lists);
  const createList = useListsStore((s) => s.createList);

  const [title, setTitle] = useState("");

  const activeLists = useMemo(
    () => lists.filter((l) => !l.completedAt),
    [lists],
  );
  const historyLists = useMemo(
    () => lists.filter((l) => l.completedAt),
    [lists],
  );

  function handleCreate() {
    if (!title.trim()) return;

    const id = createList(title.trim());
    setTitle("");
    navigation.navigate("ListDetails", { listId: id });
  }

  return (
    <Screen style={{ gap: 12 }} padded>
      <AppText style={styles.title}>Minhas listas</AppText>

      <TextInput
        placeholder="Nome da lista (ex: Compra do mês)"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Pressable style={styles.btn} onPress={handleCreate}>
        <AppText style={styles.btnAppText}>Criar lista</AppText>
      </Pressable>

      <AppText style={styles.sectionTitle}>Ativas</AppText>
      <FlatList
        data={activeLists}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={() => (
          <AppText style={styles.empty}>Nenhuma lista ativa.</AppText>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate("ListDetails", { listId: item.id })
            }
          >
            <AppText style={styles.cardTitle}>{item.title}</AppText>
            <AppText style={styles.cardSub}>Toque para abrir</AppText>
          </Pressable>
        )}
      />

      <AppText style={styles.sectionTitle}>Histórico</AppText>
      <FlatList
        data={historyLists}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={() => (
          <AppText style={styles.empty}>
            Nenhuma lista finalizada ainda.
          </AppText>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate("ListDetails", { listId: item.id })
            }
          >
            <AppText style={styles.cardTitle}>{item.title}</AppText>
            <AppText style={styles.cardSub}>
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
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  sectionTitle: { marginTop: 8, fontSize: 16, fontWeight: "700" },
  input: { borderWidth: 1, borderRadius: 10, padding: 12 },
  btn: { borderWidth: 1, borderRadius: 10, padding: 12, alignItems: "center" },
  btnText: { fontWeight: "700" },
  empty: { marginTop: 16, opacity: 0.7 },
  card: { padding: 14, borderWidth: 1, borderRadius: 14 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardSub: { marginTop: 4, opacity: 0.7 },
  sep: { height: 10 },
  btnAppText: { borderColor: "#fff" },
});
