import { useEffect, useState } from "react";
import type { CatalogItem } from "../../domain/models/catolog";
import type { ListItem } from "../../domain/models/list";
import { useListsStore } from "../../state/store/lists.store";
import { onlyDigits, formatCentsBRL } from "../../utils/money";

import {
  Modal,
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { formatGramsToKg } from "../../utils/weight";

type Props = {
  visible: boolean;
  item: ListItem | null;
  catalog: CatalogItem | undefined;
  onClose: () => void;
};

export function EditItemModal({ catalog, item, onClose, visible }: Props) {
  const updateUnitItem = useListsStore((s) => s.updateUnitItem);
  const updateWeightItem = useListsStore((s) => s.updateWeightItem);

  const [qty, setQty] = useState("");
  const [kg, setKg] = useState("");

  const [priceCents, setPriceCents] = useState(0);
  const [priceKgCents, setPriceKgCents] = useState(0);

  const [grams, setGrams] = useState(0);

  useEffect(() => {
    if (!item) return;

    setQty(String(item.qty ?? ""));
    setKg(String(item.weightKg ?? ""));

    setPriceCents(Math.round((item.unitPrice ?? 0) * 100));
    setPriceKgCents(Math.round((item.pricePerKg ?? 0) * 100));
  }, [item?.id]);

  if (!item || !catalog) return null;

  useEffect(() => {
    if (!item) return;

    setQty(String(item.qty ?? ""));
    setKg(String(item.weightKg ?? ""));

    setPriceCents(Math.round((item.unitPrice ?? 0) * 100));
    setPriceKgCents(Math.round((item.pricePerKg ?? 0) * 100));
    setGrams(Math.round((item.weightKg ?? 0) * 1000));
  }, [item?.id]);

  function save() {
    if (!catalog || !item) return;

    const qtyNumber = Number(qty || 0);
    const kgNumber = grams / 1000;

    if (catalog.pricingType === "unit") {
      updateUnitItem(item.id, qtyNumber, priceCents / 100);
    } else {
      updateWeightItem(item.id, kgNumber, priceKgCents / 100);
    }

    onClose();
  }
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{catalog.name}</Text>
          {catalog.pricingType === "unit" ? (
            <>
              <TextInput
                placeholder="Quantidade"
                keyboardType="numeric"
                value={qty}
                onChangeText={setQty}
                style={styles.input}
              />

              <TextInput
                placeholder="Preço uidade"
                keyboardType="number-pad"
                value={formatCentsBRL(priceCents)}
                onChangeText={(t) => {
                  const digits = onlyDigits(t);
                  setPriceCents(digits ? Number(digits) : 0);
                }}
                style={styles.input}
              />
            </>
          ) : (
            <>
              <TextInput
                placeholder="Peso (kg)"
                keyboardType="number-pad"
                value={formatGramsToKg(grams)}
                onChangeText={(t) => {
                  const digits = onlyDigits(t);
                  setGrams(digits ? Number(digits) : 0);
                }}
                style={styles.input}
              />

              <TextInput
                placeholder="Preço por kg"
                keyboardType="number-pad"
                value={formatCentsBRL(priceKgCents)}
                onChangeText={(t) => {
                  const digits = onlyDigits(t);
                  setPriceKgCents(digits ? Number(digits) : 0);
                }}
                style={styles.input}
              />
            </>
          )}

          <Pressable style={styles.saveBtn} onPress={save}>
            <Text style={{ color: "#fff" }}>Salvar</Text>
          </Pressable>

          <Pressable onPress={onClose}>
            <Text style={{ textAlign: "center", marginTop: 10 }}>Cancelar</Text>
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
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 10 },
  saveBtn: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
  },
});
