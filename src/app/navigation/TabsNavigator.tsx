import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { TabsParamList } from "./types";
import { ListsStackNavigator } from "./ListsStackNavigator";
import { StatsScreen } from "../screens/StatsScreen";
import { useListsStore } from "../../state/store/lists.store";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ui/theme/ThemeProvider";
import { SettingsStackNavigator } from "./SettingsStackNavigator";
import { StatsStackNavigator } from "./StatsStackNavigator";
import { CatalogStackNavigator } from "./CatalogStackNavigator";

const Tab = createBottomTabNavigator<TabsParamList>();

function getTabIcon(routeName: keyof TabsParamList, focused: boolean) {
  if (routeName === "ListsTab") return focused ? "list" : "list-outline";
  if (routeName === "StatsTab")
    return focused ? "stats-chart" : "stats-chart-outline";
  if (routeName === "CatalogTab")
    return focused ? "pricetags" : "pricetags-outline";
  return focused ? "settings" : "settings-outline";
}

export function TabsNavigator() {
  const activeCount = useListsStore(
    (s) => s.lists.filter((l) => !l.completedAt).length,
  );

  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 62,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontWeight: "800" },

        tabBarIcon: ({ color, size, focused }) => {
          const iconName = getTabIcon(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="ListsTab"
        component={ListsStackNavigator}
        options={{
          title: "Listas",
          tabBarBadge: activeCount > 0 ? activeCount : undefined,
        }}
      />

      <Tab.Screen
        name="CatalogTab"
        component={CatalogStackNavigator}
        options={{ title: "Catálogo" }}
      />

      <Tab.Screen
        name="StatsTab"
        component={StatsStackNavigator}
        options={{ title: "Estatísticas" }}
      />

      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{ title: "Ajustes" }}
      />
    </Tab.Navigator>
  );
}
