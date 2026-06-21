import json
import logging
import google.generativeai as genai
from app.core.config import settings
from app.schemas.receipt import ReceiptResponse, ReceiptItem
from app.services.carbon_mapping import estimate_carbon

logger = logging.getLogger("api")

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

SYSTEM_PROMPT = """
You are an AI tasked with extracting line items from a receipt image.
Return ONLY a valid JSON array of objects. Do not include markdown formatting or extra text.
Each object must have exactly three keys: "name" (string), "quantity" (float), and "alternative" (string).
For "alternative", if the item has a high carbon footprint (like meat, dairy, or plastics), provide a very short 2-5 word eco-friendly alternative (e.g. "Try Plant-Based Mince"). If it's already low-carbon, leave it as an empty string "".
Example:
[
  {"name": "Organic Milk 1L", "quantity": 1.0, "alternative": "Try Oat Milk"},
  {"name": "Beef Steak 500g", "quantity": 1.0, "alternative": "Try Lentils or Tofu"},
  {"name": "Apples", "quantity": 1.0, "alternative": ""}
]
"""

def process_receipt_image(image_bytes: bytes) -> ReceiptResponse:
    try:
        # Use gemini-flash-latest for lightning-fast multimodal OCR processing
        model = genai.GenerativeModel('gemini-flash-latest', system_instruction=SYSTEM_PROMPT)
        
        image_parts = [
            {
                "mime_type": "image/jpeg",
                "data": image_bytes
            }
        ]
        
        prompt = "Extract the items and quantities from this receipt."
        
        response = model.generate_content([prompt, image_parts[0]])
        raw_content = response.text.strip()
        
        # Clean potential markdown
        if raw_content.startswith("```json"):
            raw_content = raw_content[7:-3]
        elif raw_content.startswith("```"):
            raw_content = raw_content[3:-3]
            
        items_data = json.loads(raw_content)
        
        parsed_items = []
        total_carbon = 0.0
        
        for item in items_data:
            name = item.get("name", "Unknown Item")
            qty = item.get("quantity", 1.0)
            alt = item.get("alternative", "")
            co2 = estimate_carbon(name, qty)
            
            parsed_items.append(ReceiptItem(name=name, quantity=qty, co2=co2, alternative=alt))
            total_carbon += co2
            
        return ReceiptResponse(
            items=parsed_items,
            total_carbon=round(total_carbon, 2)
        )
        
    except Exception as e:
        logger.error(f"Gemini API Error: {str(e)}")
        raise e
