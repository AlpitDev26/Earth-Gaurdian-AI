import logging
import difflib

logger = logging.getLogger("api")

# Hardcoded emission factors for MVP (kg CO2 per unit)
CARBON_DB = {
    "organic milk": 0.9,
    "beef steak": 13.5,
    "white rice": 4.0,
    "apples": 0.3,
    "tomatoes": 0.4,
    "chicken breast": 3.2,
    "eggs": 2.1,
    "oat milk": 0.9
}

def estimate_carbon(item_name: str, quantity: float) -> float:
    """Estimates carbon footprint based on item name matching."""
    name_lower = item_name.lower()
    
    # Fuzzy match logic
    matches = difflib.get_close_matches(name_lower, CARBON_DB.keys(), n=1, cutoff=0.5)
    
    matched_factor = 2.5 # default generic factor
    if matches:
        matched_factor = CARBON_DB[matches[0]]
        
    impact = matched_factor * quantity
    logger.debug(f"Calculated {impact}kg CO2 for {quantity}x {item_name} (factor: {matched_factor})")
    return round(impact, 2)
