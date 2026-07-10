import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../components/AppText";
import { useTheme } from "../theme/ThemeProvider";
import { formatBRL } from "../../utils/money";

type Props = { total: number; budget?: number };

export function BudgetBar({ total, budget }: Props) {
  const { theme } = useTheme();
  if (!budget || budget <= 0) return null;

  const { percentage, exceeded } = useMemo(() => {
    const percentage = Math.min((total / budget) * 100, 100);
    return { percentage, exceeded: total > budget };
  }, [total, budget]);

  return (
    <View style={styles.container}>
      <AppText style={[styles.label, { color: theme.colors.text }]}>
        Orçamento: {formatBRL(budget)}
      </AppText>

      <View
        style={[styles.barBackground, { backgroundColor: theme.colors.border }]}
      >
        <View
          style={[
            styles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: exceeded
                ? theme.colors.danger
                : theme.colors.success,
            },
          ]}
        />
      </View>

      <AppText muted style={{ marginTop: 6 }}>
        {percentage.toFixed(0)}% utilizado
        {exceeded ? " • orçamento excedido" : ""}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontWeight: "800" },
  barBackground: {
    height: 10,
    borderRadius: 5,
    marginTop: 8,
    overflow: "hidden",
  },
  barFill: { height: 10, borderRadius: 5 },
});
