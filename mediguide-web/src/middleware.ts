import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: In a full app, we would verify a cookie/session. For demo, allow client routing.
export function middleware(_request: NextRequest) {
	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard', '/digilocker/:path*', '/doctors/:path*', '/assistant', '/nutrition', '/hospitals', '/sos', '/schemes'],
};