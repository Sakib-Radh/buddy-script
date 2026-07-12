import { NextResponse } from 'next/server';
import { verifyToken, SESSION_COOKIE } from '@/lib/jwt';

const authPages = ['/login', '/register'];
const protectedPages = ['/feed'];

export async function middleware(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  let isLoggedIn = false;
  if (token) {
    try {
      await verifyToken(token);
      isLoggedIn = true;
    } catch {
      isLoggedIn = false;
    }
  }

  const { pathname } = request.nextUrl;

  if (isLoggedIn && authPages.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  if (!isLoggedIn && protectedPages.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/feed/:path*', '/login', '/register'],
};
