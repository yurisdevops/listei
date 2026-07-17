import React, { useMemo, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Share,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

import { Screen } from "../../ui/components/Screen";
import { AppText } from "../../ui/components/AppText";
import { useListsStore } from "../../state/store/lists.store";
import {
  buildBackup,
  parseBackup,
  type BackupData,
} from "../../domain/services/backup";
import { useTheme } from "../../ui/theme/ThemeProvider";
import { ConfirmModal } from "../../ui/modals/ConfirmModal";

function buildBackupFileName() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `listei-backup-${y}-${m}-${d}.json`;
}

export function BackupScreen() {
  const { theme } = useTheme();

  const lists = useListsStore((s) => s.lists);
  const items = useListsStore((s) => s.items);
  const catalog = useListsStore((s) => s.catalog);
  const restoreBackup = useListsStore((s) => s.restoreBackup);

  const [importOpen, setImportOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");

  const [confirmImportOpen, setConfirmImportOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<BackupData | null>(null);

  const backupJson = useMemo(
    () => buildBackup({ lists, items, catalog }),
    [lists, items, catalog],
  );

  const canImport = jsonText.trim().length > 0;

  async function shareBackupAsText() {
    try {
      await Share.share({ message: backupJson });
    } catch {
      Alert.alert("Erro ao exportar", "Não foi possível compartilhar o backup.");
    }
  }

  async function handleExport() {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) throw new Error("cache directory unavailable");

      const fileUri = `${cacheDir}${buildBackupFileName()}`;

      await FileSystem.writeAsStringAsync(fileUri, backupJson, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert(
          "Compartilhamento indisponível",
          "Este dispositivo não permite compartilhar arquivos. Vamos exportar como texto.",
        );
        await shareBackupAsText();
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Salvar backup do Listei",
      });
    } catch {
      await shareBackupAsText();
    }
  }

  async function handleImportFromFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      if (!file) return;

      const content = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const parsed = parseBackup(content);
      if (!parsed) {
        Alert.alert(
          "Arquivo inválido",
          "Esse arquivo não é um backup válido do Listei.",
        );
        return;
      }

      setPendingImport(parsed);
      setConfirmImportOpen(true);
    } catch {
      Alert.alert(
        "Erro ao importar",
        "Não foi possível ler o arquivo selecionado.",
      );
    }
  }

  function confirmImport() {
    if (!pendingImport) return;
    restoreBackup(pendingImport);
    Alert.alert("Backup restaurado", "Seus dados foram restaurados com sucesso!");
  }

  function closeConfirmImport() {
    setConfirmImportOpen(false);
    setPendingImport(null);
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
      Alert.alert("Nada para importar", "Cole o JSON do backup antes de restaurar.");
      return;
    }

    const parsed = parseBackup(text);
    if (!parsed) {
      Alert.alert(
        "JSON inválido",
        "Verifique se você copiou o backup completo.",
      );
      return;
    }

    closeImportModal();
    setPendingImport(parsed);
    setConfirmImportOpen(true);
  }

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  };

  const highlightStyle = {
    backgroundColor: theme.colors.primary,
    borderColor: "transparent",
  };

  return (
    <Screen padded style={{ gap: 12 }}>
      <AppText style={styles.title}>📦 Backup e Restauração</AppText>

      <AppText muted>
        Exporte seus dados como um arquivo .json e guarde onde preferir
        (Drive/e-mail). Para restaurar num celular novo, importe esse
        arquivo.
      </AppText>

      <View style={styles.block}>
        <Pressable
          style={[styles.buttonBase, cardStyle]}
          onPress={handleExport}
        >
          <AppText style={styles.buttonText}>
            Exportar backup (arquivo)
          </AppText>
        </Pressable>

        <Pressable
          style={[styles.buttonBase, highlightStyle]}
          onPress={handleImportFromFile}
        >
          <AppText style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
            Importar de arquivo
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

      <ConfirmModal
        visible={confirmImportOpen}
        title="Restaurar backup"
        message="Restaurar esse backup vai SUBSTITUIR todas as listas, itens e catálogo atuais. Essa ação não pode ser desfeita."
        confirmText="Restaurar"
        cancelText="Cancelar"
        destructive
        onConfirm={confirmImport}
        onClose={closeConfirmImport}
      />
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
