import { useEffect } from 'react';
import { useMemoStore } from '../store/memoStore';

export const useMemos = (autoLoad = true) => {
  const { memos, loading, loadMemos } = useMemoStore();

  useEffect(() => {
    if (autoLoad) {
      loadMemos();
    }
  }, [autoLoad]);

  return { memos, loading, loadMemos };
};
