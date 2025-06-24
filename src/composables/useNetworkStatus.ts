import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setIsConnected(networkState.isConnected ?? true);
      } catch (error) {
        console.error('Error checking network status:', error);
        setIsConnected(false);
      }
    };

    checkNetworkStatus();

    const subscription = Network.addNetworkStateListener(({ isConnected: connected }) => {
      setIsConnected(connected ?? true);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return isConnected;
}; 