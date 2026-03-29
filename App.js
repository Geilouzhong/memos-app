import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ServerSetupScreen } from './src/screens/ServerSetupScreen';
import { createApiClient, isServerConfigured } from './src/api/client';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const configured = await isServerConfigured();
      if (!configured) {
        setShowSetup(true);
      } else {
        await createApiClient();
      }
    } catch (error) {
      console.error('App init error:', error);
      setShowSetup(true);
    } finally {
      setIsReady(true);
    }
  };

  const handleSetupComplete = async () => {
    await createApiClient();
    setShowSetup(false);
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
      </View>
    );
  }

  if (showSetup) {
    return <ServerSetupScreen onComplete={handleSetupComplete} />;
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
