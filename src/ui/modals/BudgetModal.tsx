import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native";
import { onlyDigits, formatCentsBRL } from "../../utils/money";
import { useListsStore } from "../../state/store/lists.store";
import { Screen } from "../components/Screen";

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
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Definir Orçamento</Text>
          <Text style={styles.label}> Valor (R$)</Text>
          <TextInput
            keyboardType="number-pad"
            value={formatCentsBRL(budgetCents)}
            onChangeText={(t) => {
              const digits = onlyDigits(t);
              setBudgetCents(digits ? Number(digits) : 0);
            }}
          />

          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Salvar</Text>
          </Pressable>

          <Pressable style={styles.clearBtn} onPress={handleClear}>
            <Text>Remover orçamento</Text>
          </Pressable>

          <Pressable onPress={onClose}>
            <Text style={styles.cancel}> Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0007",
    justifyContent: "center",
    alignItems: "center",
  },
  box: { width: "85%", backgroundColor: "#fff", padding: 16, borderRadius: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  label: { fontWeight: "600", opacity: 0.8 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 8 },
  saveBtn: {
    marginTop: 14,
    backgroundColor: "#1b5e20",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
  clearBtn: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  cancel: { textAlign: "center", marginTop: 12, opacity: 0.7 },
});
