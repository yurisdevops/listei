import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import type { ListItem } from "../../domain/models/list";
import { calculateListTotal } from "../../domain/services/calc";
import { AppText } from "../components/AppText";
import { useTheme } from "../theme/ThemeProvider";

type Props = { items: ListItem[] };

export function BottomSumary({ items }: Props) {
  const { theme } = useTheme();

  const { total, bought, pending } = useMemo(() => {
    const total = calculateListTotal(items);
    const bought = items.filter((i) => i.checked).length;
    const pending = items.length - bought;
    return { total, bought, pending };
  }, [items]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      <AppText
        style={[styles.small, { color: theme.colors.onPrimary, opacity: 0.9 }]}
      >
        {pending} pendentes • {bought} comprados
      </AppText>

      <AppText style={[styles.total, { color: theme.colors.onPrimary }]}>
        R$ {total.toFixed(2)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  small: { fontSize: 12, fontWeight: "700" },
  total: { fontSize: 20, fontWeight: "900", marginTop: 2 },
});
