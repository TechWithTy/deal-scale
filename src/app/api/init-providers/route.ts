import { NextResponse } from 'next/server';

export async function GET() {
  // Server-side: Use env vars here (not exposed to client)
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const zohoCode = process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE;

  if (!clarityId && !zohoCode) {
    return NextResponse.json({ error: 'No providers configured' }, { status: 200 });
  }

  // Return config for client to use (IDs not exposed in bundle)
  return NextResponse.json({
    clarityId,
    zohoCode,
  });
}
