import { Pressable, Text, StyleSheet } from "react-native";

type Props = {
  onPress: () => void;
};

export function Fab({ onPress }: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 90, // acima da BottomSummary
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1b5e20",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    zIndex:99
  },
  plus: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
  },
});
