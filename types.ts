export interface SleepMetrics {
  durationHours: number;
  qualityScore: number; // 0-100
}

export interface Habits {
  caffeineLate: boolean;
  screenTimeLate: boolean;
  alcoholLate: boolean; // New field
  stressLevel: number; // 1-10
}

export interface DailyLog {
  date: string; // ISO format
  sleepMetrics: SleepMetrics;
  habits: Habits;
  energyRating?: number; // 1-5 (Emoji selection)
  userNotes?: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  birthdate?: string;
}