import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { estimateCarbon } from '@/lib/carbonMapping';
import { updatePointsAndScore } from '@/lib/store';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
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
`;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
    }

    // Convert file to base64 for Gemini
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent([
      "Extract the items and quantities from this receipt.",
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type || "image/jpeg"
        }
      }
    ]);

    let rawContent = result.response.text().trim();
    if (rawContent.startsWith("```json")) rawContent = rawContent.slice(7, -3);
    else if (rawContent.startsWith("```")) rawContent = rawContent.slice(3, -3);

    const itemsData = JSON.parse(rawContent);
    let totalCarbon = 0;
    
    const parsedItems = itemsData.map((item: any) => {
      const co2 = estimateCarbon(item.name || "Unknown Item", item.quantity || 1.0);
      totalCarbon += co2;
      return {
        name: item.name || "Unknown Item",
        quantity: item.quantity || 1.0,
        co2: co2,
        alternative: item.alternative || ""
      };
    });

    // Gamification Logic: Award points based on scan and update stats
    // Let's give 50 points per receipt scanned
    const pointsAwarded = 50;
    updatePointsAndScore(pointsAwarded, totalCarbon);

    return NextResponse.json({
      items: parsedItems,
      total_carbon: Number(totalCarbon.toFixed(2)),
      points_awarded: pointsAwarded
    });

  } catch (error: any) {
    console.error("OCR Error:", error);
    return NextResponse.json({ error: "Failed to parse receipt" }, { status: 500 });
  }
}
