import React from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { RootStackParamList } from "./src/app/navigation/types";
import { TabsNavigator } from "./src/app/navigation/TabsNavigator";
import { ThemeProvider, useTheme } from "./src/ui/theme/ThemeProvider";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppRoot() {
  const theme = useTheme();

  const navTheme = theme.dark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: theme.colors.primary,
          background: theme.colors.bg,
          card: theme.colors.card,
          text: theme.colors.text,
          border: theme.colors.border,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: theme.colors.primary,
          background: theme.colors.bg,
          card: theme.colors.card,
          text: theme.colors.text,
          border: theme.colors.border,
        },
      };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AppTabs" component={TabsNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppRoot />
    </ThemeProvider>
  );
}