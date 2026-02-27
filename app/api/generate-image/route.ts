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

    const openai = new OpenAI({ apiKey });

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
    }

    // Ask for base64 explicitly so we always can display it
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const first = result.data?.[0];

    // If OpenAI returns a URL (sometimes happens), use it
    if (first?.url) {
      return NextResponse.json({ imageUrl: first.url });
    }

    // Common case for gpt-image-1: base64
    if (first?.b64_json) {
      return NextResponse.json({
        imageUrl: `data:image/png;base64,${first.b64_json}`,
      });
    }

    return NextResponse.json(
      { error: "No image returned from OpenAI." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Image generation failed:", error);

    // Return the actual message so we can diagnose quickly
    return NextResponse.json(
      {
        error:
          error?.message ||
          error?.error?.message ||
          "Image generation failed",
      },
      { status: 500 }
    );
  }
}