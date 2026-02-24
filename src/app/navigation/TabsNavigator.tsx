import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { TabsParamList } from "./types";
import { ListsStackNavigator } from "./ListsStackNavigator";
import { StatsScreen } from "../screens/StatsScreen";
import { useListsStore } from "../../state/store/lists.store";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ui/theme/ThemeProvider";

const Tab = createBottomTabNavigator<TabsParamList>();

export function TabsNavigator() {
  const activeCount = useListsStore(
    (s) => s.lists.filter((l) => !l.completedAt).length,
  );
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "ListsTab") {
            iconName = focused ? "list" : "list-outline";
          } else {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          }

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
        name="StatsTab"
        component={StatsScreen}
        options={{ title: "Stats" }}
      />
    </Tab.Navigator>
  );
}
