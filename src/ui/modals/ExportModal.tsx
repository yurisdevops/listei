import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";
import { AppText } from "../components/AppText";

type Props = {
  visible: boolean;
  text: string;
  onClose: () => void;
};

export function ExportModal({ onClose, text, visible }: Props) {
  async function copy() {
    await Clipboard.setStringAsync(text);
    onClose();
  }

  async function share() {
    await Share.share({ message: text });
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <AppText style={styles.title}>Compartilhar lista</AppText>
          <ScrollView style={styles.preview}>
            <AppText style={{ lineHeight: 20 }}>{text}</AppText>
          </ScrollView>
          <View style={styles.row}>
            <Pressable style={[styles.btn, { borderWidth: 1 }]} onPress={copy}>
              <AppText style={{ fontWeight: "800" }}>Copiar</AppText>
            </Pressable>
            <Pressable
              style={[styles.btn, { backgroundColor: "#2e7d32" }]}
              onPress={share}
            >
              <AppText style={{ color: "#fff", fontWeight: "800" }}>
                Compartilhar
              </AppText>
            </Pressable>
          </View>
          <Pressable onPress={onClose}>
            <AppText
              style={{ textAlign: "center", marginTop: 12, opacity: 0.7 }}
            >
              {" "}
              Fechar
            </AppText>
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
    padding: 16,
  },
  box: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: "800" },
  preview: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    maxHeight: 280,
  },
  row: { flexDirection: "row", gap: 10, marginTop: 12 },
  btn: { flex: 1, padding: 12, borderRadius: 12, alignItems: "center" },
});
