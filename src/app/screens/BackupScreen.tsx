import React, { useMemo, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Share,
} from "react-native";

import { Screen } from "../../ui/components/Screen";
import { AppText } from "../../ui/components/AppText";
import { useListsStore } from "../../state/store/lists.store";
import { buildBackup, parseBackup } from "../../domain/services/backup";
import { useTheme } from "../../ui/theme/ThemeProvider";

export function BackupScreen() {
  const { theme } = useTheme();

  const lists = useListsStore((s) => s.lists);
  const items = useListsStore((s) => s.items);
  const catalog = useListsStore((s) => s.catalog);
  const restoreBackup = useListsStore((s) => s.restoreBackup);

  const [importOpen, setImportOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");

  const backupJson = useMemo(
    () => buildBackup({ lists, items, catalog }),
    [lists, items, catalog],
  );

  const canImport = jsonText.trim().length > 0;

  async function handleExport() {
    try {
      await Share.share({ message: backupJson });
    } catch {
    }
  }

  function openImportModal() {
    setJsonText("");
    setImportOpen(true);
  }

  function closeImportModal() {
    setImportOpen(false);
  }

  function handleImport() {
    const text = jsonText.trim();
    if (!text) {
      alert("Cole o JSON do backup antes de restaurar.");
      return;
    }

    const parsed = parseBackup(text);
    if (!parsed) {
      alert("JSON inválido. Verifique se você copiou o backup completo.");
      return;
    }

    restoreBackup(parsed);
    closeImportModal();
    alert("Backup restaurado com sucesso!");
  }

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  };

  return (
    <Screen padded style={{ gap: 12 }}>
      <AppText style={styles.title}>📦 Backup e Restauração</AppText>

      <AppText muted>
        Exporte seus dados como JSON e guarde onde preferir
        (Drive/WhatsApp/e-mail). Para restaurar, cole o JSON no importador.
      </AppText>

      <View style={styles.block}>
        <Pressable
          style={[styles.buttonBase, cardStyle]}
          onPress={handleExport}
        >
          <AppText style={styles.buttonText}>
            Exportar backup (Compartilhar)
          </AppText>
        </Pressable>

        <Pressable
          style={[styles.buttonBase, cardStyle]}
          onPress={openImportModal}
        >
          <AppText style={styles.buttonText}>
            Importar backup (colar JSON)
          </AppText>
        </Pressable>
      </View>

      <Modal
        visible={importOpen}
        transparent
        animationType="slide"
        onRequestClose={closeImportModal}
      >
        <View
          style={[
            styles.overlay,
            { backgroundColor: theme.colors.overlay ?? "rgba(0,0,0,0.45)" },
          ]}
        >
          <View style={[styles.modalBox, cardStyle]}>
            <AppText style={styles.modalTitle}>Importar Backup</AppText>
            <AppText muted style={{ marginBottom: 10 }}>
              Cole aqui o JSON exportado.
            </AppText>

            <View style={[styles.textAreaWrap, cardStyle]}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <TextInput
                  value={jsonText}
                  onChangeText={setJsonText}
                  placeholder="Cole o JSON aqui..."
                  placeholderTextColor={theme.colors.mutedText}
                  multiline
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={[styles.textArea, { color: theme.colors.text }]}
                />
              </ScrollView>
            </View>

            <View style={styles.row}>
              <Pressable
                style={[
                  styles.smallBtn,
                  {
                    backgroundColor: theme.colors.danger,
                    borderColor: "transparent",
                  },
                ]}
                onPress={closeImportModal}
              >
                <AppText
                  style={{
                    fontWeight: "900",
                    color: theme.colors.onDanger ?? "#fff",
                  }}
                >
                  Cancelar
                </AppText>
              </Pressable>

              <Pressable
                style={[
                  styles.smallBtn,
                  {
                    backgroundColor:
                      theme.colors.success ?? theme.colors.primary,
                    borderColor: "transparent",
                    opacity: canImport ? 1 : 0.55,
                  },
                ]}
                disabled={!canImport}
                onPress={handleImport}
              >
                <AppText
                  style={{
                    fontWeight: "900",
                    color:
                      theme.colors.onSuccess ??
                      theme.colors.onPrimary ??
                      "#fff",
                  }}
                >
                  Restaurar
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "900" },

  block: { gap: 10, marginTop: 8 },

  buttonBase: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  buttonText: { fontWeight: "900" },

  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },

  modalBox: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: "900", marginBottom: 6 },

  textAreaWrap: {
    borderWidth: 1,
    borderRadius: 12,
    height: 240,
    padding: 10,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 220,
    textAlignVertical: "top",
  },

  row: { flexDirection: "row", gap: 10, justifyContent: "flex-end" },
  smallBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
});
