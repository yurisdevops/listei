import React, { useEffect, useState } from "react";
import { Modal, View, Pressable, StyleSheet } from "react-native";
import { onlyDigits, formatCentsBRL } from "../../utils/money";
import { useListsStore } from "../../state/store/lists.store";
import { AppText } from "../components/AppText";
import { AppInput } from "../components/AppInput";
import { AppButton } from "../components/AppButton";
import { useTheme } from "../theme/ThemeProvider";

type Props = {
  visible: boolean;
  listId: string;
  currentBudget?: number;
  onClose: () => void;
};

export function BudgetModal({
  listId,
  onClose,
  visible,
  currentBudget,
}: Props) {
  const { theme } = useTheme();
  const setBudget = useListsStore((s) => s.setBudget);

  const [budgetCents, setBudgetCents] = useState(0);

  useEffect(() => {
    setBudgetCents(Math.round((currentBudget ?? 0) * 100));
  }, [currentBudget, listId]);

  function handleSave() {
    setBudget(listId, budgetCents / 100);
    onClose();
  }

  function handleClear() {
    setBudget(listId, 0);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.box,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <AppText style={[styles.title, { color: theme.colors.text }]}>
            Definir Orçamento
          </AppText>

          <AppText muted style={styles.label}>
            Valor (R$)
          </AppText>

          <AppInput
            keyboardType="number-pad"
            value={formatCentsBRL(budgetCents)}
            onChangeText={(t) => {
              const digits = onlyDigits(t);
              setBudgetCents(digits ? Number(digits) : 0);
            }}
          />

          <View style={{ marginTop: 14, gap: 10 }}>
            <AppButton title="Salvar" onPress={handleSave} variant="primary" />
            <AppButton
              title="Remover orçamento"
              onPress={handleClear}
              variant="outline"
            />
            <AppButton title="Cancelar" onPress={onClose} variant="danger" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  box: {
    width: "100%",
    maxWidth: 420,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  title: { fontSize: 18, fontWeight: "900", marginBottom: 12 },
  label: { fontWeight: "700", marginBottom: 8 },
});
