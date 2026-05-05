export interface ForumComment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  stats: {
    likes: number;
  };
  replies?: ForumComment[];
  createdAt: string;
}

export interface ForumPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: 'Expert' | 'User' | 'Staff';
  };
  category: 'Investigación' | 'Papers' | 'Debate' | 'Anuncio';
  title: string;
  content: string;
  images?: string[];
  stats: {
    likes: number;
    views: number;
  };
  comments: ForumComment[];
  createdAt: string;
  isNSFW?: boolean;
}

export type ForumCategory = 'Investigación' | 'Papers' | 'Debate' | 'Anuncio' | 'Todo' | 'Perfil';
