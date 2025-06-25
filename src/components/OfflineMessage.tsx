import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../composables';

interface OfflineMessageProps {
  visible: boolean;
}

const OfflineMessageComponent: React.FC<OfflineMessageProps> = ({ visible }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  if (!visible) return null;

  return (
    <View style={[
      styles.container, 
      { 
        top: insets.top,
        backgroundColor: theme.colors.error,
      }
    ]}>
      <Ionicons name="wifi-outline" size={20} color="#FFFFFF" />
      <Text style={styles.text}>Sem conexão com a internet</Text>
    </View>
  );
};

export const OfflineMessage = memo(OfflineMessageComponent);

const styles = StyleSheet.create({
  container: {
    position: 'static',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    paddingVertical: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});