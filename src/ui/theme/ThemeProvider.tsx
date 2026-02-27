import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AppTheme } from "./theme";
import { darkTheme, lightTheme } from "./theme";

type ThemeMode = "system" | "light" | "dark";

type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const STORAGE_KEY = "THEME_MODE";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // "light" | "dark" | null
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [ready, setReady] = useState(false);

  // carrega preferência salva
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "system" || saved === "light" || saved === "dark") {
          setModeState(saved);
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  const effectiveScheme = mode === "system" ? systemScheme : mode;
  const theme = useMemo(
    () => (effectiveScheme === "dark" ? darkTheme : lightTheme),
    [effectiveScheme],
  );

  const value = useMemo(() => ({ theme, mode, setMode }), [theme, mode]);

  if (!ready) return null; // ou Splash

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx; // { theme, mode, setMode }
}
