import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OfflineMessageProps {
  visible: boolean;
}

export const OfflineMessage: React.FC<OfflineMessageProps> = ({ visible }) => {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View style={[styles.container, { top: insets.top }]}>
      <Ionicons name="wifi-outline" size={20} color="#fff" />
      <Text style={styles.text}>Sem conexão com a internet</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'static',
    backgroundColor: '#14171F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});