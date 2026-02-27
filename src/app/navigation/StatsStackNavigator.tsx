import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatsScreen } from "../screens/StatsScreen";
import { StatsStackParamList } from "./types";

const Stack = createNativeStackNavigator<StatsStackParamList>();

export function StatsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{ title: "Estatísticas" }}
      />
    </Stack.Navigator>
  );
}
