import { create } from "zustand";

interface Theme {
  type: string;
  color: string;
}

const DarkTheme: Theme = {
  type: 'dark',
  color: '#111'
};

interface ThemeStore {
  theme: Theme;
}

export const useThemeStore = create<ThemeStore>(() => ({
  theme: DarkTheme,
}));