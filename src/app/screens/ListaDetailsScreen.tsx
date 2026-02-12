import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ListDetails">;

export function ListDetailsScreen({ route }: Props) {
  const { listId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista: {listId}</Text>
      <Text style={styles.sub}>
        Na Aula 2 a gente vai colocar itens aqui, com total.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 18, fontWeight: "700" },
  sub: { opacity: 0.7 },
});
