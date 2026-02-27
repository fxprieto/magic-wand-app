import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in Vercel environment variables." },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });

    // ✅ No response_format for gpt-image-1
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const first = result.data?.[0];

    // gpt-image-1 commonly returns base64
    if (first?.b64_json) {
      return NextResponse.json({
        imageUrl: `data:image/png;base64,${first.b64_json}`,
      });
    }

    // Fallback if URL is ever present
    if (first?.url) {
      return NextResponse.json({ imageUrl: first.url });
    }

    return NextResponse.json(
      { error: "No image returned from OpenAI." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Image generation failed:", error);
    return NextResponse.json(
      { error: error?.message || "Image generation failed" },
      { status: 500 }
    );
  }
}