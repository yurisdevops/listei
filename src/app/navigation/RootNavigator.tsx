import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";

import { ListsScreen } from "../screens/ListsScreen";
import { CatalogScreen } from "../screens/CatalogScreen";
import { ListDetailsScreen } from "../screens/ListaDetailsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Lists"
        component={ListsScreen}
        options={{ title: "Minhas listas" }}
      />
      <Stack.Screen
        name="ListDetails"
        component={ListDetailsScreen}
        options={{ title: "Lista" }}
      />
      <Stack.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{ title: "Catálogo" }}
      />
    </Stack.Navigator>
  );
}
