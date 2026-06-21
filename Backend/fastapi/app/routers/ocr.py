from fastapi import APIRouter, UploadFile, File, HTTPException
import logging
from app.schemas.receipt import ReceiptResponse
from app.services.vision_service import process_receipt_image

router = APIRouter(tags=["OCR"])
logger = logging.getLogger("api")

@router.get("/test")
async def test():
    return {"message": "OCR Router Working"}

@router.post("/scan-receipt", response_model=ReceiptResponse)
async def scan_receipt_endpoint(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
        
    try:
        contents = await file.read()
        logger.info(f"Processing receipt image: {file.filename}")
        
        result = process_receipt_image(contents)
        return result
        
    except Exception as e:
        logger.error(f"Error processing receipt: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process receipt via AI.")
