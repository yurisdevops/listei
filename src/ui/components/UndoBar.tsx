import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  message: string;
  onUndo: () => void;
};

export function UndoBar({ visible, message, onUndo }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>

      <Pressable onPress={onUndo}>
        <Text style={styles.undo}>DESFAZER</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#323232",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
  undo: {
    color: "#4caf50",
    fontWeight: "800",
  },
});
