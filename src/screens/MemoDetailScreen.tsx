import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
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
        {!isEditing && (
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
            <Text style={styles.editBtnText}>编辑</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            multiline
            value={content}
            onChangeText={setContent}
            placeholder="输入内容..."
            textAlignVertical="top"
          />
        ) : (
          <Text style={styles.textContent}>{content}</Text>
        )}
      </ScrollView>

      {isEditing && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>保存</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
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
  editBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
  },
  editBtnText: {
    color: '#2196f3',
    fontSize: 14,
    fontWeight: '500',
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
  },
  textContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2196f3',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#b3d4f7',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  error: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginTop: 50,
  },
});
