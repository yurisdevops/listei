export type RootStackParamList = {
  Lists: undefined;
  ListDetails: { listId: string };
  Catalog: { listId: string };
  CatalogEditor: { id: string | null };
  CatalogManager: undefined;
  Stats: undefined;
  AppTabs: undefined;
};

export type TabsParamList = {
  ListsTab: undefined;
  StatsTab: undefined;
};

export type ListsStackParamList = {
  Lists: undefined;
  ListDetails: { listId: string };
  Catalog: { listId: string };
  CatalogManager: undefined;
  CatalogEditor: { id: string | null };
};
