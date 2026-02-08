import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Warm up the health endpoint on every request (fire and forget)
  fetch(`${request.nextUrl.origin}/api/health`, {
    method: 'HEAD',
  }).catch(() => {})

  return NextResponse.next()
}

export const config = {
  // Run on all routes except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
