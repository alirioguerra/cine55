import { useThemeStore } from '../store/themeStore';
import { createTheme } from '../utils/theme';

export const useTheme = () => {
  const { isDark } = useThemeStore();
  return createTheme(isDark);
};

export const useThemeMode = () => {
  const { isDark, toggleTheme, setTheme } = useThemeStore();
  return { isDark, toggleTheme, setTheme };
}; 