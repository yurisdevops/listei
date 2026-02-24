import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ListsStackParamList } from "./types";

import { ListsScreen } from "../screens/ListsScreen";
import { CatalogScreen } from "../screens/CatalogScreen";
import { CatalogManagerScreen } from "../screens/CatalogManagerScreen";
import { CatalogEditorScreen } from "../screens/CatalogEditorScreen";
import { ListDetailsScreen } from "../screens/ListaDetailsScreen";

const Stack = createNativeStackNavigator<ListsStackParamList>();

export function ListsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Lists"
        component={ListsScreen}
        options={{ title: "Listas" }}
      />
      <Stack.Screen
        name="ListDetails"
        component={ListDetailsScreen}
        options={{ title: "Detalhes" }}
      />
      <Stack.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{ title: "Catálogo" }}
      />
      <Stack.Screen
        name="CatalogManager"
        component={CatalogManagerScreen}
        options={{ title: "Gerenciar Catálogo" }}
      />
      <Stack.Screen
        name="CatalogEditor"
        component={CatalogEditorScreen}
        options={{ title: "Editar Item" }}
      />
    </Stack.Navigator>
  );
}
