from pydantic import BaseModel
from typing import List, Optional

class ReceiptItem(BaseModel):
    name: str
    quantity: float
    co2: float
    alternative: Optional[str] = None

class ReceiptResponse(BaseModel):
    items: List[ReceiptItem]
    total_carbon: float
