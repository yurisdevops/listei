import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "../theme/ThemeProvider";
import { formatBRL } from "../../utils/money";

type Props = {
  checkedCount: number;
  totalCount: number;
  checkedTotal: number;
  total: number;
};

export function ShoppingProgress({
  checkedCount,
  totalCount,
  checkedTotal,
  total,
}: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.chipBg,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <AppText style={[styles.text, { color: theme.colors.text }]}>
        ✓ {checkedCount}/{totalCount} · {formatBRL(checkedTotal)} /{" "}
        {formatBRL(total)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  text: { fontWeight: "800", fontSize: 14 },
});
