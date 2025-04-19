import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rotas públicas que não requerem autenticação
const publicRoutes = ['/', '/login', '/register', '/register/confirmation', '/landing', '/activate'];

// Função para verificar se uma rota é pública
const isPublicRoute = (pathname: string) => {
  return publicRoutes.includes(pathname) || pathname.startsWith('/activate/');
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Se não for uma rota pública e o usuário não estiver autenticado, redireciona para o login
  if (!isPublicRoute(pathname) && !token && !refreshToken) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se for uma rota pública e o usuário estiver autenticado, redireciona para o dashboard
  if (isPublicRoute(pathname) && (token || refreshToken)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

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