import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { SettingsStackParamList } from "./types";
import { SettingsScreen } from "../screens/SettingsScreen";
import { BackupScreen } from "../screens/BackupScreen";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Ajustes" }}
      />
      <Stack.Screen
        name="Backup"
        component={BackupScreen}
        options={{ title: "Backup" }}
      />
    </Stack.Navigator>
  );
}
