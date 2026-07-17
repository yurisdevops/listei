# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Listei — an Expo/React Native shopping list app (Portuguese-BR UI). Manages shopping lists with budgets, a reusable product catalog, recurrence, spending stats, backup/restore, and light/dark theming. All persistence is local (AsyncStorage) — there is no backend.

## Commands

```bash
npm install          # install dependencies
npx expo start        # start Metro bundler, choose platform from the CLI menu
npm run android        # start and open on Android
npm run ios            # start and open on iOS
npm run web             # start and open in browser
```

There is no lint, typecheck, or test script configured in `package.json`. To typecheck manually, run `npx tsc --noEmit`. There is no test framework installed in this repo.

## Architecture

The app follows a domain/state/ui layering under `src/`:

- **`src/domain/`** — pure, framework-free logic: TypeScript models (`models/`), pure calculation functions (`services/*.ts` — `calc.ts`, `stats.ts`, `recurrence.ts`, `group.ts`, `recommendations.ts`, `timeseries.ts`, `backup.ts`, `export.ts`), and seed data (`seed/`). Nothing here imports React or Zustand — services take plain data in and return plain data out, which keeps them easy to reason about and reuse across screens.
- **`src/state/store/lists.store.ts`** — a single Zustand store (`useListsStore`) persisted to AsyncStorage (`persist` middleware, key `shopping-storage`) that holds all app data: `lists`, `items`, and `catalog`. This is the single source of truth; screens read via selectors (e.g. `useListsStore((s) => s.lists)`) and mutate only through the actions defined on the store (`createList`, `addItemToList`, `completeList`, etc.). Domain services are called from inside these actions to compute derived values (e.g. `computeListTotal` on `completeList`).
- **`src/app/`** — navigation and screens. `navigation/TabsNavigator.tsx` is the root bottom-tab navigator with four tabs (Lists, Catalog, Stats, Settings), each backed by its own native-stack navigator (`*StackNavigator.tsx`). Route param types are centralized in `navigation/types.ts` — extend `TabsParamList`/`*StackParamList` there when adding screens or params. `App.tsx` wraps everything in `ThemeProvider` and persists navigation state to AsyncStorage under `NAVIGATION_STATE`.
- **`src/ui/`** — presentational building blocks. `theme/theme.ts` defines `lightTheme`/`darkTheme` (colors, radius, spacing tokens); `theme/ThemeProvider.tsx` exposes `useTheme()` and persists the user's mode preference (`system`/`light`/`dark`) separately from the OS scheme. `components/` holds shared primitives (`AppText`, `AppButton`, `Card`, `Screen`, etc.); `modals/` holds bottom-sheet/dialog-style overlays (`BudgetModal`, `EditItemModal`, `ExportModal`, `ConfirmModal`, `RecurrenceModal`).
- **`src/utils/`** — small formatting helpers (`money.ts` for BRL currency formatting via `formatBRL`, `weight.ts`).

### Data model

- A `ShoppingList` (`domain/models/list.ts`) has an optional `budget`, and is "active" until it has a `completedAt`. Completed lists store a `finalTotal` snapshot.
- A `ListItem` is a **discriminated union** on `kind`: `"unit"` (`qty` × `unitPrice`) or `"weight"` (`weightKg` × `pricePerKg`). Always narrow on `item.kind` before accessing kind-specific fields.
- A `CatalogItem` (`domain/models/catalog.ts`) is the reusable product definition (name, category, pricing type) that `ListItem`s reference via `catalogItemId`; catalog items in use by any list cannot be deleted (`removeCatalogItem` returns `{ ok: false }` in that case).
- List recurrence (`weekly`/`biweekly`/`monthly`) is evaluated by `domain/services/recurrence.ts#shouldGenerate`, and materialized via the store's `generateRecurringList`, which clones items from the original list.

### Conventions worth knowing

- All UI-facing strings are in Portuguese (pt-BR); currency is formatted with `formatBRL`/`formatCentsBRL` from `src/utils/money.ts`, not `Intl`.
- IDs are generated with `nanoid/non-secure` (imported directly in the store), not `crypto.randomUUID`.
- Backup/restore round-trips the whole store (`lists`, `items`, `catalog`) as versioned JSON (`domain/services/backup.ts`); bump `BackupData.version` and handle migration in `parseBackup`/`restoreBackup` if the shape changes.
- Theme colors/spacing/radius should be pulled from `useTheme().theme` rather than hardcoded, so screens respect light/dark mode.
