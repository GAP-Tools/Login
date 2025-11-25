export interface User {
  id: string;
  email: string;
  name: string;
  interests: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export enum InsightType {
  MOTIVATION = 'Motivation',
  PRODUCTIVITY = 'Productivity',
  LEARNING = 'Learning'
}

export interface InsightResponse {
  message: string;
  author?: string;
}
