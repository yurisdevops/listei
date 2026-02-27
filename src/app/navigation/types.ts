import type { NavigatorScreenParams } from "@react-navigation/native";

export type TabsParamList = {
  ListsTab: NavigatorScreenParams<ListsStackParamList>;
  StatsTab: NavigatorScreenParams<StatsStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
  CatalogTab: NavigatorScreenParams<CatalogStackParamList>;
};

export type ListsStackParamList = {
  Lists: undefined;
  ListDetails: { listId: string };
  Catalog: { listId: string; filterFavorites?: boolean };
  CatalogManager: undefined;
  CatalogEditor: { id: string | null };
};

export type SettingsStackParamList = {
  Settings: undefined;
  Backup: undefined;
};

export type StatsStackParamList = {
  Stats: undefined;
};

export type RootStackParamList = {
  AppTabs: undefined;
};

export type CatalogStackParamList = {
  CatalogManager: undefined;
  CatalogEditor: { id: string | null };
};
