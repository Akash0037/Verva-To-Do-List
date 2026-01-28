
export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type FilterType = 'today' | 'upcoming' | 'completed' | 'all';
