import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../composables';
import { useThemeMode } from '../composables';

export const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const { toggleTheme } = useThemeMode();

  return (
    <TouchableOpacity
      style={[
        styles.toggleButton,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        }
      ]}
      onPress={toggleTheme}
    >
      <Ionicons 
        name={theme.isDark ? 'sunny' : 'moon'} 
        size={20} 
        color={theme.colors.text} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
}); 