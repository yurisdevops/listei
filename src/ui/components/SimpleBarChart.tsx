import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./AppText";

type Point = { label: string; value: number };

type Props = {
  data: Point[];
  height?: number;
};

export function SimpleBarChart({ data, height = 120 }: Props) {
  const max = useMemo(() => {
    const m = Math.max(...data.map((d) => d.value), 0);
    return m === 0 ? 1 : m; // evita divisão por zero
  }, [data]);

  return (
    <View style={[styles.wrap, { height }]}>
      {data.map((p, idx) => {
        const h = Math.max(6, Math.round((p.value / max) * (height - 26)));
        return (
          <View key={`${p.label}-${idx}`} style={styles.col}>
            <View style={[styles.bar, { height: h }]} />
            <AppText muted style={styles.lbl}>
              {p.label.replace(".", "")}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  col: { alignItems: "center", flex: 1 },
  bar: {
    width: 14,
    borderRadius: 8,
    // cor neutra por enquanto (depois a gente aplica theme)
    backgroundColor: "#2e7d32",
  },
  lbl: { marginTop: 6, fontSize: 12 },
});
