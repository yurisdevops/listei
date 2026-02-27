export type AppTheme = {
  dark: boolean;
  colors: {
    bg: string;
    card: string;
    text: string;
    mutedText: string;
    border: string;

    primary: string;
    onPrimary: string;

    danger: string;
    onDanger: string;

    success: string;
    onSuccess: string;

    chipBg: string;
    overlay: string;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    pill: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
};

export const lightTheme: AppTheme = {
  dark: false,
  colors: {
    bg: "#e9e6e6",
    card: "#FFFFFF",
    text: "#111111",
    mutedText: "#666666",
    border: "#D9D9D9",

    primary: "#2e7d32",
    onPrimary: "#FFFFFF",

    danger: "#c62828",
    onDanger: "#FFFFFF",

    success: "#2e7d32",
    onSuccess: "#FFFFFF",

    chipBg: "#e8f5e9",
    overlay: "rgba(0,0,0,0.45)",
  },
  radius: { sm: 10, md: 12, lg: 14, pill: 999 },
  spacing: { xs: 6, sm: 10, md: 16, lg: 20, xl: 28 },
};

export const darkTheme: AppTheme = {
  dark: true,
  colors: {
    bg: "#0B0F14",
    card: "#121A24",
    text: "#F3F5F7",
    mutedText: "#A7B0BB",
    border: "#263241",

    primary: "#44c464",
    onPrimary: "#08120A",

    danger: "#ff5c5c",
    onDanger: "#2A0606",

    success: "#44c464",
    onSuccess: "#08120A",

    chipBg: "#1B2B20",
    overlay: "rgba(0,0,0,0.55)",
  },
  radius: { sm: 10, md: 12, lg: 14, pill: 999 },
  spacing: { xs: 6, sm: 10, md: 16, lg: 20, xl: 28 },
};
