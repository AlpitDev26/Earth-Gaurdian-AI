from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Earth Guardian AI Service",
    description="Microservice for Receipt OCR and Climate AI capabilities."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "AI Service is running", "service": "Earth Guardian OCR Engine"}

@app.post("/scan-receipt")
def scan_receipt():
    # To be implemented: Send image to OpenAI Vision API
    return {"status": "pending implementation"}
