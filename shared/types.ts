export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only used for creation, never sent to client
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// Ritual App Types
export type HabitFrequency =
  | { type: 'daily' }
  | { type: 'weekly_days'; days: number[] } // 0=Sun, 1=Mon, ...
  | { type: 'weekly_target'; count: number }
  | { type: 'monthly_target'; count: number };
export interface HabitLog {
  date: string; // YYYY-MM-DD
  value: number;
}
export interface Goal {
  target: number;
  unit: string;
  timeframe: 'weekly' | 'monthly';
}
export interface Habit {
  id: string;
  userId: string;
  name: string;
  color: string;
  frequency: HabitFrequency;
  logs: HabitLog[];
  goal?: Goal;
  createdAt: number; // epoch millis
}
export interface UserStats {
  userId: string;
  currentStreak: number;
  totalCompletions: number;
  completionRate: number; // 0-1
}