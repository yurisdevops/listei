import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
  SectionList,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { ListsStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import { Screen } from "../../ui/components/Screen";
import { AppText } from "../../ui/components/AppText";
import { useTheme } from "../../ui/theme/ThemeProvider";
import { calculateMostFrequentItems } from "../../domain/services/recommendations";

type Props = NativeStackScreenProps<ListsStackParamList, "Lists">;

type Section = {
  title: string;
  data: Array<{
    id: string;
    title: string;
    completedAt?: number | null;
  }>;
};

type HeaderProps = {
  theme: any;
  title: string;
  setTitle: (v: string) => void;
  handleCreate: () => void;
  suggestions: any[];
  cardStyle: any;
  inputStyle: any;
  primaryBtn: any;
  outlineBtn: any;
  createFromLastCompleted: () => string | null;
  navigation: any;
};

const ListsHeader = React.memo(function ListsHeader({
  theme,
  title,
  setTitle,
  handleCreate,
  suggestions,
  cardStyle,
  inputStyle,
  primaryBtn,
  outlineBtn,
  createFromLastCompleted,
  navigation,
}: HeaderProps) {
  return (
    <View style={{ gap: 12 }}>
      <AppText style={[styles.title, { color: theme.colors.text }]}>
        📝 Minhas listas
      </AppText>

      {suggestions.length > 0 && (
        <>
          <AppText style={{ fontWeight: "900", color: theme.colors.text }}>
            🔁 Itens frequentes
          </AppText>

          <FlatList
            horizontal
            data={suggestions}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingVertical: 8 }}
            renderItem={({ item }) => (
              <View style={[styles.suggestionCard, cardStyle]}>
                <AppText numberOfLines={1} style={{ color: theme.colors.text }}>
                  {item.name}
                </AppText>
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
        returnKeyType="done"
        blurOnSubmit={false}
        onSubmitEditing={handleCreate}
      />

      <Pressable style={[styles.btn, primaryBtn]} onPress={handleCreate}>
        <AppText
          style={{
            color: theme.colors.onPrimary ?? "#fff",
            fontWeight: "900",
          }}
        >
          Criar lista
        </AppText>
      </Pressable>

      <Pressable
        style={[styles.btn, outlineBtn]}
        onPress={() => {
          const id = createFromLastCompleted();
          if (id) navigation.navigate("ListDetails", { listId: id });
        }}
      >
        <AppText style={{ fontWeight: "800", color: theme.colors.text }}>
          Criar com base na última compra
        </AppText>
      </Pressable>
    </View>
  );
});

export function ListsScreen({ navigation }: Props) {
  const { theme } = useTheme();

  const lists = useListsStore((s) => s.lists);
  const createList = useListsStore((s) => s.createList);
  const createFromLastCompleted = useListsStore((s) => s.createFromLastCompleted);

  const items = useListsStore((s) => s.items);
  const getCatalogItem = useListsStore((s) => s.getCatalogItem);

  const [title, setTitle] = useState("");

  const activeLists = useMemo(() => lists.filter((l) => !l.completedAt), [lists]);
  const historyLists = useMemo(() => lists.filter((l) => l.completedAt), [lists]);

  const suggestions = useMemo(
    () => calculateMostFrequentItems(items, getCatalogItem, 5),
    [items, getCatalogItem]
  );

  const sections: Section[] = useMemo(
    () => [
      { title: "Ativas", data: activeLists },
      { title: "Histórico", data: historyLists },
    ],
    [activeLists, historyLists]
  );

  const inputStyle = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
  };

  const cardStyle = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  };

  const outlineBtn = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  };

  const primaryBtn = {
    backgroundColor: theme.colors.primary,
    borderColor: "transparent",
  };

  const handleCreate = useCallback(() => {
    const t = title.trim();
    if (!t) return;

    const id = createList(t);
    setTitle("");
    navigation.navigate("ListDetails", { listId: id });
  }, [title, createList, navigation]);

  const header = useMemo(
    () => (
      <ListsHeader
        theme={theme}
        title={title}
        setTitle={setTitle}
        handleCreate={handleCreate}
        suggestions={suggestions}
        cardStyle={cardStyle}
        inputStyle={inputStyle}
        primaryBtn={primaryBtn}
        outlineBtn={outlineBtn}
        createFromLastCompleted={createFromLastCompleted}
        navigation={navigation}
      />
    ),
    [
      theme,
      title,
      handleCreate,
      suggestions,
      cardStyle,
      inputStyle,
      primaryBtn,
      outlineBtn,
      createFromLastCompleted,
      navigation,
    ]
  );

  return (
    <Screen padded>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderSectionHeader={({ section }) => (
          <AppText style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {section.title}
          </AppText>
        )}
        ListHeaderComponent={header}
        renderItem={({ item, section }) => (
          <Pressable
            style={[styles.card, cardStyle]}
            onPress={() => navigation.navigate("ListDetails", { listId: item.id })}
          >
            <AppText style={[styles.cardTitle, { color: theme.colors.text }]}>
              {item.title}
            </AppText>

            {section.title === "Histórico" ? (
              <AppText muted style={styles.cardSub}>
                Finalizada em:{" "}
                {item.completedAt
                  ? new Date(item.completedAt).toLocaleDateString("pt-BR")
                  : "-"}
              </AppText>
            ) : (
              <AppText muted style={styles.cardSub}>
                Toque para abrir
              </AppText>
            )}
          </Pressable>
        )}
        ListEmptyComponent={() => (
          <AppText muted style={styles.empty}>
            Nenhuma lista por aqui ainda.
          </AppText>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900" },
  sectionTitle: { marginTop: 8, fontSize: 16, fontWeight: "900" },

  input: { borderWidth: 1, borderRadius: 12, padding: 12 },

  btn: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },

  empty: { marginTop: 12 },

  card: { padding: 14, borderWidth: 1, borderRadius: 14 },
  cardTitle: { fontSize: 16, fontWeight: "900" },
  cardSub: { marginTop: 4 },

  sep: { height: 10 },

  suggestionCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    minWidth: 110,
  },
});