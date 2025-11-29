// app/robots.txt/route.ts
import { NextResponse } from 'next/server';
import { robotsTxt } from './robots';

export async function GET() {
  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      // Cache 1h en navigateur/robots
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
