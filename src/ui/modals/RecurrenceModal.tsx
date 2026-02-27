import React from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import type { RecurrenceType } from "../../domain/models/list";
import { AppText } from "../components/AppText";
import { useTheme } from "../theme/ThemeProvider";

type Props = {
  visible: boolean;
  value: RecurrenceType | undefined;
  onClose: () => void;
  onSelect: (v: RecurrenceType) => void;
};

const OPTIONS: { label: string; value: RecurrenceType }[] = [
  { label: "Sem recorrência", value: null },
  { label: "Semanal", value: "weekly" },
  { label: "Quinzenal", value: "biweekly" },
  { label: "Mensal", value: "monthly" },
];

export function RecurrenceModal({ visible, value, onClose, onSelect }: Props) {
  const { theme } = useTheme();

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
          <AppText style={styles.title}>Recorrência</AppText>

          {OPTIONS.map((opt) => {
            const active = opt.value === (value ?? null);

            return (
              <Pressable
                key={String(opt.value)}
                style={[
                  styles.option,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: active
                      ? theme.colors.chipBg
                      : "transparent",
                  },
                ]}
                onPress={() => {
                  onSelect(opt.value);
                  onClose();
                }}
              >
                <AppText style={{ fontWeight: "800" }}>{opt.label}</AppText>
              </Pressable>
            );
          })}

          <Pressable onPress={onClose}>
            <AppText muted style={{ textAlign: "center", marginTop: 10 }}>
              Fechar
            </AppText>
          </Pressable>
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
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  title: { fontSize: 18, fontWeight: "900", marginBottom: 10 },
  option: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 10,
  },
});
