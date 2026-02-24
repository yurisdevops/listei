import { Text, View, StyleSheet } from "react-native";
import type { ListItem } from "../../domain/models/list";
import { calculateListTotal } from "../../domain/services/calc";
import { Screen } from "../components/Screen";
import { AppText } from "../components/AppText";

type Props = {
  items: ListItem[];
};

export function BottomSumary({ items }: Props) {
  const total = calculateListTotal(items);
  const bought = items.filter((i) => i.checked).length;
  const pedding = items.length - bought;

  return (
    <Screen>
      <View>
        <AppText style={styles.small}>
          {pedding} pendentes • {bought} comprados
        </AppText>
        <AppText style={styles.total}>R$ {total.toFixed(2)}</AppText>
      </View>
    </Screen>
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
