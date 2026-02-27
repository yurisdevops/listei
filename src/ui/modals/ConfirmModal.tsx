import React from "react";
import { Modal, View, Pressable, StyleSheet } from "react-native";
import { AppText } from "../components/AppText";
import { AppButton } from "../components/AppButton";
import { useTheme } from "../theme/ThemeProvider";

type Props = {
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmModal({
  visible,
  title = "Confirmar",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  destructive = false,
  onConfirm,
  onClose,
}: Props) {
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
          <AppText style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </AppText>
          <AppText muted style={styles.msg}>
            {message}
          </AppText>

          <View style={styles.row}>
            <AppButton
              title={cancelText}
              onPress={onClose}
              variant="outline"
              style={{ flex: 1 }}
            />
            <AppButton
              title={confirmText}
              onPress={() => {
                onConfirm();
                onClose();
              }}
              variant={destructive ? "danger" : "primary"}
              style={{ flex: 1 }}
            />
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  title: { fontSize: 18, fontWeight: "900" },
  msg: { marginTop: 10, lineHeight: 20 },
  row: { flexDirection: "row", gap: 10, marginTop: 16 },
});
