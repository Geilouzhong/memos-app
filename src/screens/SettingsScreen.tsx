import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Switch, TextInput, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import { getServerUrl, setServerUrl } from '../api/client';
import { useNavigation } from '@react-navigation/native';

export const SettingsScreen = () => {
  const { user, signOut } = useAuthStore();
  const navigation = useNavigation();
  const [serverUrl, setServerUrlState] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    loadServerUrl();
  }, []);

  const loadServerUrl = async () => {
    const url = await getServerUrl();
    setServerUrlState(url);
  };

  const handleSaveUrl = async () => {
    if (!newUrl.trim()) {
      Alert.alert('提示', '请输入服务器地址');
      return;
    }
    if (!newUrl.trim().startsWith('http://') && !newUrl.trim().startsWith('https://')) {
      Alert.alert('提示', '地址需要以 http:// 或 https:// 开头');
      return;
    }
    try {
      await setServerUrl(newUrl.trim());
      setServerUrlState(newUrl.trim());
      setIsEditing(false);
      setNewUrl('');
      Alert.alert('成功', '服务器地址已更新');
    } catch (error) {
      Alert.alert('错误', '保存失败');
    }
  };

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

      {/* 服务器设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>服务器</Text>
        <View style={styles.sectionContent}>
          {!isEditing ? (
            <>
              <Text style={styles.value}>{serverUrl}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => { setNewUrl(serverUrl); setIsEditing(true); }}>
                <Text style={styles.editButtonText}>修改</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                value={newUrl}
                onChangeText={setNewUrl}
                placeholder="http://your-server:port"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              <View style={styles.editActions}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveUrl}>
                  <Text style={styles.saveButtonText}>保存</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      {/* 用户信息 */}
      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>用户信息</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.value}>{user.nickname || user.username}</Text>
            <Text style={styles.email}>{user.email || '未设置邮箱'}</Text>
          </View>
        </View>
      )}

      {/* 退出登录 */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={!user}
        >
          <Text style={styles.logoutButtonText}>退出登录</Text>
        </TouchableOpacity>
      </View>
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
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
    fontWeight: '500',
  },
  sectionContent: {
    flexDirection: 'column',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
  editButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
  },
  editButtonText: {
    color: '#2196f3',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#2196f3',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
  },
  logoutSection: {
    marginTop: 30,
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#ffcdd2',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '500',
  },
});
