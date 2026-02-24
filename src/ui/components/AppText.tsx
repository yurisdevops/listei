import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export function AppText({ style, ...rest }: TextProps) {
  const theme = useTheme();
  return <Text {...rest} style={[{ color: theme.colors.text }, style]} />;
}