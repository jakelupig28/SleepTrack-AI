export const calculateSleepScore = (log) => {
  let baseScore = 100;
  
  if (log.habits.caffeineLate) baseScore -= 10;
  if (log.habits.screenTimeLate) baseScore -= 10;
  
  baseScore -= (log.habits.stressLevel * 2);
  
  const durationDiff = Math.abs(log.sleepMetrics.durationHours - 8);
  if (durationDiff > 0.5) {
      baseScore -= (durationDiff * 5);
  }

  const combinedScore = (baseScore + log.sleepMetrics.qualityScore) / 2;
  
  return Math.max(0, Math.min(100, Math.round(combinedScore)));
};

export const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return 'Good Morning';
  if (hours < 18) return 'Good Afternoon';
  return 'Good Evening';
};