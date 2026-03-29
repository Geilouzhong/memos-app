import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setServerUrl } from '../api/client';

interface ServerSetupProps {
  onComplete: () => void;
}

export const ServerSetupScreen: React.FC<ServerSetupProps> = ({ onComplete }) => {
  const [serverUrl, setServerUrlState] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // 加载已保存的配置
    AsyncStorage.getItem('server_url').then((url) => {
      if (url) {
        setServerUrlState(url);
      }
    });
  }, []);

  const handleSave = async () => {
    if (!serverUrl.trim()) {
      Alert.alert('提示', '请输入服务器地址');
      return;
    }

    // 简单验证格式
    const url = serverUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      Alert.alert('提示', '地址需要以 http:// 或 https:// 开头');
      return;
    }

    try {
      await setServerUrl(url);
      setSaved(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (error) {
      Alert.alert('错误', '保存服务器地址失败');
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🌐</Text>
      <Text style={styles.title}>连接服务器</Text>
      <Text style={styles.subtitle}>
        请输入 Memos 服务器的地址，例如：
      </Text>
      <Text style={styles.example}>http://192.168.1.100:8081</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>服务器地址</Text>
        <TextInput
          style={styles.input}
          placeholder="http://your-server:port"
          value={serverUrl}
          onChangeText={setServerUrlState}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          placeholderTextColor="#aaa"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, saved && styles.buttonSaved]}
        onPress={handleSave}
        disabled={saved}
      >
        <Text style={styles.buttonText}>
          {saved ? '✓ 已保存' : '保存并继续'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>稍后设置</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 22,
  },
  example: {
    fontSize: 13,
    color: '#999',
    marginBottom: 30,
    fontFamily: 'monospace',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2196f3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonSaved: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#999',
    fontSize: 14,
  },
});
