import React from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAuth } from './src/hooks/useAuth';

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <AppNavigator />
    </>
  );
}
