import React from 'react';
import { View, Text, Button, StyleSheet, Switch } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';

export const SettingsScreen = () => {
  const { user, signOut } = useAuthStore();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>设置</Text>

      {user && (
        <View style={styles.section}>
          <Text style={styles.label}>用户信息</Text>
          <Text style={styles.value}>{user.nickname || user.username}</Text>
          <Text style={styles.email}>{user.email || '未设置邮箱'}</Text>
        </View>
      )}

      <View style={[styles.section, styles.sectionBorder]}>
        <View style={styles.sectionItem}>
          <Text style={styles.sectionLabel}>当前用户</Text>
          <Text style={styles.sectionValue}>{user?.username || '未登录'}</Text>
        </View>
      </View>

      <Button
        title="退出登录"
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        disabled={!user}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2196f3',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
  },
  sectionBorder: {
    marginTop: 30,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    color: '#333',
  },
  sectionValue: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
  },
});
