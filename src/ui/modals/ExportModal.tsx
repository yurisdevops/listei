import React from "react";
import { Modal, View, Pressable, StyleSheet, ScrollView } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";
import { AppText } from "../components/AppText";
import { AppButton } from "../components/AppButton";
import { useTheme } from "../theme/ThemeProvider";

type Props = {
  visible: boolean;
  text: string;
  onClose: () => void;
};

export function ExportModal({ onClose, text, visible }: Props) {
  const { theme } = useTheme();

  async function copy() {
    await Clipboard.setStringAsync(text);
    onClose();
  }

  async function share() {
    await Share.share({ message: text });
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
            Compartilhar lista
          </AppText>

          <ScrollView
            style={[styles.preview, { borderColor: theme.colors.border }]}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <AppText style={{ lineHeight: 20 }}>{text}</AppText>
          </ScrollView>

          <View style={styles.row}>
            <AppButton
              title="Copiar"
              onPress={copy}
              variant="outline"
              style={{ flex: 1 }}
            />
            <AppButton
              title="Compartilhar"
              onPress={share}
              variant="primary"
              style={{ flex: 1 }}
            />
          </View>

          <Pressable onPress={onClose} style={{ marginTop: 12 }}>
            <AppText muted style={{ textAlign: "center", fontWeight: "800" }}>
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
    maxWidth: 500,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  title: { fontSize: 18, fontWeight: "900" },
  preview: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    maxHeight: 280,
  },
  row: { flexDirection: "row", gap: 10, marginTop: 12 },
});
