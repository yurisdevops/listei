import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type Props = TextProps & { muted?: boolean };

export function AppText({ style, muted, ...rest }: Props) {
  const theme = useTheme();
  return (
    <Text
      {...rest}
      style={[
        { color: muted ? theme.colors.mutedText : theme.colors.text },
        style,
      ]}
    />
  );
}
