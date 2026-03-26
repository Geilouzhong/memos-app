import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useMemoStore } from '../store/memoStore';

export const MemoDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { memoName } = route.params as { memoName: string };

  const { memos, updateMemo } = useMemoStore();
  const memo = memos.find(m => m.name === memoName);

  const [content, setContent] = useState(memo?.content || '');
  const [visibility, setVisibility] = useState(memo?.visibility || 'PRIVATE');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!memo) return;

    setIsLoading(true);
    try {
      await updateMemo(memo.name, {
        content,
        visibility,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!memo) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>未找到 Memo</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{isEditing ? '编辑 Memo' : 'Memo 详情'}</Text>
        <Button
          title={isEditing ? '保存' : '编辑'}
          mode="contained"
          onPress={() => setIsEditing(true)}
        />
      </View>

      <ScrollView style={styles.content}>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            multiline
            value={content}
            onChangeText={setContent}
            placeholder="输入内容..."
            style={styles.textInput}
          />
        ) : (
          <Text style={styles.textContent}>{content}</Text>
        )}
      </ScrollView>

      {isEditing && (
        <View style={styles.footer}>
          <Button
            title={isLoading ? '保存中...' : '保存'}
            mode="contained"
            onPress={handleSave}
            disabled={isLoading}
            style={styles.saveButton}
          />
          <Button
            title="取消"
            onPress={() => setIsEditing(false)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  textContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    flex: 1,
    marginRight: 10,
  },
  error: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginTop: 50,
  },
});
