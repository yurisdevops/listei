import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen } from "../../ui/components/Screen";
import { AppText } from "../../ui/components/AppText";
import type { SettingsStackParamList } from "../navigation/types";
import { useTheme } from "../../ui/theme/ThemeProvider";

type Props = NativeStackScreenProps<SettingsStackParamList, "Settings">;

const THEME_OPTIONS = [
  { key: "system" as const, label: "Sistema" },
  { key: "light" as const, label: "Claro" },
  { key: "dark" as const, label: "Escuro" },
];

export function SettingsScreen({ navigation }: Props) {
  const { theme, mode, setMode } = useTheme();

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  };

  const chipBase = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  };

  const chipActive = {
    backgroundColor: theme.colors.chipBg,
    borderColor: theme.colors.primary,
  };

  return (
    <Screen padded style={{ gap: 12 }}>
      <AppText style={[styles.title, { color: theme.colors.text }]}>
        ⚙️ Ajustes
      </AppText>

      <View style={[styles.card, cardStyle]}>
        <AppText style={[styles.cardTitle, { color: theme.colors.text }]}>
          🎨 Tema
        </AppText>
        <AppText muted>Escolha como o app deve se comportar.</AppText>

        <View style={styles.row}>
          {THEME_OPTIONS.map((opt) => {
            const active = mode === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setMode(opt.key)}
                style={[styles.chip, chipBase, active && chipActive]}
              >
                <AppText
                  style={{ fontWeight: "900", color: theme.colors.text }}
                >
                  {opt.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        style={[styles.card, cardStyle]}
        onPress={() => navigation.navigate("Backup")}
      >
        <AppText style={[styles.cardTitle, { color: theme.colors.text }]}>
          📦 Backup e Restauração
        </AppText>
        <AppText muted>Exportar / importar seus dados (JSON)</AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900" },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },

  cardTitle: { fontWeight: "900", fontSize: 16 },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },

  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
