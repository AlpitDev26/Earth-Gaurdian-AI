import logging

logger = logging.getLogger("api")

# Hardcoded emission factors for MVP (kg CO2 per unit)
EMISSION_FACTORS = {
    "beef": 27.0,
    "chicken": 6.9,
    "pork": 12.1,
    "milk": 3.2,
    "cheese": 13.5,
    "eggs": 4.8,
    "rice": 4.0,
    "vegetables": 2.0,
    "fruit": 1.1,
    "bread": 1.4,
    "coffee": 17.0,
    "generic": 2.5
}

def estimate_carbon(item_name: str, quantity: float) -> float:
    """Estimates carbon footprint based on item name matching."""
    name_lower = item_name.lower()
    
    # Simple keyword matching for MVP
    matched_factor = EMISSION_FACTORS["generic"]
    for key, factor in EMISSION_FACTORS.items():
        if key in name_lower:
            matched_factor = factor
            break
            
    impact = matched_factor * quantity
    logger.debug(f"Calculated {impact}kg CO2 for {quantity}x {item_name} (factor: {matched_factor})")
    return round(impact, 2)
