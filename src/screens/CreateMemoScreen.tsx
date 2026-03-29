import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMemoStore } from '../store/memoStore';

export const CreateMemoScreen = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('PRIVATE');
  const [isLoading, setIsLoading] = useState(false);

  const { createMemo } = useMemoStore();

  const handleSubmit = async () => {
    if (!content.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await createMemo(content, visibility);
      navigation.goBack();
    } catch (error) {
      console.error('创建失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>创建 Memo</Text>

      <TextInput
        style={styles.textArea}
        multiline
        placeholder="输入 Memo 内容..."
        value={content}
        onChangeText={setContent}
        textAlignVertical="top"
      />

      <Text style={styles.label}>可见性：</Text>
      
      <View style={styles.visibilityContainer}>
        <View style={[styles.visibilityOption, visibility === 'PRIVATE' && styles.activeOption]}>
          <Text
            style={[styles.visibilityText, visibility === 'PRIVATE' && styles.activeText]}
            onPress={() => setVisibility('PRIVATE')}
          >
            仅自己
          </Text>
        </View>
        
        <View style={[styles.visibilityOption, visibility === 'PROTECTED' && styles.activeOption]}>
          <Text
            style={[styles.visibilityText, visibility === 'PROTECTED' && styles.activeText]}
            onPress={() => setVisibility('PROTECTED')}
          >
            登录用户
          </Text>
        </View>
        
        <View style={[styles.visibilityOption, visibility === 'PUBLIC' && styles.activeOption]}>
          <Text
            style={[styles.visibilityText, visibility === 'PUBLIC' && styles.activeText]}
            onPress={() => setVisibility('PUBLIC')}
          >
            所有人
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, (isLoading || !content.trim()) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading || !content.trim()}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? '创建中...' : '创建'}
        </Text>
      </TouchableOpacity>
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    height: 200,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  visibilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  visibilityOption: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  activeOption: {
    backgroundColor: '#2196f3',
  },
  visibilityText: {
    fontSize: 14,
    color: '#333',
  },
  activeText: {
    color: '#fff',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#2196f3',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#b3d4f7',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
