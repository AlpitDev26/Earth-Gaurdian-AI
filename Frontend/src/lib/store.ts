// Simple in-memory store for Hackathon MVP purposes.
// In a real app, this would connect to Prisma/PostgreSQL or Supabase.

// Use globalThis to persist state across Next.js API route hot-reloads in development
const globalStore = globalThis as unknown as {
  __EARTH_GUARDIAN_STORE__: {
    totalPoints: number;
    currentCarbonScore: number;
    currentLevel: string;
  };
};

if (!globalStore.__EARTH_GUARDIAN_STORE__) {
  globalStore.__EARTH_GUARDIAN_STORE__ = {
    totalPoints: 120,
    currentCarbonScore: 85,
    currentLevel: "Seed",
  };
}

export const getUserStats = () => {
  return globalStore.__EARTH_GUARDIAN_STORE__;
};

export const updatePointsAndScore = (pointsToAdd: number, carbonEmitted: number) => {
  const store = globalStore.__EARTH_GUARDIAN_STORE__;
  
  store.totalPoints += pointsToAdd;
  
  // Very simple simulation:
  // If carbon emitted is low (under 5kg), health goes up slightly.
  // If carbon emitted is high, health drops.
  if (carbonEmitted > 5) {
    store.currentCarbonScore = Math.max(0, store.currentCarbonScore - 5);
  } else {
    store.currentCarbonScore = Math.min(100, store.currentCarbonScore + 2);
  }

  // Leveling up logic
  if (store.totalPoints > 500) {
    store.currentLevel = "Guardian";
  } else if (store.totalPoints > 200) {
    store.currentLevel = "Sprout";
  }

  return store;
};
