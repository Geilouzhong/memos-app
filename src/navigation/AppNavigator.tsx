import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '../components/Icon';

import { LoginScreen } from '../screens/LoginScreen';
import { MemoListScreen } from '../screens/MemoListScreen';
import { MemoDetailScreen } from '../screens/MemoDetailScreen';
import { CreateMemoScreen } from '../screens/CreateMemoScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MemoStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MemoList" component={MemoListScreen} options={{ title: 'Memos' }} />
    <Stack.Screen name="MemoDetail" component={MemoDetailScreen} options={{ title: 'Detail' }} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#2196f3',
      tabBarInactiveTintColor: '#9ca3af',
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Memos"
      component={MemoStack}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="note" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Create"
      component={CreateMemoScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="add-circle" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="settings" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AppTabs" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
