export interface ProfileActivity {
  id: string;
  type: 'purchase' | 'post' | 'event' | 'token_earn';
  title: string;
  date: string;
  amount?: string;
  description?: string;
}

export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  newsletter: boolean;
}

export interface UserProfileData {
  username: string;
  tokens: number;
  joinDate: string;
  rank: string;
  avatar?: string;
  stats: {
    posts: number;
    purchases: number;
    events: number;
  };
}
