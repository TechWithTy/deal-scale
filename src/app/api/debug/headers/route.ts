import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const headers = Object.fromEntries(req.headers);
  return NextResponse.json({ headers });
}
