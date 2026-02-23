import { Text, View, StyleSheet } from "react-native";
import type { ListItem } from "../../domain/models/list";
import { calculateListTotal } from "../../domain/services/calc";

type Props = {
  items: ListItem[];
};

export function BottomSumary({ items }: Props) {
  const total = calculateListTotal(items);
  const bought = items.filter((i) => i.checked).length;
  const pedding = items.length - bought;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.small}>
          {pedding} pendentes • {bought} comprados
        </Text>
        <Text style={styles.total}>R$ {total.toFixed(2)}</Text>
      </View>
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
    backgroundColor: "#1b5e20",
  },
  small: {
    color: "#c8e6c9",
    fontSize: 12,
  },
  total: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
