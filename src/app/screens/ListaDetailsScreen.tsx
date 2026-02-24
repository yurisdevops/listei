import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, SectionList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";
import {
  calculateItemTotal,
  calculateListTotal,
} from "../../domain/services/calc";
import { useState } from "react";
import { EditItemModal } from "../../ui/modals/EditItemModal";
import type { ListItem } from "../../domain/models/list";
import { groupItemsByCategory } from "../../domain/services/group";
import { CATEGORIES } from "../../domain/seed/categories";
import { BottomSumary } from "../../ui/modals/BottomSumary";
import { BudgetBar } from "../../ui/modals/BudgetBar";
import { BudgetModal } from "../../ui/modals/BudgetModal";
import { Fab } from "../../ui/components/Fab";
import { Swipeable } from "react-native-gesture-handler";
import { ConfirmModal } from "../../ui/modals/ConfirmModal";
import { buildListExportText } from "../../domain/services/export";
import { ExportModal } from "../../ui/modals/ExportModal";
import { UndoBar } from "../../ui/components/UndoBar";
import { AppText } from "../../ui/components/AppText";
import { Screen } from "../../ui/components/Screen";
import { useTheme } from "../../ui/theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "ListDetails">;

export function ListDetailsScreen({ route, navigation }: Props) {
  const theme = useTheme();

  const { listId } = route.params;
  const allItems = useListsStore((s) => s.items);

  const lists = useListsStore((s) => s.lists);
  const currentList = lists.find((l) => l.id === listId);
  const isCompleted = !!currentList?.completedAt;

  const duplicateList = useListsStore((s) => s.duplicateList);
  const completeList = useListsStore((s) => s.completeList);

  const removeList = useListsStore((s) => s.removeList);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [budgetOpen, setBudgetOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);

  const [undoVisible, setUndoVisible] = useState(false);
  const [deletedItem, setDeletedItem] = useState<ListItem | null>(null);

  const items = useMemo(
    () => allItems.filter((i) => i.listId === listId),
    [allItems, listId],
  );

  const total = useMemo(() => calculateListTotal(items), [items]);

  const toggleItem = useListsStore((s) => s.toggleItem);
  const getCatalogItem = useListsStore((s) => s.getCatalogItem);

  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);

  const grouped = groupItemsByCategory(items, getCatalogItem);

  const sections = useMemo(() => {
    return Object.entries(grouped).map(([categoryId, data]) => {
      const category = CATEGORIES.find((c) => c.id === categoryId);

      return {
        categoryId,
        title: `${category?.emoji ?? "•"} ${category?.label ?? categoryId}`,
        total: data.total,
        data: data.items,
      };
    });
  }, [grouped]);

  const exportText = useMemo(() => {
    return buildListExportText({
      listTitle: currentList?.title ?? "Lista",
      createdAt: currentList?.createdAt,
      budget: currentList?.budget,
      items,
      getCatalogItem,
    });
  }, [currentList?.title, currentList?.createdAt, currentList?.budget, items]);

  const removeItem = useListsStore((s) => s.removeItem);

  function handleRemove(item: ListItem) {
    removeItem(item.id);
    setDeletedItem(item);
    setUndoVisible(true);

    setTimeout(() => {
      setUndoVisible(false);
      setDeletedItem(null);
    }, 4000);
  }

  function undoRemove() {
    if (!deletedItem) return;

    useListsStore.setState((state) => ({
      items: [...state.items, deletedItem],
    }));

    setUndoVisible(false);
    setDeletedItem(null);
  }

  function renderRightActions(item: ListItem) {
    return (
      <Pressable
        style={{
          backgroundColor: theme.colors.danger,
          justifyContent: "center",
          alignItems: "center",
          width: 90,
        }}
        onPress={() => handleRemove(item)}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Excluir</Text>
      </Pressable>
    );
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <AppText style={[styles.title, { fontWeight: "900" }]}>Lista</AppText>

        <Pressable onPress={() => setMenuOpen((v) => !v)}>
          <AppText style={{ fontSize: 22, marginRight: 10, padding: 3 }}>
            ☰
          </AppText>
        </Pressable>
      </View>
      {menuOpen && (
        <View
          style={[
            styles.menuBox,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
              setExportOpen(true);
            }}
          >
            <AppText style={{ fontWeight: "800" }}>
              Exportar / Compartilhar
            </AppText>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
              setBudgetOpen(true);
            }}
          >
            <AppText>Definir orçamento</AppText>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
              const newId = duplicateList(listId);
              if (newId) navigation.replace("ListDetails", { listId: newId });
            }}
          >
            <AppText>Duplicar lista</AppText>
          </Pressable>

          {!isCompleted && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                completeList(listId);
              }}
            >
              <AppText
                style={{ color: theme.colors.primary, fontWeight: "800" }}
              >
                Finalizar lista
              </AppText>
            </Pressable>
          )}

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
              setConfirmDeleteOpen(true);
            }}
          >
            <AppText style={{ color: theme.colors.danger, fontWeight: "800" }}>
              Excluir lista
            </AppText>
          </Pressable>
        </View>
      )}

      {!isCompleted && (
        <Fab onPress={() => navigation.navigate("Catalog", { listId })} />
      )}

      <BudgetBar total={total} budget={currentList?.budget} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <View style={{ marginTop: 12 }}>
            <AppText
              style={{ fontSize: 16, fontWeight: "700", marginBottom: 6 }}
            >
              {section.title}
            </AppText>
          </View>
        )}
        renderSectionFooter={({ section }) => (
          <AppText style={{ fontSize: 16, fontWeight: "700", marginTop: 6 }}>
            Total {section.title}: R$ {section.total.toFixed(2)}
          </AppText>
        )}
        renderItem={({ item }) => {
          const catalog = getCatalogItem(item.catalogItemId);

          return (
            <Swipeable
              renderRightActions={() => renderRightActions(item)}
              overshootRight={false}
              friction={2}
              rightThreshold={40}
            >
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: theme.colors.card,
                  opacity: item.checked ? 0.5 : 1,
                }}
                onPress={() => setSelectedItem(item)}
                onLongPress={() => toggleItem(item.id)}
              >
                <AppText style={{ fontWeight: "700" }}>{catalog?.name}</AppText>
                <AppText>
                  Subtotal: R$ {calculateItemTotal(item).toFixed(2)}
                </AppText>
              </Pressable>
            </Swipeable>
          );
        }}
      />

      <BottomSumary items={items} />
      {selectedItem && (
        <EditItemModal
          visible={true}
          item={selectedItem}
          catalog={getCatalogItem(selectedItem.catalogItemId)}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <UndoBar
        visible={undoVisible}
        message="Item removido"
        onUndo={undoRemove}
      />

      <BudgetModal
        visible={budgetOpen}
        listId={listId}
        currentBudget={currentList?.budget}
        onClose={() => setBudgetOpen(false)}
      />

      <ConfirmModal
        visible={confirmDeleteOpen}
        title="Excluir lista"
        message="Tem certeza? Essa ação remove a lista e todos os itens dela."
        confirmText="Excluir"
        cancelText="Cancelar"
        destructive
        onConfirm={() => {
          removeList(listId);
          navigation.goBack();
        }}
        onClose={() => setConfirmDeleteOpen(false)}
      />

      <ExportModal
        visible={exportOpen}
        text={exportText}
        onClose={() => setExportOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 18, fontWeight: "700" },
  sub: { opacity: 0.7 },
  btn: { borderWidth: 1, padding: 12, borderRadius: 10, marginBottom: 12 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 99,
  },
  menuBox: {
    position: "absolute",
    top: 60,
    right: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 6,
    elevation: 5,
    zIndex: 99,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
