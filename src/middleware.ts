import { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    try {
        return await auth0.middleware(request);
    } catch (error) {
        console.error("Auth0 middleware error:", error);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
}
