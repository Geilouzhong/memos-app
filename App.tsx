/**
 * MemosApp - A simple memo application
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@memos_app_data';

interface Memo {
  id: string;
  text: string;
  createdAt: number;
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemo, setNewMemo] = useState('');

  // Load memos from AsyncStorage
  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    try {
      const savedMemos = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedMemos) {
        setMemos(JSON.parse(savedMemos));
      }
    } catch (error) {
      console.error('Error loading memos:', error);
    }
  };

  const saveMemos = async (updatedMemos: Memo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemos));
      setMemos(updatedMemos);
    } catch (error) {
      console.error('Error saving memos:', error);
      Alert.alert('错误', '保存备忘录失败');
    }
  };

  const addMemo = () => {
    if (newMemo.trim().length === 0) {
      Alert.alert('提示', '请输入备忘录内容');
      return;
    }

    const memo: Memo = {
      id: Date.now().toString(),
      text: newMemo.trim(),
      createdAt: Date.now(),
    };

    saveMemos([...memos, memo]);
    setNewMemo('');
  };

  const deleteMemo = (id: string) => {
    Alert.alert('确认删除', '确定要删除这条备忘录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => saveMemos(memos.filter((memo) => memo.id !== id)),
      },
    ]);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMemo = ({ item }: { item: Memo }) => (
    <View style={[styles.memoItem, isDarkMode && styles.memoItemDark]}>
      <View style={styles.memoContent}>
        <Text style={[styles.memoText, isDarkMode && styles.textDark]}>
          {item.text}
        </Text>
        <Text style={[styles.memoDate, isDarkMode && styles.textDark]}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteMemo(item.id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.textDark]}>
          📝 备忘录
        </Text>

        <View style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            value={newMemo}
            onChangeText={setNewMemo}
            placeholder="添加新备忘录..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity style={styles.addButton} onPress={addMemo}>
            <Text style={styles.addButtonText}>添加</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={memos.sort((a, b) => b.createdAt - a.createdAt)}
          renderItem={renderMemo}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, isDarkMode && styles.textDark]}>
                还没有备忘录，添加一条吧！
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  textDark: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainerDark: {
    backgroundColor: '#1e1e1e',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 80,
  },
  inputDark: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  memoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  memoItemDark: {
    backgroundColor: '#1e1e1e',
  },
  memoContent: {
    flex: 1,
  },
  memoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  memoDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default App;
