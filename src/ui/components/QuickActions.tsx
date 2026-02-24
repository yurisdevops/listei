import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

type Action = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export function QuickActions({ actions }: { actions: Action[] }) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      {actions.map((a) => (
        <Pressable
          key={a.key}
          onPress={a.onPress}
          style={({ pressed }) => [
            styles.btn,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <View style={styles.inner}>
            <Ionicons name={a.icon} size={22} color={theme.colors.primary} />
            <AppText style={[styles.label, { color: theme.colors.text }]}>
              {a.label}
            </AppText>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 6,
  },
  btn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minWidth: 140,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    fontWeight: "800",
    fontSize: 14,
  },
});
