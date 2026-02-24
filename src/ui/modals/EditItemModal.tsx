import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import type { CatalogItem } from "../../domain/models/catolog";
import type { ListItem } from "../../domain/models/list";
import { useListsStore } from "../../state/store/lists.store";
import { onlyDigits, formatCentsBRL } from "../../utils/money";
import { useTheme } from "../theme/ThemeProvider";

import { AppText } from "../components/AppText";
import { Card } from "../components/Card";
import { AppInput } from "../components/AppInput";
import { AppButton } from "../components/AppButtom";

type Props = {
  visible: boolean;
  item: ListItem | null;
  catalog: CatalogItem | undefined;
  onClose: () => void;
};

export function EditItemModal({ catalog, item, onClose, visible }: Props) {
  const theme = useTheme();
  const updateUnitItem = useListsStore((s) => s.updateUnitItem);
  const updateWeightItem = useListsStore((s) => s.updateWeightItem);

  const [qty, setQty] = useState("1");
  const [kg, setKg] = useState("0");
  const [priceCents, setPriceCents] = useState(0);
  const [priceKgCents, setPriceKgCents] = useState(0);

  useEffect(() => {
    if (!item) return;
    setQty(String(item.qty ?? 1));
    setKg(String(item.weightKg ?? 0));
    setPriceCents(Math.round((item.unitPrice ?? 0) * 100));
    setPriceKgCents(Math.round((item.pricePerKg ?? 0) * 100));
  }, [item?.id]);

  if (!item || !catalog) return null;

  function toNumberKg(v: string) {
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }

  function save() {
    if (!catalog || !item) return;
    if (catalog.pricingType === "unit") {
      updateUnitItem(item.id, Number(qty) || 1, priceCents / 100);
    } else {
      updateWeightItem(item.id, toNumberKg(kg), priceKgCents / 100);
    }
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={[
          styles.overlay,
          { backgroundColor: theme.dark ? "#000A" : "#0006" },
        ]}
      >
        <Card style={{ width: "88%" }}>
          <AppText style={{ fontSize: 18, fontWeight: "900" }}>
            {catalog.name}
          </AppText>

          {catalog.pricingType === "unit" ? (
            <>
              <AppInput
                placeholder="Quantidade"
                keyboardType="numeric"
                value={qty}
                onChangeText={setQty}
                style={{ marginTop: 12 }}
              />

              <AppInput
                placeholder="Preço (R$)"
                keyboardType="number-pad"
                value={formatCentsBRL(priceCents)}
                onChangeText={(t) => {
                  const digits = onlyDigits(t);
                  setPriceCents(digits ? Number(digits) : 0);
                }}
                style={{ marginTop: 12 }}
              />
            </>
          ) : (
            <>
              <AppInput
                placeholder="Peso (kg)"
                keyboardType="decimal-pad"
                value={kg}
                onChangeText={setKg}
                style={{ marginTop: 12 }}
              />

              <AppInput
                placeholder="Preço por kg (R$)"
                keyboardType="number-pad"
                value={formatCentsBRL(priceKgCents)}
                onChangeText={(t) => {
                  const digits = onlyDigits(t);
                  setPriceKgCents(digits ? Number(digits) : 0);
                }}
                style={{ marginTop: 12 }}
              />
            </>
          )}

          <View style={{ marginTop: 14, gap: 10 }}>
            <AppButton title="Salvar" onPress={save} variant="primary" />
            <AppButton title="Cancelar" onPress={onClose} variant="outline" />
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center" },
});
