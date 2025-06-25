import { ThemeColors, Theme } from '../types/theme';

export const lightColors: ThemeColors = {
  // Background colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceVariant: '#F1F3F4',
  
  // Text colors
  text: '#1A1A1A',
  textSecondary: '#5F6368',
  textTertiary: '#9AA0A6',
  
  // Primary colors
  primary: '#007AFF',
  primaryVariant: '#0056CC',
  
  // Secondary colors
  secondary: '#FF6B35',
  secondaryVariant: '#E55A2B',
  
  // Status colors
  success: '#34A853',
  warning: '#FBBC04',
  error: '#EA4335',
  
  // Border and divider colors
  border: '#E8EAED',
  divider: '#DADCE0',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.1)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
  
  // Card colors
  card: '#FFFFFF',
  cardVariant: '#F8F9FA',
};

export const darkColors: ThemeColors = {
  // Background colors
  background: '#14171F',
  surface: '#1E2128',
  surfaceVariant: '#2D2D35',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  
  // Primary colors
  primary: '#007AFF',
  primaryVariant: '#5AC8FA',
  
  // Secondary colors
  secondary: '#FF6B35',
  secondaryVariant: '#FF8A65',
  
  // Status colors
  success: '#34A853',
  warning: '#FBBC04',
  error: '#EA4335',
  
  // Border and divider colors
  border: '#3C4043',
  divider: '#5F6368',
  
  // Overlay colors
  overlay: 'rgba(255, 255, 255, 0.1)',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  
  // Card colors
  card: '#1E2128',
  cardVariant: '#2D2D35',
};

export const createTheme = (isDark: boolean): Theme => ({
  colors: isDark ? darkColors : lightColors,
  isDark,
}); 