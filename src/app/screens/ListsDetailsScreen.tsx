import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { View, StyleSheet, Pressable, SectionList, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Swipeable } from "react-native-gesture-handler";

import type { ListsStackParamList } from "../navigation/types";
import { useListsStore } from "../../state/store/lists.store";

import type { ListItem } from "../../domain/models/list";
import { CATEGORIES } from "../../domain/seed/categories";
import { groupItemsByCategory } from "../../domain/services/group";
import { shouldGenerate } from "../../domain/services/recurrence";
import { buildListExportText } from "../../domain/services/export";
import {
  calculateItemTotal,
  calculateListTotal,
} from "../../domain/services/calc";
import { formatBRL } from "../../utils/money";

import { AppText } from "../../ui/components/AppText";
import { Screen } from "../../ui/components/Screen";
import { Fab } from "../../ui/components/Fab";
import { UndoBar } from "../../ui/components/UndoBar";
import { RecurringBanner } from "../../ui/components/RecurringBanner";

import { BottomSumary } from "../../ui/modals/BottomSumary";
import { BudgetModal } from "../../ui/modals/BudgetModal";
import { ConfirmModal } from "../../ui/modals/ConfirmModal";
import { EditItemModal } from "../../ui/modals/EditItemModal";
import { ExportModal } from "../../ui/modals/ExportModal";
import { RecurrenceModal } from "../../ui/modals/RecurrenceModal";

import { useTheme } from "../../ui/theme/ThemeProvider";
import { BudgetBar } from "../../ui/modals/BudgetBar";

type Props = NativeStackScreenProps<ListsStackParamList, "ListDetails">;

type Section = {
  categoryId: string;
  title: string;
  total: number;
  data: ListItem[];
};

export function ListDetailsScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { listId } = route.params;

  const lists = useListsStore((s) => s.lists);
  const allItems = useListsStore((s) => s.items);

  const currentList = useMemo(
    () => lists.find((l) => l.id === listId),
    [lists, listId],
  );

  const isCompleted = !!currentList?.completedAt;

  const toggleItem = useListsStore((s) => s.toggleItem);
  const getCatalogItem = useListsStore((s) => s.getCatalogItem);
  const removeItem = useListsStore((s) => s.removeItem);

  const duplicateList = useListsStore((s) => s.duplicateList);
  const completeList = useListsStore((s) => s.completeList);
  const removeList = useListsStore((s) => s.removeList);

  const setRecurrence = useListsStore((s) => s.setRecurrence);
  const generateRecurringList = useListsStore((s) => s.generateRecurringList);

  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);

  const [undoVisible, setUndoVisible] = useState(false);
  const [deletedItem, setDeletedItem] = useState<ListItem | null>(null);

  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, []);

  const items = useMemo(
    () => allItems.filter((i) => i.listId === listId),
    [allItems, listId],
  );

  const total = useMemo(() => calculateListTotal(items), [items]);

  const canGenerate = !!currentList && shouldGenerate(currentList);

  const sections: Section[] = useMemo(() => {
    const grouped = groupItemsByCategory(items, getCatalogItem);

    return Object.entries(grouped).map(([categoryId, data]) => {
      const category = CATEGORIES.find((c) => c.id === categoryId);
      return {
        categoryId,
        title: `${category?.emoji ?? "•"} ${category?.label ?? categoryId}`,
        total: data.total,
        data: data.items,
      };
    });
  }, [items, getCatalogItem]);

  const exportText = useMemo(() => {
    return buildListExportText({
      listTitle: currentList?.title ?? "Lista",
      createdAt: currentList?.createdAt,
      budget: currentList?.budget,
      items,
      getCatalogItem,
    });
  }, [
    currentList?.title,
    currentList?.createdAt,
    currentList?.budget,
    items,
    getCatalogItem,
  ]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleRemoveItem = useCallback(
    (item: ListItem) => {
      removeItem(item.id);

      setDeletedItem(item);
      setUndoVisible(true);

      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => {
        setUndoVisible(false);
        setDeletedItem(null);
      }, 4000);
    },
    [removeItem],
  );

  const restoreItem = useListsStore((s) => s.restoreItem);

  const undoRemove = useCallback(() => {
    if (!deletedItem) return;

    restoreItem(deletedItem);

    setUndoVisible(false);
    setDeletedItem(null);
  }, [deletedItem, restoreItem]);

  const renderRightActions = useCallback(
    (item: ListItem) => (
      <Pressable
        style={[styles.swipeDelete, { backgroundColor: theme.colors.danger }]}
        onPress={() => handleRemoveItem(item)}
      >
        <AppText
          style={{ color: theme.colors.onDanger ?? "#fff", fontWeight: "900" }}
        >
          Excluir
        </AppText>
      </Pressable>
    ),
    [theme.colors.danger, theme.colors.onDanger, handleRemoveItem],
  );

  // Guard: lista inexistente (evita crash)
  if (!currentList) {
    return (
      <Screen padded>
        <AppText
          style={{ fontSize: 18, fontWeight: "900", color: theme.colors.text }}
        >
          Lista não encontrada
        </AppText>
        <AppText muted style={{ marginTop: 8 }}>
          Essa lista pode ter sido removida.
        </AppText>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 14 }}
        >
          <AppText style={{ fontWeight: "900", color: theme.colors.primary }}>
            Voltar
          </AppText>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <AppText style={[styles.title, { color: theme.colors.text }]}>
          {currentList.title ?? "Lista"}
        </AppText>

        <Pressable onPress={() => setMenuOpen((v) => !v)} hitSlop={10}>
          <AppText
            style={{
              fontSize: 22,
              marginRight: 10,
              padding: 3,
              color: theme.colors.text,
            }}
          >
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
              closeMenu();
              setExportOpen(true);
            }}
          >
            <AppText style={{ fontWeight: "800", color: theme.colors.text }}>
              Exportar / Compartilhar
            </AppText>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              closeMenu();
              setBudgetOpen(true);
            }}
          >
            <AppText style={{ color: theme.colors.text }}>
              Definir orçamento
            </AppText>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              closeMenu();
              const newId = duplicateList(listId);
              if (newId) {
                navigation.replace("ListDetails", { listId: newId });
              } else {
                Alert.alert("Não foi possível duplicar a lista.");
              }
            }}
          >
            <AppText style={{ color: theme.colors.text }}>
              Duplicar lista
            </AppText>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              closeMenu();
              setRecurrenceOpen(true);
            }}
          >
            <AppText style={{ color: theme.colors.text }}>Recorrência</AppText>
          </Pressable>

          {!isCompleted && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
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
              closeMenu();
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

      <BudgetBar total={total} budget={currentList.budget} />

      {canGenerate && (
        <RecurringBanner
          onPress={() => {
            const newId = generateRecurringList(listId);
            if (newId) navigation.replace("ListDetails", { listId: newId });
          }}
        />
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <View style={{ marginTop: 12 }}>
            <AppText
              style={{
                fontSize: 16,
                fontWeight: "900",
                marginBottom: 6,
                color: theme.colors.text,
              }}
            >
              {section.title}
            </AppText>
          </View>
        )}
        renderSectionFooter={({ section }) => (
          <AppText
            style={{
              fontSize: 16,
              fontWeight: "800",
              marginTop: 6,
              color: theme.colors.text,
            }}
          >
            Total {section.title}: {formatBRL(section.total)}
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
                style={[
                  styles.itemRow,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                    opacity: item.checked ? 0.55 : 1,
                  },
                ]}
                onPress={() => setSelectedItem(item)}
                onLongPress={() => toggleItem(item.id)}
              >
                <AppText
                  style={{ fontWeight: "800", color: theme.colors.text }}
                >
                  {catalog?.name ?? "Item"}
                </AppText>
                <AppText muted>
                  Subtotal: {formatBRL(calculateItemTotal(item))}
                </AppText>
              </Pressable>
            </Swipeable>
          );
        }}
      />

      <BottomSumary items={items} />

      {selectedItem && (
        <EditItemModal
          visible
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
        currentBudget={currentList.budget}
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

      <RecurrenceModal
        visible={recurrenceOpen}
        value={currentList.recurrence}
        onClose={() => setRecurrenceOpen(false)}
        onSelect={(v) => setRecurrence(listId, v)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "900" },

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

  itemRow: {
    borderWidth: 1,
    padding: 12,
  },

  swipeDelete: {
    justifyContent: "center",
    alignItems: "center",
    width: 90,
  },
});
