import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const { prompt } = await req.json();

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      // Ask for base64 explicitly so we always have something displayable
      response_format: "b64_json",
    });

    const first = result.data?.[0];

    // Some models / configs may return a hosted URL
    if (first?.url) {
      return NextResponse.json({ imageUrl: first.url });
    }

    // GPT Image often returns base64
    if (first?.b64_json) {
      const dataUrl = `data:image/png;base64,${first.b64_json}`;
      return NextResponse.json({ imageUrl: dataUrl });
    }

    return NextResponse.json(
      { error: "No image returned from API" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Image generation failed:", error);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}