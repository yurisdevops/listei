import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export function AppInput(props: TextInputProps) {
  const { theme } = useTheme();
  return (
    <TextInput
      placeholderTextColor={theme.colors.mutedText}
      {...props}
      style={[
        {
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card,
          color: theme.colors.text,
          borderRadius: 12,
          padding: 12,
        },
        props.style,
      ]}
    />
  );
}
