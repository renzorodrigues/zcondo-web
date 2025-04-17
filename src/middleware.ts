import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rotas públicas que não precisam de autenticação
const publicRoutes = ['/login', '/register', '/'];

// Lista de rotas protegidas que precisam de autenticação
const protectedRoutes = ['/dashboard', '/condominios', '/usuarios', '/configuracoes'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const userData = request.cookies.get('user_data')?.value;

  // Verificar se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Verificar se a rota atual é pública
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // Se for uma rota protegida e não tiver token ou dados do usuário, redirecionar para login
  if (isProtectedRoute && (!refreshToken || !userData)) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Se for uma rota pública e tiver token e dados do usuário, redirecionar para dashboard
  if (isPublicRoute && refreshToken && userData && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurar quais rotas o middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 