export type ReactionType = 'like' | 'love' | 'delicious' | 'wow';

export interface Reaction {
  type: ReactionType;
  count: number;
  userReacted: boolean;
}

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  title: string;
  description: string;
  images: string[];
  tags: string[];
  ingredients?: string[];
  instructions?: string[];
  createdAt: string;
  reactions: Reaction[];
}

export interface CreatePostData {
  title: string;
  description: string;
  images: string[];
  tags: string[];
  ingredients?: string[];
  instructions?: string[];
}
