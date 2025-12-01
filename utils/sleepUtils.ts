import { DailyLog } from '../types';

/**
 * Calculates a mock sleep score based on habits and reported quality.
 * This is a frontend-only simulation to test the UI.
 */
export const calculateSleepScore = (log: DailyLog): number => {
  let baseScore = 100;
  
  // Penalize for bad habits
  if (log.habits.caffeineLate) baseScore -= 10;
  if (log.habits.screenTimeLate) baseScore -= 10;
  
  // Penalize for stress (max 20 points)
  baseScore -= (log.habits.stressLevel * 2);
  
  // Penalize for duration deviation (assuming 8 hours is ideal)
  const durationDiff = Math.abs(log.sleepMetrics.durationHours - 8);
  if (durationDiff > 0.5) {
      baseScore -= (durationDiff * 5);
  }

  // Weight against the manually reported quality score (50/50 split)
  // Ensure we don't return negative numbers or above 100
  const combinedScore = (baseScore + log.sleepMetrics.qualityScore) / 2;
  
  return Math.max(0, Math.min(100, Math.round(combinedScore)));
};

export const getGreeting = (): string => {
  const hours = new Date().getHours();
  if (hours < 12) return 'Good Morning';
  if (hours < 18) return 'Good Afternoon';
  return 'Good Evening';
};