// src/app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';

// This is the GET handler for the WhatsApp webhook verification.
// Meta sends a GET request to verify the webhook.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get('hub.mode');
  const token = params.get('hub.verify_token');
  const challenge = params.get('hub.challenge');

  // Verify that the request is from Meta and that the token is correct.
  // Replace 'YOUR_VERIFY_TOKEN' with a secret token you've set in the Meta Developer Dashboard.
  if (mode === 'subscribe' && token === 'YOUR_VERIFY_TOKEN') {
    return new NextResponse(challenge, { status: 200 });
  } else {
    // If verification fails, return a 403 Forbidden status.
    return new NextResponse('Verification failed', { status: 403 });
  }
}