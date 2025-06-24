import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OfflineMessageProps {
  visible: boolean;
}

export const OfflineMessage: React.FC<OfflineMessageProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="wifi-outline" size={20} color="#fff" />
      <Text style={styles.text}>Sem conexão com a internet</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#14171F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 