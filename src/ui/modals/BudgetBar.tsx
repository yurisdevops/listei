import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  total: number;
  budget?: number;
};

export function BudgetBar({ total, budget }: Props) {
  if (!budget || budget <= 0) return null;

  const percentage = Math.min((total / budget) * 100, 100);
  const exceeded = total > budget;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Orçamento: R$ {budget.toFixed(2)}</Text>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: exceeded ? "#c62828" : "#2e7d32",
            },
          ]}
        />
      </View>
      <Text style={{ marginTop: 4 }}>{percentage.toFixed(0)}% utilizado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontWeight: "600" },
  barBackground: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginTop: 6,
  },
  barFill: {
    height: 10,
    borderRadius: 5,
  },
});
