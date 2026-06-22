const CARBON_DB: Record<string, number> = {
  "organic milk": 0.9,
  "beef steak": 13.5,
  "white rice": 4.0,
  "apples": 0.3,
  "tomatoes": 0.4,
  "chicken breast": 3.2,
  "eggs": 2.1,
  "oat milk": 0.9,
  "beef": 13.5,
  "chicken": 3.2,
  "milk": 1.2
};

export function estimateCarbon(itemName: string, quantity: number): number {
  const nameLower = itemName.toLowerCase();
  
  let matchedFactor = 2.5; // default generic factor
  
  // Simple substring matcher
  for (const [key, value] of Object.entries(CARBON_DB)) {
    if (nameLower.includes(key)) {
      matchedFactor = value;
      break;
    }
  }
  
  return Number((matchedFactor * quantity).toFixed(2));
}
