import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { CatalogStackParamList } from "./types";

import { CatalogManagerScreen } from "../screens/CatalogManagerScreen";
import { CatalogEditorScreen } from "../screens/CatalogEditorScreen";

const Stack = createNativeStackNavigator<CatalogStackParamList>();

export function CatalogStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CatalogManager"
        component={CatalogManagerScreen}
        options={{ title: "Gerenciador de Catálogo" }}
      />
      <Stack.Screen
        name="CatalogEditor"
        component={CatalogEditorScreen}
        options={{ title: "Editor de Catálogo" }}
      />
    </Stack.Navigator>
  );
}
