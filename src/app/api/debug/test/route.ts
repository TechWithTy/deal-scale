import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    time: new Date().toISOString(),
    env: {
      NOTION_KEY: !!process.env.NOTION_KEY,
      NOTION_WEBHOOK_SECRET: !!process.env.NOTION_WEBHOOK_SECRET,
      UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    },
  });
}
