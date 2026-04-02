import { NextResponse } from "next/server";
import { getPublishedNews } from "@/lib/news";

export async function GET() {
  try {
    const data = await getPublishedNews();
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("News fetch error:", e);
    return NextResponse.json([], { status: 500 });
  }
}
