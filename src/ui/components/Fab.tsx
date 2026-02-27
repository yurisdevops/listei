import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "../theme/ThemeProvider";

type Props = {
  onPress: () => void;
};

export function Fab({ onPress }: Props) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.colors.primary,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Adicionar"
    >
      <AppText
        style={{
          fontSize: 28,
          color: theme.colors.onPrimary ?? "#fff",
          fontWeight: "900",
        }}
      >
        +
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 90, // acima da BottomSummary
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    zIndex: 99,
  },
});
