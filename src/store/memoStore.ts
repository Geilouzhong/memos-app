import { create } from 'zustand';
import { memoApi, Memo, ListMemosRequest } from '../api/memos';

interface MemoState {
  memos: Memo[];
  loading: boolean;
  nextPageToken: string | null;
  loadMemos: (refresh?: boolean) => Promise<void>;
  createMemo: (content: string, visibility: string) => Promise<void>;
  updateMemo: (name: string, updates: Partial<Memo>) => Promise<void>;
  deleteMemo: (name: string) => Promise<void>;
}

export const useMemoStore = create<MemoState>((set) => ({
  memos: [],
  loading: false,
  nextPageToken: null,

  loadMemos: async (refresh = false) => {
    set({ loading: true });
    try {
      const params: ListMemosRequest = {
        page_size: 20,
        page_token: refresh ? undefined : useMemoStore.getState().nextPageToken
      };

      const response = await memoApi.listMemos(params);

      set({
        memos: refresh ? response.memos : [...useMemoStore.getState().memos, ...response.memos],
        nextPageToken: response.next_page_token || null,
        loading: false
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createMemo: async (content: string, visibility = 'PRIVATE') => {
    try {
      const newMemo = await memoApi.createMemo({
        content,
        visibility,
        row_status: 'NORMAL'
      });

      set(state => ({
        memos: [newMemo, ...state.memos]
      }));
    } catch (error) {
      throw error;
    }
  },

  updateMemo: async (name, updates) => {
    try {
      const updatedMemo = await memoApi.updateMemo(name, updates, ['content', 'visibility']);

      set(state => ({
        memos: state.memos.map(memo =>
          memo.name === name ? updatedMemo : memo
        )
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteMemo: async (name) => {
    try {
      await memoApi.deleteMemo(name);

      set(state => ({
        memos: state.memos.filter(memo => memo.name !== name)
      }));
    } catch (error) {
      throw error;
    }
  },
}));
