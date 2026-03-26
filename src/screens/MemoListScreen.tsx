import React, { useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { useMemos } from '../hooks/useMemos';
import { useNavigation } from '@react-navigation/native';
import { useMemoStore } from '../store/memoStore';
import { Memo } from '../types/api';

export const MemoListScreen = ({ navigation }) => {
  const { memos, loading, loadMemos } = useMemos();
  const { deleteMemo } = useMemoStore();

  const loadMore = () => {
    if (!loading) {
      loadMemos(false);
    }
  };

  const handleDelete = async (memo: Memo) => {
    try {
      await deleteMemo(memo.name);
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const renderMemoItem = ({ item }: { item: Memo }) => {
    const getVisibilityColor = () => {
      switch (item.visibility) {
        case 'PRIVATE': return '#4caf50';
        case 'PROTECTED': return '#2196f3';
        case 'PUBLIC': return '#ff9800';
        default: return '#9e9e9e';
      }
    };

    return (
      <TouchableOpacity
        style={styles.memoItem}
        onPress={() => navigation.navigate('MemoDetail', { memoId: item.name })}
        activeOpacity={0.7}
      >
        <View style={styles.memoHeader}>
          <Text style={[styles.visibilityTag, { backgroundColor: getVisibilityColor() }]}>
            {item.visibility}
          </Text>
          {item.pinned && <Text style={styles.pinnedIcon}>📌</Text>}
        </View>

        <Text style={styles.memoContent}>{item.content}</Text>

        <View style={styles.memoFooter}>
          <Text style={styles.date}>
            {new Date(item.create_time).toLocaleString('zh-CN')}
          </Text>
          <TouchableOpacity onPress={() => handleDelete(item)}>
            <Text style={styles.deleteBtn}>删除</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={memos}
        renderItem={renderMemoItem}
        keyExtractor={item => item.name}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => loadMemos(true)} />
        }
        ListFooterComponent={() => loading && <ActivityIndicator style={styles.loading} size="large" />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 10,
  },
  memoItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  memoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  visibilityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pinnedIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  memoContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
  },
  memoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  deleteBtn: {
    color: '#f44336',
    fontSize: 14,
  },
  loading: {
    padding: 20,
  },
});
