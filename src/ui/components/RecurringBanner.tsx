import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "../theme/ThemeProvider";
import { AppButton } from "./AppButton";

type Props = {
  onPress: () => void;
};

export function RecurringBanner({ onPress }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.chipBg,
          borderColor: theme.colors.primary,
        },
      ]}
    >
      <AppText style={[styles.title, { color: theme.colors.text }]}>
        🔁 Lista recorrente disponível
      </AppText>

      <AppText muted style={styles.subtitle}>
        Essa lista pode ser recriada automaticamente.
      </AppText>

      <AppButton
        title="Recriar agora"
        onPress={onPress}
        variant="primary"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  title: { fontWeight: "900", fontSize: 15 },
  subtitle: { fontSize: 13 },
  button: { marginTop: 8 },
});
