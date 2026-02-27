import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "../theme/ThemeProvider";

type Props = {
  visible: boolean;
  message: string;
  onUndo: () => void;
};

export function UndoBar({ visible, message, onUndo }: Props) {
  const { theme } = useTheme();
  if (!visible) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.overlay ?? theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <AppText style={{ color: theme.colors.onPrimary, fontWeight: "700" }}>
        {message}
      </AppText>

      <Pressable onPress={onUndo} hitSlop={10}>
        <AppText style={{ color: theme.colors.primary, fontWeight: "900" }}>
          DESFAZER
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 6,
  },
});
