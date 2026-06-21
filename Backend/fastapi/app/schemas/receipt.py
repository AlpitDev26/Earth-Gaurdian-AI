from pydantic import BaseModel
from typing import List

class ReceiptItem(BaseModel):
    name: str
    quantity: float
    co2: float

class ReceiptResponse(BaseModel):
    items: List[ReceiptItem]
    total_carbon: float
