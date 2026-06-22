import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API using the environment variable
// Next.js automatically loads .env.local variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { reply: "Backend error: GEMINI_API_KEY is missing from environment variables." },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are Earth Guardian AI. You are a conversational eco-friendly assistant. Give users short, highly practical tips on reducing their carbon footprint. Never answer questions unrelated to sustainability. Keep your answers brief (under 4 sentences)."
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText.trim() });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { reply: "I'm having trouble connecting to my neural network right now. Please try again later." },
      { status: 500 }
    );
  }
}
