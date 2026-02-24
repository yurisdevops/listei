import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type Variant = "primary" | "outline" | "danger";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
  disabled?: boolean;
};

export function AppButton({
  title,
  onPress,
  variant = "outline",
  style,
  disabled,
}: Props) {
  const theme = useTheme();

  const bg =
    variant === "primary"
      ? theme.colors.primary
      : variant === "danger"
        ? theme.colors.danger
        : "transparent";

  const borderColor =
    variant === "outline" ? theme.colors.border : "transparent";

  const textColor =
    variant === "outline" ? theme.colors.text : "#fff";

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Text style={{ color: textColor, fontWeight: "800" }}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});