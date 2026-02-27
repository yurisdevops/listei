import React from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  type InitialState,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { RootStackParamList } from "./src/app/navigation/types";
import { TabsNavigator } from "./src/app/navigation/TabsNavigator";
import { ThemeProvider, useTheme } from "./src/ui/theme/ThemeProvider";
import { AppTheme } from "./src/ui/theme/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

const PERSISTENCE_KEY = "NAVIGATION_STATE";

function createNavigationTheme(theme: AppTheme) {
  const baseTheme = theme.dark ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.bg,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };
}

function AppRoot() {
  const { theme } = useTheme();
  const navTheme = createNavigationTheme(theme);

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >(undefined);

  React.useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedState
          ? (JSON.parse(savedState) as InitialState)
          : undefined;

        if (isMounted) setInitialState(state);
      } catch {
      } finally {
        if (isMounted) setIsReady(true);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        theme={navTheme}
        initialState={initialState}
        onStateChange={(state) => {
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state)).catch(
            () => {},
          );
        }}
      >
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
