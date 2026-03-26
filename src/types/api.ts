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
