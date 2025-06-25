export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Primary colors
  primary: string;
  primaryVariant: string;
  
  // Secondary colors
  secondary: string;
  secondaryVariant: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  
  // Border and divider colors
  border: string;
  divider: string;
  
  // Overlay colors
  overlay: string;
  backdrop: string;
  
  // Card colors
  card: string;
  cardVariant: string;
}

export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
} 