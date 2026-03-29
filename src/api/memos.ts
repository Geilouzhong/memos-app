import { getApiClient } from './client';

export interface User {
  name: string;
  username: string;
  email: string;
  nickname: string;
  avatar_url: string;
  create_time: string;
  update_time: string;
}

export interface Memo {
  name: string;
  uid: string;
  row_status: string;
  creator: string;
  create_time: string;
  update_time: string;
  content: string;
  visibility: string;
  pinned: boolean;
  resources: Resource[];
  relation_list: Memo[];
  tags: string[];
}

export interface Resource {
  id: string;
  creator: string;
  create_time: string;
  filename: string;
  type: string;
  size: number;
  payload: string;
}

export interface SignInRequest {
  password_credentials: {
    username: string;
    password: string;
  };
}

export interface SignInResponse {
  user: User;
  access_token: string;
  expires_at: string;
}

export interface ListMemosRequest {
  page_size?: number;
  page_token?: number;
  visibility?: string;
  content?: string;
}

export interface ListMemosResponse {
  memos: Memo[];
  next_page_token?: string;
}

export const authApi = {
  signIn: async (username: string, password: string) => {
    const client = await getApiClient();
    const response = await client.post<SignInResponse>('/api/v1/auth/signin', {
      password_credentials: { username, password }
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const client = await getApiClient();
    const response = await client.get<User>('/api/v1/auth/me');
    return response.data;
  },

  signOut: async () => {
    const client = await getApiClient();
    await client.post('/api/v1/auth/signout');
  },
};

export const memoApi = {
  listMemos: async (params: ListMemosRequest = {}) => {
    const client = await getApiClient();
    const response = await client.get<ListMemosResponse>('/api/v1/memos', { params });
    return response.data;
  },

  getMemo: async (name: string) => {
    const client = await getApiClient();
    const response = await client.get<Memo>(`/api/v1/memos/${name}`);
    return response.data;
  },

  createMemo: async (memo: Partial<Memo>) => {
    const client = await getApiClient();
    const response = await client.post<Memo>('/api/v1/memos', { memo });
    return response.data;
  },

  updateMemo: async (name: string, memo: Partial<Memo>, updateMask: string[]) => {
    const client = await getApiClient();
    const response = await client.patch<Memo>(`/api/v1/memos/${name}`, {
      memo,
      update_mask: { paths: updateMask }
    });
    return response.data;
  },

  deleteMemo: async (name: string) => {
    const client = await getApiClient();
    await client.delete(`/api/v1/memos/${name}`);
  },

  createComment: async (name: string, content: string) => {
    const client = await getApiClient();
    const response = await client.post<Memo>(`/api/v1/memos/${name}/comments`, {
      comment: { content }
    });
    return response.data;
  },
};
