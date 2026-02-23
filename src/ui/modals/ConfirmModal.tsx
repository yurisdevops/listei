import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

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
  message,
  onClose,
  onConfirm,
  visible,
  cancelText,
  confirmText,
  destructive,
  title,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.msg}>{message}</Text>
          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.cancel]} onPress={onClose}>
              <Text>{cancelText}</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, destructive ? styles.danger : styles.ok]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text style={styles.okText}>{confirmText}</Text>
            </Pressable>
          </View>
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
    padding: 16,
  },
  box: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: "700" },
  msg: { marginTop: 10, opacity: 0.8, lineHeight: 20 },
  row: { flexDirection: "row", gap: 10, marginTop: 16 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  cancel: { borderWidth: 1 },
  cancelText: { fontWeight: "700" },
  ok: { backgroundColor: "#1b5e20" },
  danger: { backgroundColor: "#c62828" },
  okText: { color: "#fff", fontWeight: "700" },
});
