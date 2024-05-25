export type TUser = {
  id: string;
  apelido: string;
  email: string;
  password: string;
};

export type TPost = {
  id: string;
  creator_id: string;
  name: string;
  content: string;
  dislikes: number;
  likes: number;
  // created_at: new Date().toISOString()
};
