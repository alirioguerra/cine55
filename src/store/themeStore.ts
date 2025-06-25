import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      
      toggleTheme: () => {
        const { isDark } = get();
        set({ isDark: !isDark });
      },
      
      setTheme: (isDark: boolean) => {
        set({ isDark });
      },
    }),
    {
      name: 'cine55-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isDark: state.isDark }),
    }
  )
); 