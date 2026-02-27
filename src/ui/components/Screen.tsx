import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type Props = ViewProps & {
  padded?: boolean;
};

export function Screen({ padded = true, style, children, ...rest }: Props) {
  const {theme} = useTheme();

  return (
    <View
      {...rest}
      style={[
        {
          flex: 1,
          backgroundColor: theme.colors.bg,
          padding: padded ? theme.spacing.md : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}